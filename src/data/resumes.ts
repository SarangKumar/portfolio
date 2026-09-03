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
    id: "resume-lorem",
    label: "Lorem resume",
    targetType: "general",
    overview:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. This sample has no downloadable file until a real PDF is published.",
    notes: null,
    previewSrc: null,
    previewKind: null,
    fileSrc: null,
    fileName: "lorem-ipsum-resume.pdf",
    isDefault: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
];
