import { revalidatePath, updateTag } from "next/cache";
import { publicContentCacheTags } from "@/content/cache-tags";

export type PublicProjectInvalidation = {
  slug: string;
  previousSlug?: string;
};

export type InvalidatePublicProject = (
  change: PublicProjectInvalidation,
) => void;

export function invalidatePublicProject(
  change: PublicProjectInvalidation,
): void {
  updateTag(publicContentCacheTags.projects);
  revalidatePath("/projects");
  revalidatePath(`/projects/${change.slug}`);

  if (change.previousSlug && change.previousSlug !== change.slug) {
    revalidatePath(`/projects/${change.previousSlug}`);
  }
}
