import { Skeleton } from "@/components/ui/skeleton";

export default function ApplicationDetailLoading() {
  return (
    <div className="stack-section" aria-busy="true">
      <div className="stack-compact border-b border-border pb-4">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-40" />
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-48 w-full lg:col-span-2" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  );
}
