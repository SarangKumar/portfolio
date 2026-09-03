import { Skeleton } from "@/components/ui/skeleton";

export default function ApplicationEditLoading() {
  return (
    <div className="stack-section" aria-busy="true">
      <div className="stack-compact border-b border-border pb-4">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 max-w-prose" />
      </div>
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-64 w-full max-w-3xl" />
    </div>
  );
}
