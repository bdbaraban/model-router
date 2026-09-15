import type { RoutingDecision } from "../core/types.js";
import type { HarnessInvocation } from "./types.js";

/** Produces the model and thinking fields accepted by pi's subagent dispatch. */
export function toPiInvocation(decision: RoutingDecision): HarnessInvocation {
  return { model: decision.model.id, thinking: decision.effort };
}
