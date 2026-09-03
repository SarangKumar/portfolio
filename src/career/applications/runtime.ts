import "server-only";

import { prismaJobApplicationStore } from "@/career/applications/prisma-store";
import { createJobApplicationService } from "@/career/applications/service";

export function getJobApplicationService() {
  return createJobApplicationService({
    store: prismaJobApplicationStore,
  });
}
