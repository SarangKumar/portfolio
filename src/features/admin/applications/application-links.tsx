import NextLink from "next/link";
import {
  buttonClassName,
  buttonSizes,
  buttonVariants,
} from "@/components/ui/button";
import { cn } from "@/lib/cn";

export function CreateApplicationLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <NextLink
      href={href}
      className={cn(
        buttonClassName.base,
        buttonVariants.primary,
        buttonSizes.sm,
        "hover:text-primary-foreground",
      )}
    >
      {label}
    </NextLink>
  );
}
