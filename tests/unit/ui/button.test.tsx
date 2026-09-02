import { describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";

describe("Button", () => {
  it("fires click handlers when enabled", () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Save</Button>);

    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not fire click handlers when disabled", () => {
    const onClick = jest.fn();
    render(
      <Button disabled onClick={onClick}>
        Save
      </Button>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(onClick).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
  });

  it("defaults to type=button to avoid implicit form submit", () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole("button", { name: "Save" })).toHaveAttribute(
      "type",
      "button",
    );
  });
});

describe("IconButton", () => {
  it("exposes an accessible name and remains a button", () => {
    render(<IconButton aria-label="Close">×</IconButton>);

    expect(screen.getByRole("button", { name: "Close" })).toBeEnabled();
  });
});
