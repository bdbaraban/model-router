import { describe, expect, it } from "vitest";
import { toClaudeCodeInvocation } from "../src/drivers/claude-code.js";
import { toPiInvocation } from "../src/drivers/pi.js";
import type { RoutingDecision } from "../src/core/types.js";
const decision: RoutingDecision = { classification: { role: "implementer", axis: "coding", requiredScore: 6, escalated: false, effort: "high", rationale: "test" }, effort: "high", rationale: "test", model: { id: "example/model", tier: "frontier-api", cost: 1, scores: { cost: 5, coding: 7, orchestration: 5, taste: 5 } } };
describe("drivers", () => {
  it("maps a decision to pi arguments", () => expect(toPiInvocation(decision)).toEqual({ model: "example/model", thinking: "high" }));
  it("maps a decision to Claude Code data", () => expect(toClaudeCodeInvocation(decision)).toEqual({ command: "/model example/model", effort: "high" }));
});
