import { describe, expect, it } from "@jest/globals";
import {
  APPLICATION_CREATE_PATH,
  applicationDetailHref,
  applicationEditHref,
  applicationTrackerHasFilters,
  applicationTrackerHref,
  formatApplicationSalary,
  parseApplicationDetailSearchParams,
  parseApplicationTrackerSearchParams,
  safeApplicationsReturnPath,
} from "@/career/applications/query";

describe("application tracker URL state", () => {
  it("parses filters, search, sort, and pagination from query params", () => {
    const state = parseApplicationTrackerSearchParams({
      q: "  Jordan  ",
      status: "oa",
      company: "Acme",
      location: "Bengaluru",
      priority: "high",
      appliedFrom: "2026-03-01",
      appliedTo: "2026-04-01",
      sort: "company",
      dir: "asc",
      page: "2",
      pageSize: "10",
    });

    expect(state).toMatchObject({
      search: "Jordan",
      status: "oa",
      company: "Acme",
      location: "Bengaluru",
      priority: "high",
      appliedFrom: "2026-03-01",
      appliedTo: "2026-04-01",
      sort: "company",
      dir: "asc",
      page: 2,
      pageSize: 10,
    });
    expect(applicationTrackerHasFilters(state)).toBe(true);
    expect(applicationTrackerHref(state)).toBe(
      "/admin/applications?q=Jordan&status=oa&company=Acme&location=Bengaluru&priority=high&appliedFrom=2026-03-01&appliedTo=2026-04-01&sort=company&dir=asc&page=2&pageSize=10",
    );
  });

  it("ignores unknown statuses, unsafe return paths, and default query noise", () => {
    const state = parseApplicationTrackerSearchParams({
      status: "phone_screen",
      dir: "sideways",
      appliedFrom: "March 1",
      page: "0",
    });

    expect(state.status).toBeUndefined();
    expect(state.dir).toBe("desc");
    expect(state.appliedFrom).toBe("");
    expect(state.page).toBe(1);
    expect(applicationTrackerHref(state)).toBe("/admin/applications");
    expect(safeApplicationsReturnPath("/admin/applications?q=acme")).toBe(
      "/admin/applications?q=acme",
    );
    expect(
      safeApplicationsReturnPath("https://evil.example/admin/applications"),
    ).toBe("/admin/applications");
    expect(safeApplicationsReturnPath("/admin/projects")).toBe(
      "/admin/applications",
    );
    expect(
      safeApplicationsReturnPath("/admin/applications/app-acme?from=%2Fadmin"),
    ).toBe("/admin/applications/app-acme?from=%2Fadmin");
    expect(safeApplicationsReturnPath("/admin/applications/../../evil")).toBe(
      "/admin/applications",
    );
    expect(safeApplicationsReturnPath("/admin/applications/..")).toBe(
      "/admin/applications",
    );
    expect(applicationDetailHref("app-acme")).toBe(
      "/admin/applications/app-acme",
    );
    expect(
      applicationDetailHref("app-acme", {
        from: "/admin/applications?q=acme",
        edit: true,
      }),
    ).toBe(
      "/admin/applications/app-acme?from=%2Fadmin%2Fapplications%3Fq%3Dacme&edit=1",
    );
    expect(
      applicationDetailHref("app-acme", {
        from: "/admin/applications?q=acme",
        saved: true,
      }),
    ).toBe(
      "/admin/applications/app-acme?from=%2Fadmin%2Fapplications%3Fq%3Dacme&saved=1",
    );
    expect(
      applicationEditHref("app-acme", { from: "/admin/applications?q=acme" }),
    ).toBe(
      "/admin/applications/app-acme/edit?from=%2Fadmin%2Fapplications%3Fq%3Dacme",
    );
    expect(APPLICATION_CREATE_PATH).toBe("/admin/applications/new");
    expect(
      safeApplicationsReturnPath("/admin/applications/app-acme/edit"),
    ).toBe("/admin/applications/app-acme/edit");
    expect(safeApplicationsReturnPath("/admin/applications/new")).toBe(
      "/admin/applications/new",
    );
    expect(
      parseApplicationDetailSearchParams({
        from: "/admin/applications?q=acme",
        edit: "1",
        saved: "1",
      }),
    ).toEqual({
      from: "/admin/applications?q=acme",
      edit: true,
      saved: true,
    });
    expect(formatApplicationSalary(4500000, "INR", "—")).toBe("4500000 INR");
    expect(formatApplicationSalary(null, null, "—")).toBe("—");
  });
});
