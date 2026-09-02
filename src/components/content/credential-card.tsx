import { RelatedItemList } from "@/components/content/related-item-list";
import type { Skill } from "@/data/skills";
import { cn } from "@/lib/cn";
import { getExternalAnchorProps } from "@/lib/href";

type CredentialCardProps = {
  name: string;
  issuer: string;
  dateLabel: string | null;
  credentialId?: string | null;
  credentialIdLabel?: string;
  verificationUrl: string | null;
  verifyLabel: string;
  imageSrc: string | null;
  skills: readonly Skill[];
  skillsEmptyLabel: string;
};

export function CredentialCard({
  name,
  issuer,
  dateLabel,
  credentialId,
  credentialIdLabel,
  verificationUrl,
  verifyLabel,
  imageSrc,
  skills,
  skillsEmptyLabel,
}: CredentialCardProps) {
  return (
    <article
      className={cn(
        "stack-compact surface-card pad-card",
        "transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)]",
        "hover:border-primary/40",
      )}
    >
      <div className="flex gap-3">
        {imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageSrc}
            alt=""
            className="size-10 shrink-0 rounded-sm border border-border object-cover bg-muted"
          />
        ) : null}
        <div className="stack-compact min-w-0">
          <p className="type-small font-semibold text-card-foreground">
            {name}
          </p>
          <p className="type-small text-muted-foreground">{issuer}</p>
          {dateLabel ? <p className="type-metadata">{dateLabel}</p> : null}
          {credentialId && credentialIdLabel ? (
            <p className="type-metadata">
              {credentialIdLabel}: {credentialId}
            </p>
          ) : null}
          {verificationUrl ? (
            <a
              href={verificationUrl}
              className="type-small text-foreground hover:text-primary"
              {...getExternalAnchorProps(verificationUrl)}
            >
              {verifyLabel}
            </a>
          ) : null}
        </div>
      </div>
      <RelatedItemList
        items={skills.map((skill) => ({
          id: skill.id,
          label: skill.name,
          href: "/skills",
          fragment: skill.id,
        }))}
        emptyLabel={skillsEmptyLabel}
      />
    </article>
  );
}
