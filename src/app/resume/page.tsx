import type { Metadata } from "next";
import { Download } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { resumes } from "@/data/resumes";

export const metadata: Metadata = {
  title: "Resume",
  description: "Resume versions and download.",
};

export default function ResumePage() {
  const defaultResume =
    resumes.find((resume) => resume.isDefault) ?? resumes[0];

  return (
    <div className="app-container flex flex-col gap-12">
      <PageHeader
        title="Resume"
        description="Pick the version that fits the role."
      />

      {defaultResume ? (
        <Card className="lift fade-up max-w-2xl">
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="text-base">{defaultResume.label}</CardTitle>
              {defaultResume.isDefault ? (
                <Badge className="font-normal">Default</Badge>
              ) : null}
            </div>
            <CardDescription>{defaultResume.overview}</CardDescription>
          </CardHeader>
          <CardContent>
            {defaultResume.fileSrc ? (
              <a
                href={defaultResume.fileSrc}
                download={defaultResume.fileName ?? true}
                className={buttonVariants({ size: "lg", className: "w-fit" })}
              >
                <Download /> Download PDF
              </a>
            ) : (
              <p className="meta">The PDF is not uploaded yet.</p>
            )}
          </CardContent>
        </Card>
      ) : (
        <p className="text-muted-foreground">No resume published yet.</p>
      )}
    </div>
  );
}
