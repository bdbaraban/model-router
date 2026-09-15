---
name: model-router
description: Pick which model to pass to an ad hoc subagent dispatch (one not covered by a named agentOverrides role like context-builder/planner/researcher/oracle/worker). Use before any subagent call, fan-out, or escalation decision that requires choosing a model explicitly — especially open-ended/multi-tool exploratory work, hard-but-bounded implementation, or judging whether to escalate.
---

# Model router

The routing table pasted from `routing-table.md` into your `AGENTS.md` is
advisory — only `~/.pi/agent/settings.json`
(`subagents.agentOverrides`, `watchdog.main/children`) is mechanically
enforced. Named roles (`context-builder`, `planner`, `researcher`, `oracle`,
`worker`) already resolve their model from settings automatically. This skill
exists for every other dispatch: one-off `subagent` calls, fan-outs, and
escalation judgment calls, where nothing stops the wrong model from being
picked except actively consulting the table.

## 1. Read the current table

Read `AGENTS.md` for the `cost` / `coding` / `orchestration` / `taste` table
and per-model ids pasted in from `routing-table.md`. Don't hardcode scores
here — that table gets revised as pricing/evals change (see
"Evaluating and updating this table" in `routing-table.md`); this skill only
encodes the *decision procedure*, not the numbers.

## 2. Classify the task

- **Bounded, single-shot implementation** (clear spec, scoped diff, a
  human/agent already decided *what* to build) → weigh `coding`.
- **Open-ended / multi-tool** (the subagent must plan its own tool sequence,
  ambiguous investigation, broad exploration) → weigh `orchestration`.
- **Taste-critical** (net-new visual design, copywriting, API shape) → weigh
  `taste`, generation-time, not just at review.
- **Review/verification** → always fresh context, independent of who
  authored the diff; model choice follows whichever axis above the *content*
  under review calls for (coding-heavy diff → `coding`; architecture/taste →
  the corresponding axis at high effort).

## 3. Pick within budget — across the whole table, no wrapper needed

Prefer the cheapest model that clears the bar for the classified axis (see
`cost` column) — escalate only when the task is genuinely hard on that axis,
not by default. Never escalate the *coordinator/driver* model itself for a
single task; escalate the one subagent call instead (a session-wide model
escalation is a separate, deliberate decision — see `AGENTS.md`).

pi is vendor-agnostic: unlike a single-vendor harness, it can dispatch a
subagent to any model in the table directly — OpenAI-family or Claude-
family — with no wrapper process in between. This is the one harness where
the full table applies unmodified; see "The driver constraint" in
`routing-table.md` for how Claude Code and Codex CLI differ.

## 4. Label and dispatch

Label every dispatch `model:title` (e.g. `gpt-5.6-terra:review-auth`), fresh
context per reviewer, and state the per-wave model up front for any fan-out
rather than silently inheriting the session model.

## 5. Judge the result, not the price

If the output misses the bar on the axis that mattered (taste, coding
correctness, orchestration coherence), escalate to a smarter/higher-taste
model without asking — the goal is quality per this decision procedure, not
minimizing spend on a single call.
