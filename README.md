# model-router

A routing table you can pull into your own harness to decide which model
handles delegated work — coordinator vs. implementer vs. reviewer, cheap vs.
frontier, escalate or don't — instead of always dispatching to whatever
model is already running the session.

## What you're installing

| File | What it does |
| --- | --- |
| [`routing-table.md`](routing-table.md) | The framework and an empty table you fill in with your own models. Paste it into your `AGENTS.md`/`CLAUDE.md` as a new section. |
| [`pi-model-router`](pi-model-router/) | A `pi` skill: teaches `pi` when to consult the table before an ad hoc `subagent` dispatch, fan-out, or escalation. |
| [`claude-code-model-router`](claude-code-model-router/) | The same skill adapted for Claude Code's `Task` dispatch and `/model` escalation. |

Only install the harness folder(s) you actually use. `routing-table.md` is
required either way — the skills just tell an agent *when* to open it; they
don't duplicate the table.

---

## Installation

### Option 1: ask your agent to install it

Paste this to your agent and it'll do the file moves for you:

```text
Clone this repo to /tmp/ and set it up for me:

    git clone https://github.com/bdbaraban/model-router /tmp/model-router

1. Append the contents of /tmp/model-router/routing-table.md to my AGENTS.md
   (or CLAUDE.md) as a new section, verbatim — don't reword, summarize, or
   shorten it. If a "Model routing for dispatched work" section already
   exists there, ask me before overwriting it instead of duplicating it.
2. Ask me which harness(es) I use: pi, Claude Code, or both.
3. For each harness I name, copy that harness's skill folder
   (pi-model-router/ or claude-code-model-router/) into wherever that
   harness's skills live on this machine (usually ~/.pi/agent/skills/ for
   pi, ~/.claude/skills/ for Claude Code — ask me if you can't tell), and
   rename the copied folder to model-router/ so its skill name matches its
   frontmatter.
4. Copy the SKILL.md exactly as written — don't rewrite, reword, or improve
   it, it's a prompt and the wording is deliberate.
5. Once installed, go fill in the table in AGENTS.md/CLAUDE.md with models
   you actually have access to — the shipped table is empty on purpose.
6. Tell me in one short paragraph what got installed and what I still need
   to fill in myself.
```

### Option 2: do it yourself

```sh
git clone https://github.com/bdbaraban/model-router
cd model-router

# 1. Add the routing table to your agent config
cat routing-table.md >> ~/AGENTS.md   # or wherever your AGENTS.md/CLAUDE.md lives

# 2. Install the skill(s) for the harness(es) you use
cp -R pi-model-router ~/.pi/agent/skills/model-router
cp -R claude-code-model-router ~/.claude/skills/model-router
```

Then open the table you just pasted in and replace the empty rows with
models you can actually invoke, their ids, and your own read of their cost
and skill on each axis.

> **Read the SKILL.md before you install it**, not just the folder name. The
> wording is what makes an agent actually reach for it instead of ignoring
> it — retype the parts that don't match how you work rather than installing
> it blind.

## Why the table ships empty

Concrete model assignments go stale fast — vendors reprice, promos expire,
new models ship. The decision procedure (tier × role × axis, cheapest-that-
clears-the-bar, deliberate escalation) is the part worth sharing; the actual
model ids and scores are yours to own and revise on your own schedule.

## Adding another harness

1. Copy an existing skill folder (`pi-model-router/` or
   `claude-code-model-router/`) as a starting point.
2. Rewrite the "Label and dispatch" and "Pick within budget" steps to match
   that harness's actual dispatch mechanism (subagent tool, Task tool, a
   CLI flag, whatever it has).
3. Keep the classification logic (step 2) and the "judge the result, not the
   price" closing principle — those don't change per harness.
4. Send a PR.

## License

MIT
