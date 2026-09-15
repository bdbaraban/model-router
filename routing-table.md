# routing-table.md

Paste this section into your `AGENTS.md`/`CLAUDE.md`. Edit the model names,
scores, and subscriptions to match what you actually pay for and have access
to — the values below are a real personal table, not a schema example, but
they're specific to one person's machine and accounts.

## Two axes

Every dispatch decision is two independent questions, not one:

- **Tier — what budget it draws on.** `local` (a runtime you host, for
  privacy-sensitive or high-volume work), `frontier-subscription` (included
  in a plan allowance — a scarce, shared budget, not free), or
  `frontier-api` (separately metered — an explicit opt-in, never a silent
  fallback when a subscription allowance runs out).
- **Role — what seat the model holds.** `coordinator` (scopes, plans,
  prompts, reviews, verifies, merges — never drifts into implementation),
  `implementer` (completes clear-spec work, starting at the cheapest tier
  that clears the bar), `reviewer` (an adversarial pass in a fresh context
  that didn't write the work under review).

Within `implementer`/`reviewer`, weigh whichever skill axis the task calls
for: `coding` for a scoped diff, `orchestration` for a task that has to plan
its own tool sequence, `taste` for net-new visual/API/copy design.

## The table

Scores are 1–10, higher = better. `cost` is inverse (higher = cheaper).

| model | id | tier | cost | coding | orchestration | taste |
|-------|----|------|------|--------|---------------|-------|
| gpt-5.6-luna  | `openai/gpt-5.6-luna`  | frontier-subscription | 10 | 7  | 5 | 4  |
| gpt-5.6-terra | `openai/gpt-5.6-terra` | frontier-subscription | 9  | 8  | 7 | 6  |
| gpt-5.6-sol   | `openai/gpt-5.6-sol`   | frontier-api          | 8  | 10 | 9 | 7  |
| sonnet-5      | `anthropic/claude-sonnet-5`  | frontier-subscription | 5 | 6 | 7 | 7  |
| opus-5        | `anthropic/claude-opus-5`    | frontier-subscription | 4 | 9 | 9 | 8  |
| fable-5.1     | `anthropic/claude-fable-5-1` | frontier-subscription | 2 | 9 | 8 | 10 |

## How to apply it

- **Coordinator never implements inline.** Whichever model is running your
  session holds that seat — scope, plan, prompt, review, verify, merge —
  and dispatches everything else. Which model holds it depends on your entry
  point, not a fixed assignment (see below).
- **Bounded / mechanical / clear-spec** → weigh `coding`, pick the cheapest
  model that clears your bar (`gpt-5.6-terra`), medium effort. For
  high-volume, low-ambiguity recon (greps, lookups), try a cheaper tier
  first (`gpt-5.6-luna`) and fall back up only if quality suffers.
- **Hard-but-bounded** — clear goal, genuinely difficult → still `coding`-led,
  your top coding tier (`gpt-5.6-sol`), high effort. Deliberate, not default.
- **Open-ended / multi-tool exploration** → weigh `orchestration`, your top
  orchestration tier (`opus-5` or `gpt-5.6-sol`) first; a cheaper coordinator-
  tier model when the exploration is narrow enough not to need it.
- **User-facing work** still gets dispatched to a coding-led model; enforce
  the taste bar (≥ 7) at *review* by judging the rendered result against a
  spec/mock and iterating. Reach for a high-taste model at generation time
  only when taste has to be exercised while writing the thing itself.
- These are defaults, not limits — escalate without asking when the output
  misses the bar for the axis that mattered. Judge the result, not the price.

## Dispatch is the default, not an ask

- Dispatch by default; don't hold work inline because it feels small.
  Edit inline only when writing the delegation prompt would cost more than
  the change itself — a genuine one-liner, or a ≤5-line fix already under
  review. Everything else gets dispatched.
- Never ask permission before delegating — it's the default action, not an
  opt-in the user approves each time.
- Review always runs in a fresh context that didn't write the code under
  review — a separate subagent or a new context with an adversarial prompt.
  Same model is fine; independence comes from fresh context, not vendor.

## The driver constraint

The table above is vendor-agnostic, but most harnesses aren't — only pick a
coordinator/driver model your harness can actually run natively, and treat
every other vendor's model as something you reach through a wrapper, not a
direct dispatch:

- **pi is vendor-agnostic.** It invokes any model in the table directly, so
  the coordinator/driver is whichever row wins on cost/role fit — no wrapper
  needed either direction. This is the harness where the full table applies
  unmodified.
- **Claude Code is Anthropic-native.** The driver is always whichever Claude
  model is running the session (`sonnet-5` baseline). Reaching an OpenAI-
  family model (`gpt-5.6-*`) means spawning a thin Claude wrapper subagent
  that shells out to that model's CLI and relays the report — see
  `claude-code-model-router` for the exact mechanism.
- **Codex CLI is OpenAI-native.** The driver is always whichever model is
  running the `codex exec` session (`gpt-5.6-terra` baseline). Reaching a
  Claude model means spawning a wrapper that shells out to the Claude CLI
  and relays the report — see `codex-model-router` for the exact mechanism.

Don't invert this: never make an OpenAI model the driver inside Claude Code,
or a Claude model the driver inside Codex CLI, just because the table ranks
it higher on some axis. The driver is whatever's actually running the
session; only *dispatched* work crosses vendors, and only through a wrapper.

## Protect your allowance

- Default to included subscription access; API spend is a deliberate,
  separately-tracked opt-in, not a fallback when an allowance runs low.
- A chat-app subscription is not API credit for that same vendor — check
  whether your plan actually covers the invocation path you're about to use
  before assuming it does.
- When an allowance is exhausted, stop and wait for reset by default.
  Buying credits, enabling API billing, or adding another subscription is an
  explicit decision made after looking at real usage, not a silent fallback.
- Keep dispatch specs narrow and avoid redundant fan-outs — a premium tier
  spent on broad, unscoped exploration burns budget for no better answer
  than a cheaper, narrower spec would have gotten.
- A latency/priority flag (e.g. a "fast" mode some providers expose) is a
  speed lever, not a tier swap — reach for it when you're already on the
  right model but turnaround is too slow, never as a substitute for picking
  the right tier in the first place.

## Evaluating and updating this table

The table goes stale faster than the rules above it. When you revise it:

- **Weigh the axis-appropriate benchmark**, not a single leaderboard for
  everything: bounded-task solve-rate benchmarks (e.g. SWE-bench Verified/
  agentic, a coding-agent index) for `coding`; multi-step tool-use/agentic
  benchmarks (e.g. an agentic index, Terminal-Bench, a long-horizon agent
  eval) for `orchestration`.
- **Verify pricing and eval claims against the vendor's own pricing/docs
  page**, not a blog post or aggregator — third-party summaries are
  frequently wrong about what a given plan actually includes.
- **Keep a small personal eval set** — a handful of real, recurring tasks
  you actually do — and rerun it when a model, allowance, or client changes.
  Revise the table from those results (quality, retries, elapsed time,
  allowance burned) more than from published benchmarks alone; a benchmark
  tells you what a model can do in general, your own recurring tasks tell
  you what it does for *your* work.
- Escalate the ladder in order when a cheaper tier stops clearing the bar
  (e.g. `luna → terra → sol`), rather than jumping straight to the top tier
  by habit.

## Effort/thinking levels

Vendors default higher than you might expect for a subagent seat — set
effort explicitly per role rather than relying on inherited defaults:

| role | model | thinking | why |
|------|-------|----------|-----|
| coordinator (session) | sonnet-5 | `medium` baseline; bump to `high`/`xhigh` per turn for architecture/scoping | cost-saving step-down from the vendor default; escalate per-turn, not globally |
| researcher / recon | gpt-5.6-luna | `low` | cheap, high-volume lookups |
| worker / mechanical implementer | gpt-5.6-terra | `medium` | vendor default for this tier, pinned explicitly instead of inherited |
| planner | sonnet-5 | `high` | planning quality matters more than per-call cost; invoked far less often than the coordinator loop |
| oracle / hard-but-bounded | gpt-5.6-sol | `high`, escalate to `xhigh` only when evals show a clear win | only escalate further when there's evidence it helps |
| adversarial review | opus-5 | `high` | independent review is worth the premium tier |

Don't hold a session at `high`/`xhigh` by default — reserve escalation for
the turn that actually needs it, then drop back down.

## Mechanics

- `gpt-5.6-*` models are reached through whichever OpenAI-compatible
  provider account you have access to — pass the model straight to your
  harness's model parameter (e.g. `{ model: "openai/gpt-5.6-terra" }`).
- `sonnet-5` / `opus-5` / `fable-5.1` run via your harness's own model
  parameter for Claude models.
- Label every dispatch `model:title` so the running model is visible at a
  glance, and state the per-wave model up front for any fan-out rather than
  silently inheriting the session model.
- A CLI-driven agent (e.g. `codex exec`) generally can't drive a real
  browser by itself — there's no browser backend behind a headless CLI run.
  For screenshot/design-mock verification, use whatever browser-attached
  path your setup has (an in-app browser tool in a desktop client, or a
  headless automation script you run and hand the screenshots to the
  agent) rather than assuming a bare CLI call can do it.
