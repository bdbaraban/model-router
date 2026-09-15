import { describe, expect, it } from "vitest";
import { classifyTask } from "../src/core/classify.js";

describe("classifyTask", () => {
  it("classifies bounded implementation as coding", () => {
    expect(classifyTask("Add a validated field to this TypeScript form")).toMatchObject({ role: "implementer", axis: "coding", requiredScore: 6, effort: "medium" });
  });
  it("classifies reviews and design work", () => {
    expect(classifyTask("Review the visual copy and API shape")).toMatchObject({ role: "reviewer", axis: "taste" });
  });
  it("honors explicit escalation and choices", () => {
    expect(classifyTask("anything", { role: "coordinator", axis: "orchestration", difficulty: "low", escalate: true })).toMatchObject({ role: "coordinator", axis: "orchestration", requiredScore: 10, effort: "xhigh", escalated: true });
  });
});
