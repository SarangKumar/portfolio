import { describe, expect, it } from "@jest/globals";
import { isNavItemActive, navItems } from "@/config/navigation";

describe("isNavItemActive", () => {
  it("treats home as active only on the root path", () => {
    expect(isNavItemActive("/", "/")).toBe(true);
    expect(isNavItemActive("/about", "/")).toBe(false);
  });

  it("matches nested paths for non-root items", () => {
    expect(isNavItemActive("/blog", "/blog")).toBe(true);
    expect(isNavItemActive("/blog/hello", "/blog")).toBe(true);
    expect(isNavItemActive("/about", "/blog")).toBe(false);
  });
});

describe("navItems", () => {
  it("covers the primary public sections once", () => {
    const hrefs = navItems.map((item) => item.href);
    expect(hrefs).toEqual([
      "/",
      "/about",
      "/experience",
      "/skills",
      "/projects",
      "/resume",
      "/blog",
      "/contact",
    ]);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });
});
