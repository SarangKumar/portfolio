import { describe, expect, it } from "@jest/globals";
import { adminLayoutView } from "@/admin/layout-view";
import { adminNavItems, isAdminNavItemActive } from "@/config/admin-navigation";
import { createAdminRecord } from "@/admin/directory";

const activeAdmin = createAdminRecord("owner@example.com", "active");

describe("adminLayoutView", () => {
  it("sends unauthenticated visitors to login", () => {
    expect(adminLayoutView({ status: "unauthenticated" })).toBe("login");
  });

  it("keeps unauthorized sessions out of the admin shell", () => {
    expect(adminLayoutView({ status: "denied" })).toBe("denied");
  });

  it("renders the shell only for an active administrator", () => {
    expect(adminLayoutView({ status: "allowed", admin: activeAdmin })).toBe(
      "shell",
    );
  });
});

describe("admin navigation", () => {
  it("lists workspace sections once without a dashboard overlap", () => {
    const hrefs = adminNavItems.map((item) => item.href);

    expect(hrefs[0]).toBe("/admin");
    expect(hrefs).toEqual([
      "/admin",
      "/admin/applications",
      "/admin/jobs",
      "/admin/interviews",
      "/admin/companies",
      "/admin/resumes",
      "/admin/letters",
      "/admin/notes",
      "/admin/analytics",
      "/admin/settings",
    ]);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });

  it("marks dashboard active only on the admin root", () => {
    expect(isAdminNavItemActive("/admin", "/admin")).toBe(true);
    expect(isAdminNavItemActive("/admin/applications", "/admin")).toBe(false);
  });

  it("marks nested section paths as active", () => {
    expect(isAdminNavItemActive("/admin/jobs", "/admin/jobs")).toBe(true);
    expect(isAdminNavItemActive("/admin/jobs/saved", "/admin/jobs")).toBe(true);
    expect(isAdminNavItemActive("/admin/notes", "/admin/jobs")).toBe(false);
  });
});
