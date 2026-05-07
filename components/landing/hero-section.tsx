"use client";

import Link from "next/link";
import { ArrowRight, BadgeCheck, ChevronRight, Store } from "lucide-react";
import { motion } from "framer-motion";
import { HeroMockup } from "@/components/landing/hero-mockup";
import { HeroSearch } from "@/components/landing/hero-search";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const stats = [
  { value: "2.4x", label: "better farmer margins" },
  { value: "18k", label: "kg produce moved" },
  { value: "42m", label: "avg farm-to-cart time" },
];

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden pt-28 sm:pt-32">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(34,197,94,.16)_0%,transparent_34%,rgba(250,204,21,.12)_72%,transparent_100%)]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-[620px] bg-[radial-gradient(ellipse_at_top,rgba(22,163,74,.25),transparent_58%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(22,163,74,.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(22,163,74,.08)_1px,transparent_1px)] [mask-image:linear-gradient(to_bottom,black,transparent_72%)] bg-[size:54px_54px]" />

      <div className="container-page">
        <div className="mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <Badge className="border-primary/20 bg-primary/10 text-primary rounded-full px-4 py-2 text-sm font-medium shadow-sm">
              <BadgeCheck className="size-4" aria-hidden="true" />
              Direct farm commerce for the next billion buyers
              <ChevronRight className="size-4" aria-hidden="true" />
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="text-foreground mx-auto mt-7 max-w-5xl text-4xl leading-[1.04] font-semibold tracking-normal sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Fresh produce, fair prices, delivered straight from farmers.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.18,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="text-muted-foreground mx-auto mt-5 max-w-3xl text-base leading-7 sm:mt-6 sm:text-lg sm:leading-8"
          >
            FarmSetu turns fragmented agriculture supply into a premium digital
            marketplace where buyers discover verified farms and farmers keep
            more of every sale.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.28,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link
              href="#featured-products"
              className={cn(
                buttonVariants({ size: "lg" }),
                "farm-gradient shadow-primary/25 min-h-12 w-full rounded-full px-6 py-3 text-white shadow-xl transition-transform hover:scale-[1.02] sm:w-auto sm:px-7",
              )}
            >
              Shop fresh produce
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href="/farmer/products/new"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "border-primary/20 bg-background/70 hover:bg-primary/10 min-h-12 w-full rounded-full px-6 py-3 shadow-sm backdrop-blur transition-transform hover:scale-[1.02] sm:w-auto sm:px-7",
              )}
            >
              <Store className="text-primary size-4" aria-hidden="true" />
              Start selling
            </Link>
          </motion.div>

          <HeroSearch />

          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.45,
                },
              },
            }}
            className="mx-auto mt-8 grid max-w-3xl gap-3 sm:grid-cols-3"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className="glass-panel rounded-2xl px-5 py-4 text-left"
              >
                <p className="text-foreground text-2xl font-semibold tracking-normal">
                  {stat.value}
                </p>
                <p className="text-muted-foreground mt-1 text-sm">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <HeroMockup />
      </div>
    </section>
  );
}
