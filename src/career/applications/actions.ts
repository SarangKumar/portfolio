"use server";

import { redirect, unstable_rethrow } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdminMutation } from "@/cms/projects/guard";
import { isJobApplicationStatus } from "@/career/applications/status";
import {
  APPLICATIONS_PATH,
  applicationDetailHref,
  applicationDetailPath,
  safeApplicationsReturnPath,
} from "@/career/applications/query";
import type { JobApplicationFormState } from "@/career/applications/form-state";
import { persistJobApplicationWrite } from "@/career/applications/submit";
import { getJobApplicationService } from "@/career/applications/runtime";
import { validateJobApplicationStatusChange } from "@/career/applications/validation";

function readString(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

function returnTo(formData: FormData): string {
  return safeApplicationsReturnPath(readString(formData, "from"));
}

function revalidateApplication(key: string) {
  revalidatePath(APPLICATIONS_PATH);
  revalidatePath(applicationDetailPath(key));
}

async function runApplicationWriteAction(
  formData: FormData,
  mode: "create" | "update",
): Promise<JobApplicationFormState> {
  try {
    const auth = await requireAdminMutation();

    if (!auth.ok) {
      return { status: "error", code: "unauthorized" };
    }

    const result = await persistJobApplicationWrite({
      access: { status: "allowed", admin: auth.admin },
      service: getJobApplicationService(),
      formData,
      mode,
    });

    if (!result.ok) {
      return result.state;
    }

    revalidateApplication(result.key);
    redirect(
      applicationDetailHref(result.key, {
        from: mode === "update" ? returnTo(formData) : undefined,
        saved: true,
      }),
    );
  } catch (error) {
    unstable_rethrow(error);
    return { status: "error", code: "unavailable" };
  }
}

export async function createJobApplicationAction(
  _previous: JobApplicationFormState,
  formData: FormData,
): Promise<JobApplicationFormState> {
  return runApplicationWriteAction(formData, "create");
}

export async function updateJobApplicationAction(
  _previous: JobApplicationFormState,
  formData: FormData,
): Promise<JobApplicationFormState> {
  return runApplicationWriteAction(formData, "update");
}

export async function archiveJobApplicationAction(formData: FormData) {
  try {
    const auth = await requireAdminMutation();
    const path = returnTo(formData);

    if (!auth.ok) {
      redirect(path);
      return;
    }

    const key = readString(formData, "key");

    if (key) {
      await getJobApplicationService().archive(auth.admin, key);
      revalidateApplication(key);
    }

    redirect(path);
  } catch (error) {
    unstable_rethrow(error);
  }
}

export async function changeJobApplicationStatusAction(formData: FormData) {
  try {
    const auth = await requireAdminMutation();
    const path = returnTo(formData);

    if (!auth.ok) {
      redirect(path);
      return;
    }

    const key = readString(formData, "key");
    const parsed = validateJobApplicationStatusChange({
      status: readString(formData, "status"),
      reason: readString(formData, "reason"),
      note: readString(formData, "note"),
      rejectionReason: readString(formData, "rejectionReason"),
    });

    if (key && parsed.ok && isJobApplicationStatus(parsed.value.status)) {
      await getJobApplicationService().changeStatus(
        auth.admin,
        key,
        parsed.value.status,
        {
          reason: parsed.value.reason,
          note: parsed.value.note,
          rejectionReason: parsed.value.rejectionReason,
        },
      );
      revalidateApplication(key);
    }

    redirect(path);
  } catch (error) {
    unstable_rethrow(error);
  }
}
