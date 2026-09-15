---
name: codex-model-router
description: Pick which model and reasoning effort to pass to a dispatched `codex exec` run — a delegated implementation, review, or investigation. Use before any codex exec call that isn't already pinned to a model, especially open-ended/multi-tool exploratory work, hard-but-bounded implementation, or judging whether to escalate.
user_invocable: true
---

# Codex model router

The routing table in your `AGENTS.md` ("Picking the Right Models for
Workflows and Subagents") is advisory — nothing in Codex CLI enforces it.
This skill exists so every `codex exec` dispatch actively consults the table
instead of relying on `config.toml` defaults, which interactive CLI use can
mutate.

## 1. Read the current table

Read `AGENTS.md`, section "Picking the Right Models for Workflows and
Subagents," for the live `cost` / `coding` / `orchestration` / `taste` table
and per-model ids. Don't hardcode scores here — that table gets revised as
pricing/evals change; this skill only encodes the *decision procedure*, not
the numbers.

## 2. Classify the task

- **Bounded, single-shot implementation** (clear spec, scoped diff, someone
  already decided *what* to build) → weigh `coding`.
- **Open-ended / multi-tool** (the run must plan its own investigation,
  ambiguous scope, broad exploration) → weigh `orchestration`.
- **Taste-critical** (net-new visual design, copywriting, API shape) → weigh
  `taste`, generation-time, not just at review.
- **Review/verification** → always a fresh, read-only run independent of who
  authored the diff; model choice follows whichever axis above the *content*
  under review calls for.

## 3. Pick within budget, and pin it explicitly

Prefer the cheapest model that clears the bar for the classified axis — escalate
only when the task is genuinely hard on that axis, not by default. Always pin
the model and effort explicitly on the command line; never rely on inherited
`config.toml` defaults:

```bash
codex exec \
  -C "$PWD" \
  -m <model-from-table> \
  -c model_reasoning_effort="<medium|high>" \
  -s <workspace-write|read-only|danger-full-access> \
  --ephemeral \
  -o "$REPORT" \
  - < "$PROMPT"
```

Implementation runs default to `medium` effort regardless of task size —
a big mechanical change is still mechanical. `high` is for the adversarial
review pass that's hunting for what's wrong. Use `-s read-only` for review,
`-s workspace-write` for implementation, and `-s danger-full-access` only
when the run genuinely needs access outside the repo (GUI automation,
simulators, package-manager global state). `--ephemeral` avoids retaining the
delegated run as a user session.

## 4. Label and dispatch

Label every artifact directory and report with the model it ran on so a
later reviewer can see at a glance which tier produced it (e.g.
`codex-implementation.gpt-5.6-terra.XXXXXX`). Codex runs can exceed a calling
shell's default timeout — pass an explicit timeout, or run in the background
and poll for the report file. Parallel runs must use separate worktrees so
edits don't collide in a shared checkout.

## 5. Judge the result, not the price

If the output misses the bar on the axis that mattered (taste, coding
correctness, orchestration coherence), rerun at a smarter/higher-taste model
without asking — the goal is quality per this decision procedure, not
minimizing spend on a single call.
