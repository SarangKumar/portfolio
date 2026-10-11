// Source: Vinyaas registry `card` (new-york).
// Local changes: `cn` from @/lib/cn; CardTitle renders an <h2> (Vinyaas uses a
// <div>) so card titles stay in the page's heading outline; props types are
// exported for the ui barrel.
import React from "react";

import { cn } from "@/lib/cn";

const cardSize = {
  default: "gap-4 p-4",
  sm: "gap-2 p-3",
} as const;

export type CardSize = keyof typeof cardSize;

export type CardProps = React.ComponentProps<"div"> & {
  size?: CardSize;
};

export function Card({ className, size = "default", ...props }: CardProps) {
  return (
    <div
      data-size={size}
      className={cn(
        "bg-card text-card-foreground border-border flex flex-col rounded-md border",
        cardSize[size],
        className,
      )}
      {...props}
    />
  );
}

export type CardHeaderProps = React.ComponentProps<"header">;

export function CardHeader({ className, ...props }: CardHeaderProps) {
  return (
    <header
      className={cn(
        "grid grid-cols-1 items-start gap-1 has-[[data-slot=card-action]]:grid-cols-[minmax(0,1fr)_auto] has-[[data-slot=card-action]]:gap-x-3",
        className,
      )}
      {...props}
    />
  );
}

export type CardTitleProps = React.ComponentProps<"h2">;

export function CardTitle({ className, ...props }: CardTitleProps) {
  return (
    <h2
      className={cn(
        "min-w-0 text-sm leading-none font-semibold break-words",
        className,
      )}
      {...props}
    />
  );
}

export type CardDescriptionProps = React.ComponentProps<"p">;

export function CardDescription({ className, ...props }: CardDescriptionProps) {
  return (
    <p
      className={cn(
        "text-muted-foreground min-w-0 text-sm leading-5 break-words",
        className,
      )}
      {...props}
    />
  );
}

export type CardActionProps = React.ComponentProps<"div">;

export function CardAction({ className, ...props }: CardActionProps) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className,
      )}
      {...props}
    />
  );
}

export type CardContentProps = React.ComponentProps<"div">;

export function CardContent({ className, ...props }: CardContentProps) {
  return <div className={cn("flex flex-col gap-3", className)} {...props} />;
}

export type CardFooterProps = React.ComponentProps<"footer">;

export function CardFooter({ className, ...props }: CardFooterProps) {
  return (
    <footer className={cn("flex items-center gap-2", className)} {...props} />
  );
}
