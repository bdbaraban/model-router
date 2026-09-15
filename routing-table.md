# Model routing for dispatched work

Advisory rules for picking which model handles a piece of delegated work
(subagent dispatch, a fan-out, an escalation call) — independent of which
harness is doing the dispatching.

## Two axes

Every task routes on two independent questions:

1. **Tier — where it runs / what budget it draws on**
   - **Local** — privacy-sensitive, offline, or high-volume work, if you have
     a local model runtime.
   - **Frontier subscription** — work covered by an included plan allowance.
     Treat the allowance as a scarce budget even though it isn't itemized
     per-call.
   - **Frontier API** — separately metered, explicit opt-in. Not a default or
     silent fallback.

2. **Role — what seat the model holds**
   - **Coordinator** — scopes, plans, prompts, reviews, verifies, merges.
     Does not drift into implementation itself.
   - **Implementer** — completes clear-spec, bounded work. Start with the
     cheapest tier that clears the quality bar for the task.
   - **Reviewer** — an adversarial pass in a fresh context that did not write
     the work under review. Independence comes from fresh context and
     adversarial framing, not from using a different vendor.

## Classify the task before picking a model

- **Bounded, single-shot implementation** (clear spec, scoped diff, someone
  already decided *what* to build) → weigh **coding** skill.
- **Open-ended / multi-tool** (the model must plan its own tool sequence,
  ambiguous investigation, broad exploration) → weigh **orchestration**
  skill.
- **Taste-critical** (net-new visual design, copywriting, API shape) → weigh
  **taste**, at generation time, not just at review.
- **Review/verification** → always fresh context, independent of who
  authored the diff; model choice still follows whichever axis above the
  *content under review* calls for.

## Pick within budget

Prefer the cheapest model that clears the bar for the classified axis —
escalate only when the task is genuinely hard on that axis, not by default.
Never escalate the coordinator/driver model itself for a single task;
escalate the one delegated call instead.

## Your table

Fill this in with models you can actually invoke. Scores are 1–10 per axis;
`cost` is inverse (higher score = cheaper). Revisit this whenever pricing or
your own read of model quality changes — the table is expected to go stale
faster than the rules above it.

| model | id (however your harness references it) | tier | cost | coding | orchestration | taste |
|---|---|---|---|---|---|---|
| *your cheapest capable model* | | | | | | |
| *your everyday default* | | | | | | |
| *your top coding-tier model* | | | | | | |
| *your top orchestration-tier model* | | | | | | |
| *your top taste-tier model* | | | | | | |

## Judge the result, not the price

If the output misses the bar on the axis that mattered, escalate to a
smarter/higher-taste model without asking — the goal is clearing the bar per
this decision procedure, not minimizing spend on a single call.
