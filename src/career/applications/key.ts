export function createJobApplicationKey(now: Date): string {
  return `app-${now.getTime().toString(36)}`;
}
