import type { LoginFieldErrors } from "@/auth/validation";

export type LoginFormState = {
  status: "idle" | "error" | "rateLimited";
  fieldErrors?: LoginFieldErrors;
};

export const initialLoginFormState: LoginFormState = {
  status: "idle",
};
