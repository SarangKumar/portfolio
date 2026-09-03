import { PageHeader } from "@/components/content/page-header";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { SignOutForm } from "@/features/auth/sign-out-form";

type AdminPlaceholderCopy = {
  title: string;
  intro: string;
  signedInAs: string;
  logout: string;
};

type AdminPlaceholderProps = {
  copy: AdminPlaceholderCopy;
};

export function AdminPlaceholder({ copy }: AdminPlaceholderProps) {
  return (
    <div className="stack-section">
      <PageHeader title={copy.title} description={copy.intro} />
      <Card className="max-w-md">
        <CardContent>
          <CardDescription>{copy.signedInAs}</CardDescription>
          <SignOutForm label={copy.logout} />
        </CardContent>
      </Card>
    </div>
  );
}
