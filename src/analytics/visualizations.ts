import type { SkillCategoryEvidence } from "@/lib/content";
import type { CartesianPoint, RadarPoint } from "@/components/charts/theme";

export function skillCategoryRadarPoints(
  evidence: readonly SkillCategoryEvidence[],
): readonly RadarPoint[] {
  return evidence
    .filter((item) => item.skillCount > 0)
    .map((item) => ({
      axis: item.label,
      projects: item.projectCount,
      roles: item.experienceCount,
    }));
}

export function hasUsefulRadarData(points: readonly RadarPoint[]): boolean {
  if (points.length < 3) {
    return false;
  }

  return points.some((point) => {
    const projects = Number(point.projects ?? 0);
    const roles = Number(point.roles ?? 0);

    return projects > 0 || roles > 0;
  });
}

export function hasUsefulPopularityData(
  points: readonly CartesianPoint[],
): boolean {
  return points.some((point) => point.value > 0);
}
