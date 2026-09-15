import { describe, expect, it } from "vitest";
import { mergeConfigs, validateConfig } from "../src/core/config.js";
import type { RoutingConfig } from "../src/core/types.js";
const base: RoutingConfig = { thresholds: { low: 4, medium: 6, high: 8, escalated: 10 }, models: [{ id: "a", tier: "local", cost: 0, scores: { cost: 10, coding: 5, orchestration: 5, taste: 5 } }] };
describe("configuration", () => {
  it("replaces matching model ids and appends additions", () => {
    const result = mergeConfigs(base, { models: [{ id: "a", tier: "local", cost: 1, scores: { cost: 9, coding: 7, orchestration: 5, taste: 5 } }, { id: "b", tier: "frontier-api", cost: 2, scores: { cost: 8, coding: 6, orchestration: 6, taste: 6 } }] });
    expect(result.models.map((model) => model.id)).toEqual(["a", "b"]);
    expect(result.models[0]?.cost).toBe(1);
  });
  it("rejects invalid score values", () => expect(() => validateConfig({ ...base, models: [{ ...base.models[0], scores: { cost: 11, coding: 5, orchestration: 5, taste: 5 } }] })).toThrow());
});
