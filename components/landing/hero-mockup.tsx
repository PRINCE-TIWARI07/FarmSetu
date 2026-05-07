"use client";

import {
  ArrowUpRight,
  CheckCircle2,
  Leaf,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const produceCards = [
  {
    name: "Organic Tomatoes",
    farm: "Nandi Valley Farm",
    price: "₹42/kg",
    image:
      "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Alphonso Mangoes",
    farm: "Ratnagiri Direct",
    price: "₹180/dozen",
    image:
      "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&w=700&q=80",
  },
];

export function HeroMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 26 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto mt-10 w-full max-w-5xl sm:mt-14"
    >
      <div className="from-primary/20 via-accent/20 absolute inset-x-8 -top-8 h-36 rounded-[3rem] bg-gradient-to-r to-emerald-300/20 blur-3xl" />

      <Card className="glass-panel bg-card/80 shadow-primary/15 relative overflow-hidden rounded-2xl border-white/50 p-2 shadow-2xl sm:rounded-[2rem] sm:p-3 md:p-4">
        <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
          <div className="relative min-h-[320px] overflow-hidden rounded-2xl bg-[linear-gradient(140deg,#062d21_0%,#0f6b3f_44%,#d5f56d_100%)] p-4 text-white sm:min-h-[390px] sm:rounded-[1.5rem] sm:p-6">
            <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,.16)_0%,transparent_32%,rgba(255,255,255,.14)_64%,transparent_100%)]" />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/35 to-transparent" />

            <div className="relative flex items-center justify-between">
              <Badge className="rounded-full border-white/20 bg-white/16 text-white backdrop-blur-md">
                Live farm feed
              </Badge>
              <div className="rounded-full bg-white/15 p-2 backdrop-blur-md">
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </div>
            </div>

            <div className="relative mt-16 max-w-md">
              <p className="text-sm font-medium text-white/75">
                Direct harvest window
              </p>
              <h2 className="mt-3 max-w-sm text-3xl leading-tight font-semibold tracking-normal sm:text-4xl">
                Fresh batches from verified local farms
              </h2>
            </div>

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute right-4 bottom-4 w-[min(210px,calc(100%-2rem))] rounded-2xl border border-white/20 bg-white/15 p-3 backdrop-blur-xl sm:right-5 sm:bottom-5 sm:rounded-3xl sm:p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-white text-emerald-700">
                  <Truck className="size-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Today by 7 PM</p>
                  <p className="text-xs text-white/70">12 farm drops nearby</p>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="grid gap-4">
            <div className="border-border/70 bg-background/75 rounded-2xl border p-4 shadow-sm sm:rounded-[1.5rem]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">
                    Buyer savings
                  </p>
                  <p className="mt-1 text-3xl font-semibold tracking-normal">
                    28%
                  </p>
                </div>
                <div className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-2xl">
                  <ShieldCheck className="size-5" aria-hidden="true" />
                </div>
              </div>
              <div className="bg-muted mt-4 h-2 rounded-full">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "72%" }}
                  transition={{ duration: 1.1, delay: 0.8 }}
                  className="bg-primary h-full rounded-full"
                />
              </div>
            </div>

            {produceCards.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.45 + index * 0.12 }}
                className="group border-border/70 bg-background/75 hover:shadow-primary/10 grid grid-cols-[84px_1fr] gap-3 rounded-2xl border p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:grid-cols-[96px_1fr] sm:gap-4 sm:rounded-[1.5rem]"
              >
                <div
                  className="h-20 rounded-xl bg-cover bg-center sm:h-24 sm:rounded-2xl"
                  style={{ backgroundImage: `url(${item.image})` }}
                  aria-hidden="true"
                />
                <div className="flex min-w-0 flex-col justify-between py-1">
                  <div>
                    <p className="truncate font-semibold">{item.name}</p>
                    <p className="text-muted-foreground mt-1 truncate text-sm">
                      {item.farm}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-semibold">
                      {item.price}
                    </span>
                    <span className="bg-primary/10 text-primary rounded-full px-2.5 py-1 text-xs font-medium">
                      Direct
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>

      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="glass-panel absolute top-12 -left-2 hidden rounded-2xl p-4 shadow-xl md:block"
      >
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl">
            <Leaf className="size-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold">412 farmers</p>
            <p className="text-muted-foreground text-xs">ready to sell today</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
        className="glass-panel absolute -right-3 bottom-12 hidden rounded-2xl p-4 shadow-xl md:block"
      >
        <div className="flex items-center gap-3">
          <CheckCircle2 className="text-primary size-5" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold">No middlemen</p>
            <p className="text-muted-foreground text-xs">
              verified farm pricing
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
