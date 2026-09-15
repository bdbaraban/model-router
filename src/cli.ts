#!/usr/bin/env node
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { classifyTask, loadConfig, selectModel, type Role, type Axis } from "./core/index.js";
import { toClaudeCodeInvocation, toPiInvocation } from "./drivers/index.js";

const args = process.argv.slice(2);
const value = (flag: string): string | undefined => { const i = args.indexOf(flag); return i < 0 ? undefined : args[i + 1]; };
if (args[0] !== "pick") {
  console.error("Usage: model-router pick --role <role> --axis <coding|orchestration|taste> --budget <low|medium|high> --driver <pi|claude-code> [--config path]");
  process.exitCode = 1;
} else {
  const role = value("--role") as Role | undefined;
  const axis = value("--axis") as Exclude<Axis, "cost"> | undefined;
  const difficulty = value("--budget") as "low" | "medium" | "high" | undefined;
  const driver = value("--driver");
  if (!role || !axis || !difficulty || (driver !== "pi" && driver !== "claude-code")) throw new Error("role, axis, budget, and supported driver are required.");
  const here = dirname(fileURLToPath(import.meta.url));
  const config = await loadConfig(join(here, "config/default.config.yaml"), value("--config"));
  const decision = selectModel(classifyTask("", { role, axis, difficulty }), config);
  const invocation = driver === "pi" ? toPiInvocation(decision) : toClaudeCodeInvocation(decision);
  console.log(JSON.stringify({ model: decision.model.id, invocation, rationale: decision.rationale }, null, 2));
}
