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

export const resumes: readonly ResumeVersion[] = [
  {
    id: "resume-lorem",
    label: "Lorem resume",
    overview:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. This sample has no downloadable file until a real PDF is published.",
    previewSrc: null,
    previewKind: null,
    fileSrc: null,
    fileName: "lorem-ipsum-resume.pdf",
    isDefault: true,
  },
];
