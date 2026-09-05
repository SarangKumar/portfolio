export type ResumeVersion = {
  id: string;
  label: string;
  targetType: string;
  overview: string | null;
  notes: string | null;
  previewSrc: string | null;
  previewKind: "pdf" | "image" | null;
  fileSrc: string | null;
  fileName: string | null;
  isDefault: boolean;
  createdAt: string | null;
  updatedAt: string | null;
};

export const resumes: readonly ResumeVersion[] = [
  {
    id: "resume-sde-2026",
    label: "Software Engineer resume",
    targetType: "sde",
    overview:
      "2026 Software Engineer resume covering Komprise production work, internship rotation, PES University, and selected projects.",
    notes: null,
    previewSrc: "/resumes/Sarang_Kumar_SDE.pdf",
    previewKind: "pdf",
    fileSrc: "/resumes/Sarang_Kumar_SDE.pdf",
    fileName: "Sarang_Kumar_SDE.pdf",
    isDefault: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-09-03T00:00:00.000Z",
  },
];
