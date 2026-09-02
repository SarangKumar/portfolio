import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export type CardProps = ComponentProps<"div">;

export function Card({ className, ...props }: CardProps) {
  return <div className={cn("surface-card pad-card", className)} {...props} />;
}

export type CardHeaderProps = ComponentProps<"div">;

export function CardHeader({ className, ...props }: CardHeaderProps) {
  return <div className={cn("stack-compact", className)} {...props} />;
}

export type CardTitleProps = ComponentProps<"h2">;

export function CardTitle({ className, ...props }: CardTitleProps) {
  return <h2 className={cn("type-heading", className)} {...props} />;
}

export type CardDescriptionProps = ComponentProps<"p">;

export function CardDescription({ className, ...props }: CardDescriptionProps) {
  return (
    <p
      className={cn("type-small text-muted-foreground", className)}
      {...props}
    />
  );
}

export type CardContentProps = ComponentProps<"div">;

export function CardContent({ className, ...props }: CardContentProps) {
  return <div className={cn("mt-2 stack-compact", className)} {...props} />;
}
