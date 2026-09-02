export type ContactFormState = {
  status: "idle" | "success" | "error" | "unavailable";
  fieldErrors?: Partial<Record<"name" | "email" | "message", string>>;
};

export const initialContactFormState: ContactFormState = {
  status: "idle",
};
