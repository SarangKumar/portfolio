import { describe, expect, it } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import { CredentialCard } from "@/components/content/credential-card";

describe("CredentialCard", () => {
  it("renders verification and credential metadata without invented fields", () => {
    render(
      <CredentialCard
        name="Example credential"
        issuer="Example issuer"
        dateLabel="Jan 2024"
        credentialId="ABC-1"
        credentialIdLabel="Credential ID"
        verificationUrl="https://example.com/verify/ABC-1"
        verifyLabel="Verify"
        imageSrc={null}
        skills={[]}
        skillsEmptyLabel="No linked skills."
      />,
    );

    expect(screen.getByText("Example credential")).toBeInTheDocument();
    expect(screen.getByText("Credential ID: ABC-1")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Verify" })).toHaveAttribute(
      "href",
      "https://example.com/verify/ABC-1",
    );
    expect(screen.getByText("No linked skills.")).toBeInTheDocument();
  });
});
