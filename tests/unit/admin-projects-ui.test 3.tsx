import { describe, expect, it } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import { ProjectList } from "@/features/admin/projects/project-list";

describe("admin project list", () => {
  it("renders an empty state and published status without leaking notes", () => {
    const { rerender } = render(
      <ProjectList
        projects={[]}
        copy={{
          empty: "No projects yet.",
          edit: "Edit",
          status: {
            draft: "Draft",
            published: "Published",
            archived: "Archived",
          },
        }}
      />,
    );

    expect(screen.getByRole("status")).toHaveTextContent("No projects yet.");

    rerender(
      <ProjectList
        projects={[
          {
            key: "proj-public-app",
            slug: "public-app",
            title: "Public app",
            status: "published",
            updatedAt: "2026-01-01T00:00:00.000Z",
          },
        ]}
        copy={{
          empty: "No projects yet.",
          edit: "Edit",
          status: {
            draft: "Draft",
            published: "Published",
            archived: "Archived",
          },
        }}
      />,
    );

    expect(screen.getByText("Public app")).toBeInTheDocument();
    expect(screen.getByText("Published")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Edit" })).toHaveAttribute(
      "href",
      "/admin/projects/proj-public-app",
    );
    expect(screen.queryByText("admin-only")).not.toBeInTheDocument();
  });
});
