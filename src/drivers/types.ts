import type { RoutingDecision } from "../core/types.js";

export type HarnessInvocation = Record<string, string | undefined>;
export interface Driver {
  invoke(decision: RoutingDecision): HarnessInvocation;
}
