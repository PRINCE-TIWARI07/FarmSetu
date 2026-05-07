import { Skeleton } from "@/components/ui/skeleton";

export function DashboardLoading() {
  return (
    <main className="min-h-screen">
      <div className="container-page py-6 sm:py-8">
        <Skeleton className="h-10 w-24 rounded-full" />
        <div className="mt-8 grid gap-3">
          <Skeleton className="h-5 w-36 rounded-full" />
          <Skeleton className="h-10 w-full max-w-xl rounded-xl" />
          <Skeleton className="h-5 w-full max-w-3xl rounded-full" />
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-36 rounded-2xl" />
          ))}
        </div>
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <Skeleton className="h-56 rounded-2xl" />
          <Skeleton className="h-56 rounded-2xl" />
        </div>
      </div>
    </main>
  );
}
