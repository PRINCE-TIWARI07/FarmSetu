import Image from "next/image";
import { Heart, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type ProductCardData = {
  name: string;
  farmer: string;
  price: string;
  unit: string;
  image: string;
  stock: "In stock" | "Few left" | "Pre-order";
  location: string;
};

type ProductCardProps = {
  product: ProductCardData;
};

export function ProductCard({ product }: ProductCardProps) {
  const isLowStock = product.stock === "Few left";

  return (
    <Card className="group border-border/70 bg-card hover:shadow-primary/10 overflow-hidden rounded-xl p-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="bg-muted relative aspect-[4/3] overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <Button
          variant="secondary"
          size="icon-sm"
          className="bg-background/90 absolute top-3 right-3 rounded-full shadow-sm backdrop-blur"
          aria-label={`Save ${product.name}`}
        >
          <Heart className="size-4" aria-hidden="true" />
        </Button>
      </div>

      <div className="grid gap-4 p-4">
        <div>
          <div className="flex items-start justify-between gap-3">
            <h3 className="line-clamp-1 font-semibold tracking-normal">
              {product.name}
            </h3>
            <Badge
              variant="outline"
              className={cn(
                "shrink-0 rounded-full px-2.5",
                isLowStock
                  ? "border-amber-300 bg-amber-50 text-amber-700 dark:bg-amber-950/30"
                  : "border-primary/20 bg-primary/5 text-primary",
              )}
            >
              {product.stock}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1 text-sm">
            {product.farmer} · {product.location}
          </p>
        </div>

        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-lg font-semibold tracking-normal">
              {product.price}
            </p>
            <p className="text-muted-foreground text-xs">per {product.unit}</p>
          </div>
          <Button
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90 min-h-10 rounded-full px-4 shadow-sm"
          >
            <ShoppingCart className="size-4" aria-hidden="true" />
            Add
          </Button>
        </div>
      </div>
    </Card>
  );
}
