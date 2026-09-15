import type { RoutingDecision } from "../core/types.js";
import type { HarnessInvocation } from "./types.js";

/** Produces a Claude Code model-selection command and a separately surfaced effort hint. */
export function toClaudeCodeInvocation(decision: RoutingDecision): HarnessInvocation {
  return { command: `/model ${decision.model.id}`, effort: decision.effort };
}
