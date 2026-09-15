export const axes = ["cost", "coding", "orchestration", "taste"] as const;
export type Axis = (typeof axes)[number];

export const roles = ["coordinator", "implementer", "reviewer"] as const;
export type Role = (typeof roles)[number];

export const tiers = ["local", "frontier-subscription", "frontier-api"] as const;
export type Tier = (typeof tiers)[number];

export const efforts = ["off", "minimal", "low", "medium", "high", "xhigh", "max"] as const;
export type Effort = (typeof efforts)[number];

export type Scores = Record<Axis, number>;

export interface ModelProfile {
  id: string;
  name?: string;
  tier: Tier;
  scores: Scores;
  /** Relative unit cost. Lower is cheaper; use your own pricing basis consistently. */
  cost: number;
  notes?: string;
  enabled?: boolean;
}

export interface TaskClassification {
  role: Role;
  axis: Exclude<Axis, "cost">;
  /** Minimum score (1–10) required on the selected axis. */
  requiredScore: number;
  /** Whether the caller deliberately requests escalation above the normal bar. */
  escalated: boolean;
  effort: Effort;
  rationale: string;
}

export interface BudgetConstraints {
  /** Maximum relative unit cost. */
  maxCost?: number;
  /** Tiers the caller can use. */
  allowedTiers?: Tier[];
}

export interface RoutingDecision {
  classification: TaskClassification;
  model: ModelProfile;
  effort: Effort;
  rationale: string;
}

export interface RoutingConfig {
  models: ModelProfile[];
  /** Default minimum score by task difficulty. */
  thresholds: { low: number; medium: number; high: number; escalated: number };
}
