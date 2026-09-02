import { describe, expect, it } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

describe("Input", () => {
  it("is disabled when requested", () => {
    render(<Input aria-label="Email" disabled />);
    expect(screen.getByLabelText("Email")).toBeDisabled();
  });

  it("surfaces invalid state to assistive tech", () => {
    render(<Input aria-label="Email" aria-invalid />);
    expect(screen.getByLabelText("Email")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });
});

describe("Textarea", () => {
  it("is disabled when requested", () => {
    render(<Textarea aria-label="Notes" disabled />);
    expect(screen.getByLabelText("Notes")).toBeDisabled();
  });
});
