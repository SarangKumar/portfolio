import { Skeleton } from "@/components/ui/skeleton";

export default function ApplicationsLoading() {
  return (
    <div className="stack-section" aria-busy="true">
      <div className="stack-compact border-b border-border pb-4">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-4 max-w-prose" />
      </div>
      <Skeleton className="h-36 w-full" />
      <div className="stack-compact">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    </div>
  );
}
