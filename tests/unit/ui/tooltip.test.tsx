import { describe, expect, it } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";
import { Tooltip } from "@/components/ui/tooltip";

describe("Tooltip", () => {
  it("shows on focus and hides on Escape", () => {
    render(
      <Tooltip content="More info">
        <button type="button">Hint</button>
      </Tooltip>,
    );

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

    fireEvent.focus(screen.getByRole("button", { name: "Hint" }));
    expect(screen.getByRole("tooltip")).toHaveTextContent("More info");
    expect(screen.getByRole("button", { name: "Hint" })).toHaveAttribute(
      "aria-describedby",
    );

    fireEvent.keyDown(screen.getByRole("button", { name: "Hint" }), {
      key: "Escape",
    });
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });
});
