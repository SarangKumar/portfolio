import { describe, expect, it } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";
import {
  ExperienceTimeline,
  type ExperienceTimelineCopy,
  type ExperienceTimelineItem,
} from "@/features/experience/experience-timeline";

const copy: ExperienceTimelineCopy = {
  groupBy: "Arrange experience by",
  byTime: "Time",
  byCompany: "Company",
  byRole: "Role",
  timeline: "Experience timeline",
  details: "Role details",
  technologies: "Technologies",
  projects: "Projects",
  achievements: "Impact",
  noRelated: "None linked yet.",
  noDescription: "A role description will be published here.",
  noAchievements: "Impact notes will be published here when they exist.",
};

const items: readonly ExperienceTimelineItem[] = [
  {
    id: "acme",
    company: "Example Co",
    role: "Engineer",
    startDate: "2020-01",
    endDate: "2022-06",
    periodLabel: "Jan 2020 – Jun 2022",
    description: "Built internal tools.",
    technologies: [{ id: "ts", label: "TypeScript", href: "/skills" }],
    projects: [{ id: "proj-1", label: "Internal tool" }],
    achievements: ["Shipped the internal tool."],
  },
  {
    id: "globex",
    company: "Other Co",
    role: "Lead",
    startDate: "2022-07",
    endDate: null,
    periodLabel: "Jul 2022 – Present",
    description: null,
    technologies: [],
    projects: [],
    achievements: [],
  },
];

describe("ExperienceTimeline", () => {
  it("selects a role and shows its public details", () => {
    render(<ExperienceTimeline items={items} copy={copy} />);

    expect(screen.getByText("Built internal tools.")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Lead/ }));

    expect(
      screen.getByText("A role description will be published here."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Lead/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("groups the same records by company", () => {
    render(<ExperienceTimeline items={items} copy={copy} />);

    fireEvent.click(screen.getByRole("button", { name: "Company" }));

    expect(screen.getByLabelText("Arrange experience by")).toBeInTheDocument();
    expect(screen.getAllByText("Example Co").length).toBeGreaterThan(1);
    expect(screen.getAllByText("Other Co").length).toBeGreaterThan(1);
  });
});
