import { describe, expect, it } from "@jest/globals";
import { motionTransitions, withReducedMotion } from "@/lib/motion";

describe("withReducedMotion", () => {
  it("disables duration when the user prefers reduced motion", () => {
    expect(withReducedMotion(true, motionTransitions.hover)).toEqual({
      duration: 0,
    });
  });

  it("keeps the designed transition when reduced motion is off", () => {
    expect(withReducedMotion(false, motionTransitions.entrance)).toEqual(
      motionTransitions.entrance,
    );
  });
});
