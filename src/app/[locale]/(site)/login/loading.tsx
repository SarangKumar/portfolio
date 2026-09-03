import { Skeleton } from "@/components/ui/skeleton";

export default function LoginLoading() {
  return (
    <div className="stack-section" aria-busy="true">
      <div className="stack-compact border-b border-border pb-5">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-4 max-w-sm" />
      </div>
      <Skeleton className="h-8 w-full max-w-sm" />
      <Skeleton className="h-8 w-full max-w-sm" />
      <Skeleton className="h-7 w-20" />
    </div>
  );
}
