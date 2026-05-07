"use client";

import { useState } from "react";
import { ArrowRight, MapPin, Search, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const categories = [
  { label: "All produce", value: "all" },
  { label: "Vegetables", value: "vegetables" },
  { label: "Fruits", value: "fruits" },
  { label: "Grains", value: "grains" },
  { label: "Dairy", value: "dairy" },
];

export function HeroSearch() {
  const [category, setCategory] = useState("all");

  return (
    <motion.form
      action="#featured-products"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="glass-panel mx-auto mt-8 grid w-full max-w-3xl gap-3 rounded-3xl p-3 shadow-2xl md:grid-cols-[1fr_190px_auto]"
    >
      <div className="bg-background/70 ring-border/70 flex h-12 items-center gap-3 rounded-2xl px-4 ring-1">
        <Search className="text-primary size-5" aria-hidden="true" />
        <Input
          name="q"
          placeholder="Search fresh tomatoes, basmati rice, farm milk..."
          className="h-full border-0 bg-transparent px-0 shadow-none ring-0 focus-visible:ring-0"
        />
      </div>

      <Select
        value={category}
        onValueChange={(value) => {
          if (value) setCategory(value);
        }}
      >
        <SelectTrigger className="bg-background/70 ring-border/70 h-12 w-full rounded-2xl px-4 ring-1">
          <span className="flex items-center gap-2">
            <SlidersHorizontal
              className="text-primary size-4"
              aria-hidden="true"
            />
            <SelectValue placeholder="Category" />
          </span>
        </SelectTrigger>
        <SelectContent className="rounded-2xl">
          {categories.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        type="submit"
        size="lg"
        className="farm-gradient shadow-primary/20 h-12 rounded-2xl px-6 text-white shadow-xl transition-transform hover:scale-[1.02]"
      >
        Find farms
        <ArrowRight className="size-4" aria-hidden="true" />
      </Button>

      <input type="hidden" name="category" value={category} />
      <div className="text-muted-foreground flex items-center gap-2 px-2 text-xs font-medium md:col-span-3">
        <MapPin className="text-primary size-3.5" aria-hidden="true" />
        Demo city: Bengaluru. Fresh farm drops, transparent pricing.
      </div>
    </motion.form>
  );
}
