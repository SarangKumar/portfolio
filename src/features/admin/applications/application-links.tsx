import NextLink from "next/link";
import { buttonVariants } from "@/components/ui/button";
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
        buttonVariants({ variant: "default", size: "sm" }),
        "hover:text-primary-foreground",
      )}
    >
      {label}
    </NextLink>
  );
}
