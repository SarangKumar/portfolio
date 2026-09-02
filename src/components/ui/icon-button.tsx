import { cn } from "@/lib/cn";
import { Button, type ButtonProps } from "@/components/ui/button";

const iconButtonSizes = {
  sm: "size-7 px-0",
  md: "size-8 px-0",
} as const;

export type IconButtonProps = Omit<ButtonProps, "aria-label"> & {
  "aria-label": string;
};

export function IconButton({
  className,
  size = "md",
  ...props
}: IconButtonProps) {
  return (
    <Button
      className={cn(iconButtonSizes[size], className)}
      size={size}
      {...props}
    />
  );
}
