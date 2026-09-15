# model-router

A reference document (not a library or CLI) for routing dispatched AI work to
the right model: a portable **decision framework**, plus **example tables**
you fill in with your own subscriptions, pricing, and eval data.

This started as a personal routing table living in one harness's agent
config. Pulling it into its own repo makes the framework and the concrete
per-harness tables reusable and shareable independent of any one tool or
employer.

## Why split framework from table

The framework — the axes you route on, and the order you apply them — is
stable. The concrete table — which model id currently wins which axis, at
what price — changes often: vendors reprice, promos expire, new models ship.
Keeping the framework in prose and the table in a plain, editable block below
means you can revise your assignments without touching the reasoning, and
someone else can adopt the reasoning without inheriting your specific
subscriptions.

> Nothing here calls a model or makes a network request. It's documentation
> you apply yourself, or paste into an agent's system prompt / config.

## The framework

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

Within a role, weigh whichever skill axis the task actually calls for:

- **Bounded / clear-spec** (scope is already decided, it's mechanical or a
  clear diff) → weigh **coding** skill.
- **Open-ended / multi-tool** (the model must plan its own tool sequence,
  ambiguous investigation, broad exploration) → weigh **orchestration**
  skill.
- **Taste-critical** (net-new visual/API/copy design) → weigh **taste**,
  during generation, not only at review.

Then: **prefer the cheapest model that clears the bar for the relevant axis.**
Escalate to a pricier/higher-taste model only when the task is genuinely hard
on that axis — not by default, and never by escalating the coordinator seat
itself for a single task (escalate the one delegated call instead).

## Example table (fill in your own)

The rows below are illustrative placeholders, not a recommendation — replace
model ids, tiers, and scores with what's actually available to you and your
own read of pricing/evals. Scores are 1–10 on each axis.

| role | axis | example model | tier | notes |
|---|---|---|---|---|
| Coordinator | orchestration | *your mid-cost general model* | frontier subscription | Plans and dispatches; doesn't implement inline. |
| Bulk / mechanical implementer | coding | *your cheapest capable model* | frontier subscription or API | Clear, bounded changes; escalate only on failure. |
| Hard-but-bounded implementer | coding | *your top coding-tier model* | frontier API | Deliberate use for genuinely difficult, clearly-scoped work. |
| Open-ended / exploratory | orchestration | *your top orchestration-tier model* | frontier subscription or API | Ambiguous investigation, multi-tool planning. |
| Reviewer (fresh context) | matches the diff's dominant axis | *independent of whoever authored the diff* | any | Inspect the diff and tests; don't ask it to redo the implementation. |
| Taste-critical generation | taste | *your highest-taste model* | frontier subscription or API | Net-new visual/API/copy design, spent deliberately. |

## Per-harness notes

Different harnesses expose different levers for the same decision:

- Some tools take a per-call model override plus an explicit effort/thinking
  level (e.g. off/low/medium/high).
- Others default to a fixed session model and expect you to invoke a
  different tool/CLI directly for an alternate vendor, rather than passing a
  model parameter.

Translate the table above into whatever your harness's actual invocation
shape is — a model id plus, if supported, an effort level chosen the same way
you chose the model (cheap default, escalate deliberately).

## Adapting this

1. Copy the example table and replace it with models you can actually invoke.
2. Note your pricing basis and revisit it on a cadence — this drifts fast.
3. Keep the framework section as-is unless your actual reasoning changes;
   keep the table as the part you expect to edit often.

## License

MIT
