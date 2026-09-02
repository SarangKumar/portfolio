export type ResumeVersion = {
  id: string;
  label: string;
  overview: string | null;
  previewSrc: string | null;
  previewKind: "pdf" | "image" | null;
  fileSrc: string | null;
  fileName: string | null;
  isDefault: boolean;
};

export const resumes: readonly ResumeVersion[] = [];
