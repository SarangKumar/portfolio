import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="stack-section" aria-busy="true">
      <div className="stack-compact border-b border-border pb-5">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-4 max-w-prose" />
      </div>
      <Skeleton className="h-28 w-full" />
      <Skeleton className="h-28 w-full" />
    </div>
  );
}
