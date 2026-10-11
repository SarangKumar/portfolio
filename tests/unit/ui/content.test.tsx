import { describe, expect, it } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

describe("Card", () => {
  it("composes heading and body content", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
          <CardDescription>Last 7 days</CardDescription>
        </CardHeader>
        <CardContent>42 sessions</CardContent>
      </Card>,
    );

    expect(
      screen.getByRole("heading", { level: 2, name: "Overview" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Last 7 days")).toBeInTheDocument();
    expect(screen.getByText("42 sessions")).toBeInTheDocument();
  });
});

describe("Separator", () => {
  it("renders a native <hr> when horizontal", () => {
    render(<Separator />);
    expect(screen.getByRole("separator").tagName).toBe("HR");
  });

  it("exposes vertical orientation", () => {
    render(<Separator orientation="vertical" />);
    expect(screen.getByRole("separator")).toHaveAttribute(
      "aria-orientation",
      "vertical",
    );
  });
});

describe("Skeleton", () => {
  it("is hidden from assistive technology", () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
  });
});
