"use client";

import type {
  RealtimeChannel,
  RealtimePostgresChangesPayload,
  SupabaseClient,
} from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export type RealtimeTable =
  | "Product"
  | "ProductImage"
  | "Inventory"
  | "Order"
  | "OrderItem"
  | "Tracking"
  | "Notification";

export type RealtimeStatus =
  | "SUBSCRIBED"
  | "TIMED_OUT"
  | "CLOSED"
  | "CHANNEL_ERROR";

type RealtimePayload = RealtimePostgresChangesPayload<Record<string, unknown>>;
type RealtimeListener = (payload: RealtimePayload) => void;
type StatusListener = (status: RealtimeStatus) => void;

type RealtimeEntry = {
  channel: RealtimeChannel;
  listeners: Set<RealtimeListener>;
  statusListeners: Set<StatusListener>;
  supabase: SupabaseClient;
};

type SubscribeOptions = {
  table: RealtimeTable;
  event?: "*" | "INSERT" | "UPDATE" | "DELETE";
  filter?: string;
  channelName?: string;
  onChange: RealtimeListener;
  onStatusChange?: StatusListener;
};

const realtimeRegistry = new Map<string, RealtimeEntry>();

function getRealtimeKey({
  channelName,
  table,
  event = "*",
  filter = "",
}: Omit<SubscribeOptions, "onChange" | "onStatusChange">) {
  return [channelName ?? `public:${table}`, table, event, filter].join(":");
}

export function subscribeToRealtimeTable({
  table,
  event = "*",
  filter,
  channelName,
  onChange,
  onStatusChange,
}: SubscribeOptions) {
  const key = getRealtimeKey({ channelName, table, event, filter });
  let entry = realtimeRegistry.get(key);

  if (!entry) {
    const supabase = createSupabaseBrowserClient();
    const listeners = new Set<RealtimeListener>();
    const statusListeners = new Set<StatusListener>();
    const channel = supabase
      .channel(channelName ?? `public:${table}`)
      .on(
        "postgres_changes",
        {
          event,
          schema: "public",
          table,
          filter,
        },
        (payload) => {
          listeners.forEach((listener) => listener(payload as RealtimePayload));
        },
      )
      .subscribe((status) => {
        statusListeners.forEach((listener) =>
          listener(status as RealtimeStatus),
        );
      });

    entry = {
      channel,
      listeners,
      statusListeners,
      supabase,
    };

    realtimeRegistry.set(key, entry);
  }

  entry.listeners.add(onChange);

  if (onStatusChange) {
    entry.statusListeners.add(onStatusChange);
  }

  return async () => {
    const current = realtimeRegistry.get(key);

    if (!current) {
      return;
    }

    current.listeners.delete(onChange);

    if (onStatusChange) {
      current.statusListeners.delete(onStatusChange);
    }

    if (current.listeners.size === 0 && current.statusListeners.size === 0) {
      realtimeRegistry.delete(key);
      await current.supabase.removeChannel(current.channel);
    }
  };
}

export function getActiveRealtimeSubscriptionCount() {
  return realtimeRegistry.size;
}
