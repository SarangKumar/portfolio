import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type PageContainerProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "section";
};

export function PageContainer({
  children,
  className,
  as: Component = "div",
}: PageContainerProps) {
  return (
    <Component className={cn("app-container", className)}>{children}</Component>
  );
}
