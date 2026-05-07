import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="min-h-screen px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-7xl gap-8">
        <div className="grid gap-3">
          <Skeleton className="h-8 w-40 rounded-full" />
          <Skeleton className="h-12 w-full max-w-2xl rounded-xl" />
          <Skeleton className="h-5 w-full max-w-xl rounded-full" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="aspect-[4/3] rounded-xl" />
          ))}
        </div>
      </div>
    </main>
  );
}
