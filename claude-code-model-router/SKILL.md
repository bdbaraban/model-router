---
name: model-router
description: Pick which model to use for a dispatched Task/subagent call or a session-level /model escalation. Use before delegating implementation, spinning up a fresh-context reviewer, or fanning out parallel work — especially open-ended/multi-tool exploratory work, hard-but-bounded implementation, or judging whether to escalate.
---

# Model router

The routing table pasted from `routing-table.md` into your `CLAUDE.md`/
`AGENTS.md` is advisory — nothing mechanically enforces it. This skill exists
so every `Task` dispatch, fan-out, or escalation call actively consults the
table instead of defaulting to whatever model is already running the
session.

## 1. Read the current table

Read `CLAUDE.md`/`AGENTS.md` for the `cost` / `coding` / `orchestration` /
`taste` table and per-model names pasted in from `routing-table.md`. Don't
hardcode scores here — that table gets revised as pricing/evals change (see
"Evaluating and updating this table" in `routing-table.md`); this skill only
encodes the *decision procedure*, not the numbers.

## 2. Classify the task

- **Bounded, single-shot implementation** (clear spec, scoped diff, someone
  already decided *what* to build) → weigh `coding`.
- **Open-ended / multi-tool** (the dispatched work must plan its own tool
  sequence, ambiguous investigation, broad exploration) → weigh
  `orchestration`.
- **Taste-critical** (net-new visual design, copywriting, API shape) → weigh
  `taste`, generation-time, not just at review.
- **Review/verification** → always fresh context, independent of who
  authored the diff; model choice follows whichever axis above the *content*
  under review calls for (coding-heavy diff → `coding`; architecture/taste →
  the corresponding axis at high effort).

## 3. Pick within budget — but only among Claude models directly

Prefer the cheapest Claude model that clears the bar for the classified axis
(see `cost` column) — escalate only when the task is genuinely hard on that
axis, not by default. Never escalate the coordinating session's model for a
single task; escalate the one delegated `Task` call instead. A full session
`/model` switch is a separate, deliberate decision — see `CLAUDE.md`.

Claude Code is Anthropic-native: its `Task`/`model` parameter only accepts
Claude models. If the table names an OpenAI-family model (`gpt-5.6-*`) as
the best fit for this task, don't substitute a Claude model just because
it's reachable — reach the real target through a wrapper instead (step 3a).

## 3a. Reaching an OpenAI-family model from a Claude Code session

Spawn a thin Claude wrapper subagent (`model: sonnet`, low effort) whose
only job is to write a self-contained prompt, run it through that model's
CLI, and relay the result — it does not do the work itself:

```bash
codex exec \
  -C "$PWD" \
  -m gpt-5.6-terra \
  -c model_reasoning_effort="medium" \
  -s workspace-write \
  --ephemeral \
  -o "$REPORT" \
  - < "$PROMPT"
```

Label the wrapper by the *real* worker, not the wrapper's own model — e.g.
`gpt-5.6-terra:review-auth` — since the session UI otherwise only shows the
wrapper's Claude model. Codex runs can exceed a tool call's default timeout;
pass an explicit timeout or poll a report file in the background. Parallel
wrapper-dispatched runs need separate worktrees so edits don't collide.

## 4. Label and dispatch

Name every dispatch `model:title` (e.g. `opus:review-auth`), give a reviewer
a fresh context that never saw the implementation conversation, and state the
per-wave model up front for any fan-out rather than silently inheriting the
session model.

## 5. Judge the result, not the price

If the output misses the bar on the axis that mattered (taste, coding
correctness, orchestration coherence), escalate to a smarter/higher-taste
model without asking — the goal is quality per this decision procedure, not
minimizing spend on a single call.
