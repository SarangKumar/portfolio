/**
 * Sample view counts keyed by project slug so Home can rank a top three.
 * Live analytics still merge on top of this snapshot.
 */
export const projectViewCounts: Readonly<Record<string, number>> = {
  "lorem-gateway": 24,
  "ipsum-ledger": 11,
  "dolor-canvas": 7,
};
