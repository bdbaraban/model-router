import type { Axis, Effort, Role, TaskClassification } from "./types.js";

export interface ClassifyOptions {
  role?: Role;
  axis?: Exclude<Axis, "cost">;
  difficulty?: "low" | "medium" | "high";
  escalate?: boolean;
}

/**
 * A transparent starting heuristic, not NLP. Callers should pass explicit
 * options when they know the task. Otherwise, description keywords provide a
 * conservative default: bounded changes favor coding; exploration favors
 * orchestration; design and copy favor taste.
 */
export function classifyTask(description: string, options: ClassifyOptions = {}): TaskClassification {
  const text = description.toLowerCase();
  const inferredAxis: Exclude<Axis, "cost"> = options.axis ??
    (/(design|copy|wording|visual|ux|api shape)/.test(text) ? "taste" :
      /(explore|investigat|research|ambiguous|plan|multi-step|multi tool)/.test(text) ? "orchestration" : "coding");
  const role: Role = options.role ?? (/(review|audit|verify|inspect)/.test(text) ? "reviewer" : "implementer");
  const difficulty = options.difficulty ?? (/(security|architecture|cross-system|hard|complex)/.test(text) ? "high" : "medium");
  const escalated = options.escalate ?? false;
  const requiredScore = escalated ? 10 : difficulty === "low" ? 4 : difficulty === "medium" ? 6 : 8;
  const effort: Effort = escalated ? "xhigh" : difficulty === "low" ? "low" : difficulty === "medium" ? "medium" : "high";
  return { role, axis: inferredAxis, requiredScore, escalated, effort, rationale: `${options.axis ? "Explicit" : "Inferred"} ${inferredAxis} axis; ${difficulty} difficulty${escalated ? "; explicit escalation" : ""}.` };
}
