import { MediaImage } from "@/components/content/media-image";
import { RelatedItemList } from "@/components/content/related-item-list";
import type { Skill } from "@/data/skills";
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
    <article className="stack-compact surface-card pad-card surface-interactive">
      <div className="flex gap-3">
        {imageSrc ? (
          <MediaImage
            src={imageSrc}
            alt=""
            width={40}
            height={40}
            className="size-10 shrink-0 rounded-sm border border-border object-cover"
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
