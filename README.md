# model-router

My personal model-routing table, packaged so it installs directly into a
harness's config instead of living only in one machine's `AGENTS.md`.

## What's here

| File | Purpose |
| --- | --- |
| [`routing-table.md`](routing-table.md) | The actual rules: two-axis framework, a real filled-in model table, delegation stance, allowance/budget discipline, and how I evaluate and revise the table over time. Goes in `AGENTS.md`/`CLAUDE.md`. |
| [`pi-model-router`](pi-model-router/) | Skill: consult the table before an ad hoc `pi` `subagent` dispatch, fan-out, or escalation. pi is vendor-agnostic, so the full table applies directly — no wrapper needed. |
| [`claude-code-model-router`](claude-code-model-router/) | Skill: same, for Claude Code's `Task` dispatch and `/model` escalation. Claude Code is Anthropic-native — reaching an OpenAI-family model means spawning a wrapper subagent that shells out to it. |
| [`codex-model-router`](codex-model-router/) | Skill: same, for a `codex exec` dispatch — pins `-m` and `-c model_reasoning_effort` per the table. Codex CLI is OpenAI-native — reaching a Claude model means shelling out to the Claude CLI. |

Install `routing-table.md` regardless of harness. The skill folders are just
per-harness triggers that point back at it — install only the ones for
harnesses you actually run.

## Install

```sh
git clone https://github.com/bdbaraban/model-router
cd model-router

cat routing-table.md >> ~/AGENTS.md      # or wherever your AGENTS.md/CLAUDE.md lives

cp -R pi-model-router ~/.pi/agent/skills/model-router
cp -R claude-code-model-router ~/.claude/skills/model-router
cp -R codex-model-router ~/.codex/skills/model-router
```

Then open `routing-table.md` wherever you pasted it and replace the model
names, scores, and subscriptions with your own — the shipped table is real,
but it's mine, not a universal ranking.

If you'd rather have an agent do the file moves, hand it this:

```text
Clone https://github.com/bdbaraban/model-router to /tmp/model-router.
Append routing-table.md to my AGENTS.md or CLAUDE.md verbatim as a new
section (ask first if that section already exists there). Ask me which of
pi, Claude Code, or Codex CLI I use, then copy the matching skill folder(s)
into ~/.pi/agent/skills/, ~/.claude/skills/, or ~/.codex/skills/ respectively,
renamed to model-router/. Don't reword or shorten any SKILL.md — install it
verbatim. Then tell me, in a couple of plain sentences, what got installed
and that the table's models/scores are mine to replace.
```

## Why the table has real values instead of a blank template

A routing rubric only earns trust once it's actually the one you route with.
Shipping my real numbers also shows the shape a filled-in table takes —
you're editing values, not filling out a schema. Expect to replace the model
names first; the scores will drift as pricing and evals do, which is why
`routing-table.md` has its own section on how I revise them.

## Adding a harness

Copy one of the existing skill folders, swap the dispatch-mechanics steps
for that harness's actual delegation primitive (a subagent tool, a `Task`
tool, a CLI flag), and keep the classification logic and the "judge the
result, not the price" closing rule — those don't change per harness.

## License

MIT
