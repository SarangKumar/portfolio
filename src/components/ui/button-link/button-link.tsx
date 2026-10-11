import { cn } from "@/lib/cn";
import {
  buttonVariants,
  type ButtonSize,
  type ButtonVariant,
} from "@/components/ui/button";
import { Link, type TextLinkProps } from "@/components/ui/link";

// Link variants set their own hover color; pin it back to the button's so
// e.g. a primary ButtonLink doesn't turn orange-on-orange on hover.
const hoverText: Record<ButtonVariant, string> = {
  default: "hover:text-primary-foreground",
  secondary: "hover:text-secondary-foreground",
  outline: "hover:text-accent-foreground",
  ghost: "hover:text-accent-foreground",
  destructive: "hover:text-destructive",
  link: "hover:text-primary",
};

export type ButtonLinkProps = Omit<TextLinkProps, "variant"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function ButtonLink({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(
        buttonVariants({ variant, size }),
        hoverText[variant],
        className,
      )}
      {...props}
    />
  );
}
