"use client";

import { useEffect, useState } from "react";
import {
  subscribeToRealtimeTable,
  type RealtimeStatus,
  type RealtimeTable,
} from "@/lib/supabase/realtime";

type UseRealtimeTableOptions = {
  table: RealtimeTable;
  event?: "*" | "INSERT" | "UPDATE" | "DELETE";
  filter?: string;
  channelName?: string;
  enabled?: boolean;
  onChange: Parameters<typeof subscribeToRealtimeTable>[0]["onChange"];
};

export function useRealtimeTable({
  table,
  event = "*",
  filter,
  channelName,
  enabled = true,
  onChange,
}: UseRealtimeTableOptions) {
  const [status, setStatus] = useState<RealtimeStatus | "IDLE">("IDLE");

  useEffect(() => {
    if (!enabled) {
      setStatus("IDLE");
      return;
    }

    let mounted = true;
    const unsubscribe = subscribeToRealtimeTable({
      table,
      event,
      filter,
      channelName,
      onChange,
      onStatusChange(nextStatus) {
        if (mounted) {
          setStatus(nextStatus);
        }
      },
    });

    return () => {
      mounted = false;
      void unsubscribe();
    };
  }, [channelName, enabled, event, filter, onChange, table]);

  return { status };
}
