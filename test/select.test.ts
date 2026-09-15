import { describe, expect, it } from "vitest";
import { selectModel } from "../src/core/select.js";
import type { RoutingConfig, TaskClassification } from "../src/core/types.js";

const config: RoutingConfig = { thresholds: { low: 4, medium: 6, high: 8, escalated: 10 }, models: [
  { id: "cheap", tier: "local", cost: 1, scores: { cost: 10, coding: 6, orchestration: 4, taste: 4 } },
  { id: "better", tier: "frontier-api", cost: 5, scores: { cost: 5, coding: 9, orchestration: 9, taste: 8 } },
  { id: "disabled", tier: "frontier-api", cost: 0, enabled: false, scores: { cost: 10, coding: 10, orchestration: 10, taste: 10 } }
] };
const mediumCoding: TaskClassification = { role: "implementer", axis: "coding", requiredScore: 6, escalated: false, effort: "medium", rationale: "test" };

describe("selectModel", () => {
  it("selects the cheapest model clearing the relevant bar", () => expect(selectModel(mediumCoding, config).model.id).toBe("cheap"));
  it("uses a stronger model only when an explicit higher bar requires it", () => expect(selectModel({ ...mediumCoding, requiredScore: 8, escalated: true }, config).model.id).toBe("better"));
  it("honors tier and cost constraints", () => expect(selectModel(mediumCoding, config, { allowedTiers: ["frontier-api"] }).model.id).toBe("better"));
  it("fails clearly when nothing is eligible", () => expect(() => selectModel(mediumCoding, config, { maxCost: 0 })).toThrow(/No enabled model/));
});
