const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isPublicSlug(value: string): boolean {
  return SLUG_PATTERN.test(value);
}
