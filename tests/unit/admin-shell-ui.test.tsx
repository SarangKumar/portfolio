import { describe, expect, it } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";
import { AdminMobileNav } from "@/features/admin/admin-mobile-nav";
import { AdminNav, type AdminNavCopy } from "@/features/admin/admin-nav";
import { SignOutForm } from "@/features/auth/sign-out-form";
import { adminNavItems } from "@/config/admin-navigation";

jest.mock("../../src/features/auth/actions", () => ({
  signOutAction: async () => undefined,
}));

const labels: AdminNavCopy = {
  dashboard: "Dashboard",
  projects: "Projects",
  applications: "Applications",
  jobs: "Job Search",
  interviews: "Interviews",
  companies: "Companies",
  resumes: "Resumes",
  letters: "Cover Letters",
  notes: "Notes",
  analytics: "Analytics",
  settings: "Settings",
};

describe("AdminNav", () => {
  it("renders workspace destinations and the current page", () => {
    render(
      <AdminNav
        items={adminNavItems}
        labels={labels}
        pathname="/admin/applications"
      />,
    );

    expect(screen.getByRole("link", { name: "Dashboard" })).toHaveAttribute(
      "href",
      "/admin",
    );
    expect(screen.getByRole("link", { name: "Applications" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(
      screen.getByRole("link", { name: "Job Search" }),
    ).not.toHaveAttribute("aria-current");
  });
});

describe("AdminMobileNav", () => {
  it("opens a dialog of destinations and closes on Escape", () => {
    render(
      <AdminMobileNav
        labels={labels}
        pathname="/admin"
        openLabel="Open workspace menu"
        closeLabel="Close workspace menu"
        navLabel="Workspace"
      />,
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Open workspace menu" }),
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Interviews" }),
    ).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });

    expect(
      screen.getByRole("button", { name: "Open workspace menu" }),
    ).toHaveAttribute("aria-expanded", "false");
  });
});

describe("SignOutForm", () => {
  it("renders an accessible logout submit control", () => {
    render(<SignOutForm label="Sign out" />);

    expect(screen.getByRole("button", { name: "Sign out" })).toHaveAttribute(
      "type",
      "submit",
    );
  });
});
