import type { BudgetConstraints, ModelProfile, RoutingConfig, RoutingDecision, TaskClassification } from "./types.js";

/** Returns eligible models sorted by lowest cost, then highest relevant skill. */
export function eligibleModels(classification: TaskClassification, config: RoutingConfig, budget: BudgetConstraints = {}): ModelProfile[] {
  return config.models
    .filter((model) => model.enabled !== false)
    .filter((model) => budget.maxCost === undefined || model.cost <= budget.maxCost)
    .filter((model) => budget.allowedTiers === undefined || budget.allowedTiers.includes(model.tier))
    .filter((model) => model.scores[classification.axis] >= classification.requiredScore)
    .sort((a, b) => a.cost - b.cost || b.scores[classification.axis] - a.scores[classification.axis] || a.id.localeCompare(b.id));
}

/**
 * Selects the least expensive eligible model. An escalated classification has
 * a higher required score; escalation is always explicit rather than inferred
 * merely because a pricier model exists.
 */
export function selectModel(classification: TaskClassification, config: RoutingConfig, budget: BudgetConstraints = {}): RoutingDecision {
  const model = eligibleModels(classification, config, budget)[0];
  if (!model) {
    throw new Error(`No enabled model clears ${classification.requiredScore}/10 for ${classification.axis} within the supplied budget.`);
  }
  return {
    classification,
    model,
    effort: classification.effort,
    rationale: `Selected ${model.id}: lowest-cost eligible model with ${classification.axis} score ${model.scores[classification.axis]}/10 (minimum ${classification.requiredScore}/10).`
  };
}
