import { describe, expect, it } from "@jest/globals";
import { defaultLocale, locales } from "@/i18n/locales";
import { enMessages, messagesByLocale } from "@/i18n/messages";
import { messageNamespaces } from "@/i18n/namespaces";

describe("i18n foundation", () => {
  it("supports English as the only locale", () => {
    expect(locales).toEqual(["en"]);
    expect(defaultLocale).toBe("en");
    expect(Object.keys(messagesByLocale)).toEqual(["en"]);
  });

  it("loads every required message namespace", () => {
    expect(Object.keys(enMessages)).toEqual([...messageNamespaces]);
  });

  it("keeps error copy in the translation catalog", () => {
    expect(enMessages.errors.notFound.action).toBeTruthy();
    expect(enMessages.errors.unexpected.action).toBeTruthy();
  });

  it("keeps CMD ribbon copy in the translation catalog", () => {
    expect(enMessages.terminal.ribbonLabel).toBe("CMD");
    expect(enMessages.terminal.open).toBeTruthy();
    expect(enMessages.terminal.vault.usageUnlock).toContain("unlock analytics");
  });
});
