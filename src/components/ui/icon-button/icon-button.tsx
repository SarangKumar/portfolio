import type { Ref } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";

// Maps text sizes onto the Button's square icon sizes.
const iconSizes = {
  xs: "icon-xs",
  sm: "icon-sm",
  default: "icon",
  lg: "icon-lg",
} as const;

export type IconButtonSize = keyof typeof iconSizes;

export type IconButtonProps = Omit<ButtonProps, "aria-label" | "size"> & {
  "aria-label": string;
  size?: IconButtonSize;
  ref?: Ref<HTMLButtonElement>;
};

export function IconButton({ size = "default", ...props }: IconButtonProps) {
  return <Button size={iconSizes[size]} {...props} />;
}
