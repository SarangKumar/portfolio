import { cn } from "@/lib/cn";
import {
  buttonClassName,
  buttonSizes,
  buttonVariants,
  type ButtonSize,
  type ButtonVariant,
} from "@/components/ui/button";
import { Link, type TextLinkProps } from "@/components/ui/link";

export type ButtonLinkProps = Omit<TextLinkProps, "variant"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function ButtonLink({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(
        buttonClassName.base,
        buttonVariants[variant],
        buttonSizes[size],
        "hover:text-inherit",
        variant === "primary" && "hover:text-primary-foreground",
        variant === "destructive" && "hover:text-destructive-foreground",
        (variant === "outline" ||
          variant === "ghost" ||
          variant === "secondary") &&
          "hover:text-foreground",
        className,
      )}
      {...props}
    />
  );
}
