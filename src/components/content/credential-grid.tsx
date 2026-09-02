import { CredentialCard } from "@/components/content/credential-card";
import type { BadgeCredential } from "@/data/badges";
import type { Certification } from "@/data/certifications";
import type { Skill } from "@/data/skills";
import { skillsByIds } from "@/lib/content";

type CredentialCopy = {
  verify: string;
  credentialId: string;
  noSkills: string;
};

export function CertificationGrid({
  items,
  skills,
  dateLabel,
  copy,
}: {
  items: readonly Certification[];
  skills: readonly Skill[];
  dateLabel: (date: string) => string;
  copy: CredentialCopy;
}) {
  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item.id}>
          <CredentialCard
            name={item.name}
            issuer={item.issuer}
            dateLabel={item.date ? dateLabel(item.date) : null}
            credentialId={item.credentialId}
            credentialIdLabel={copy.credentialId}
            verificationUrl={item.verificationUrl}
            verifyLabel={copy.verify}
            imageSrc={item.mediaSrc}
            skills={skillsByIds(item.skillIds, skills)}
            skillsEmptyLabel={copy.noSkills}
          />
        </li>
      ))}
    </ul>
  );
}

export function BadgeGrid({
  items,
  skills,
  dateLabel,
  copy,
}: {
  items: readonly BadgeCredential[];
  skills: readonly Skill[];
  dateLabel: (date: string) => string;
  copy: CredentialCopy;
}) {
  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item.id}>
          <CredentialCard
            name={item.name}
            issuer={item.issuer}
            dateLabel={item.date ? dateLabel(item.date) : null}
            verificationUrl={item.verificationUrl}
            verifyLabel={copy.verify}
            imageSrc={item.imageSrc}
            skills={skillsByIds(item.skillIds, skills)}
            skillsEmptyLabel={copy.noSkills}
          />
        </li>
      ))}
    </ul>
  );
}
