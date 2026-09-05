import { Skeleton } from "@/components/ui/skeleton";

export default function SignupLoading() {
  return (
    <div className="stack-section" aria-busy="true">
      <div className="stack-compact border-b border-border pb-8">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 max-w-sm" />
      </div>
      <Skeleton className="h-7 w-20" />
    </div>
  );
}
