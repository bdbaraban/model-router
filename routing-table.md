# routing-table.md

> **Standing instructions to paste into your `AGENTS.md` or `CLAUDE.md` to route dispatched work to the right model.**

> Copy the block, paste it into your instructions file, and edit the model names and scores to match what you actually have access to.

---

# Picking the Right Models for Workflows and Subagents

Scores are 1–10, higher = better. `cost` reflects what you actually pay, not list price. `coding` is bounded-task/solve-rate skill — how far you can hand a scoped diff unsupervised. `orchestration` is multi-step tool-use/planning skill — what a subagent needs to plan its own tool sequence. `taste` covers UI/UX, code quality, API design, and copy.

| model | id | cost | coding | orchestration | taste |
|-------|----|------|--------|---------------|-------|
| gpt-5.6-luna  | `openai/gpt-5.6-luna`  | 10 | 7  | 5 | 4  |
| gpt-5.6-terra | `openai/gpt-5.6-terra` | 9  | 8  | 7 | 6  |
| gpt-5.6-sol   | `openai/gpt-5.6-sol`   | 8  | 10 | 9 | 7  |
| sonnet-5      | `anthropic/claude-sonnet-5`  | 5 | 6 | 7 | 7  |
| opus-5        | `anthropic/claude-opus-5`    | 4 | 9 | 9 | 8  |
| fable-5.1     | `anthropic/claude-fable-5-1` | 2 | 9 | 8 | 10 |

How to apply:

- **The coordinator never implements inline; implementation is dispatched, routed by work type.** Whichever model runs the session holds the coordinator seat — scope, plan, prompt, review, verify, merge. Coordinating is the seat, not a fixed model. Cheaper, agentic-workhorse-tier models (`sonnet-5`) make good coordinator defaults on cost and role-fit grounds, not just cost; save the premium reasoning tier (`opus-5`, `fable-5.1`) for dispatched work that actually needs it.
- **Mechanical / backend / logic / bulk / migrations / clear-spec** — bounded, single-shot tasks: weigh `coding` over `orchestration` → the cheapest model that clears your coding bar (`gpt-5.6-terra`), medium effort. For high-volume, low-ambiguity recon/lookup work, try an even cheaper tier first (`gpt-5.6-luna`) before falling back up if quality suffers.
- **Hard-but-bounded / oracle-tier work** — explicit goal and completion criteria, but genuinely difficult: still `coding`-led → your top coding-tier model (`gpt-5.6-sol`), high effort. Reserve the priciest tier for when the task is genuinely hard, or is specific to a model family you're already deep in (matching an existing conversation/context).
- **Open-ended / multi-tool exploratory work** — ambiguous investigation, broad exploration, a subagent that has to plan its own tool sequence rather than execute a pre-scoped diff: weigh `orchestration` over `coding` → your top orchestration-tier model (`opus-5` or `gpt-5.6-sol`) first; a cheaper coordinator-tier model is the fallback when the exploration is narrow enough not to need the top tier.
- **UI / user-facing** — still dispatch to a coding-led model (bounded implementation), but enforce the taste bar (≥ 7) at *review*: judge the rendered result against the mocks/spec and iterate. Dispatch a high-taste model instead only when taste must be exercised *during generation* — net-new visual design, copywriting, API shape.
- **Effort:** medium for execution, high for the adversarial review pass; pin it explicitly per run rather than letting it inherit a default.
- These are defaults, not limits — escalate to a smarter/higher-taste model without asking if output misses the bar. Judge the output, not the price.

Review runs in a fresh context that didn't write the code — a separate subagent, or a new ephemeral run with an adversarial prompt. Same model is fine; independence comes from fresh context and adversarial framing, not model class. Never review your own diff inside the context that produced it.

Dispatching subagents (conventions):

- Route delegated work using the table above. Default to the tier this rubric dictates — you have standing permission to pick it without asking. For a multi-agent fan-out, state the per-wave model choice up front so it's visible.
- **Titles are `model:title` delimited:** every subagent's display title starts with the model it runs on, colon-delimited — `sonnet-5:transplant-trace`, `gpt-5.6-terra:review-auth` — so a dispatch shows at a glance which model each agent is on.

## Effort/thinking levels

Vendors default higher than you might expect for a subagent seat — set effort explicitly per role rather than relying on inherited defaults:

| role | model | thinking | why |
|------|-------|----------|-----|
| coordinator (session) | sonnet-5 | `medium` baseline; bump to `high`/`xhigh` per turn for architecture/scoping | cost-saving step-down from the vendor default; escalate per-turn, not globally |
| researcher / recon | gpt-5.6-luna | `low` | cheap, high-volume lookups |
| worker / mechanical implementer | gpt-5.6-terra | `medium` | vendor default for this tier, pinned explicitly instead of inherited |
| planner | sonnet-5 | `high` | planning quality matters more than per-call cost; invoked far less often than the coordinator loop |
| oracle / hard-but-bounded | gpt-5.6-sol | `high`, escalate to `xhigh` only when evals show a clear win | only escalate further when there's evidence it helps |
| adversarial review | opus-5 | `high` | independent review is worth the premium tier |

Same escalation philosophy as model choice: dynamic beats static. Don't hold a session at `high`/`xhigh` by default — reserve escalation for the turn that actually needs it, then drop back down.

## Mechanics

- `gpt-5.6-*` models are reached through whichever OpenAI-compatible provider account you have access to — pass the model straight to your harness's model parameter (e.g. `{ model: "openai/gpt-5.6-terra" }`).
- `sonnet-5` / `opus-5` / `fable-5.1` run via your harness's own model parameter for Claude models.
- Label every dispatch `model:title` so the running model is visible at a glance, and state the per-wave model up front for any fan-out rather than silently inheriting the session model.
