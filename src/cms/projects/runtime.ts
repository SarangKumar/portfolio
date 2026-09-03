import "server-only";

import { createProjectService } from "@/cms/projects/service";
import { prismaProjectStore } from "@/cms/projects/prisma-store";
import { invalidatePublicProject } from "@/cms/revalidate";

export function getProjectService() {
  return createProjectService({
    store: prismaProjectStore,
    invalidate: invalidatePublicProject,
  });
}
