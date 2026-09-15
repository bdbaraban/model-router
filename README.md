# model-router

## What you're installing

| File | What it does |
| --- | --- |
| [`routing-table.md`](routing-table.md) | The rules and model table you put in your `AGENTS.md`/`CLAUDE.md` so your agent knows which model to hand delegated work to. |
| [`pi-model-router`](pi-model-router/) | Teaches `pi` to consult the table before an ad hoc `subagent` dispatch, fan-out, or escalation. |
| [`claude-code-model-router`](claude-code-model-router/) | The same, for Claude Code's `Task` dispatch and `/model` escalation. |
| [`codex-model-router`](codex-model-router/) | The same, for a `codex exec` dispatch — pins `-m` and `-c model_reasoning_effort` explicitly per the table instead of relying on `config.toml` defaults. |

Only install the harness folder(s) you actually use. `routing-table.md` is
required either way — the skills just tell an agent *when* to open it; they
don't duplicate the table.

---

# Installation Instructions

### Option 1) Ask your agent to install

Paste this to your agent and it'll do it for you:

```text
Clone this repo to /tmp/ and set it up for me:

    git clone https://github.com/bdbaraban/model-router /tmp/model-router

1. Append the contents of /tmp/model-router/routing-table.md to my AGENTS.md
   (or CLAUDE.md) as a new section, verbatim — don't reword, summarize, or
   shorten it. If a "Picking the Right Models for Workflows and Subagents"
   section already exists there, ask me before overwriting it instead of
   duplicating it.
2. Ask me which harness(es) I use: pi, Claude Code, Codex CLI, or some
   combination.
3. For each harness I name, copy that harness's skill folder
   (pi-model-router/, claude-code-model-router/, or codex-model-router/) into
   wherever that harness's skills live on this machine — usually
   ~/.pi/agent/skills/ for pi, ~/.claude/skills/ for Claude Code,
   ~/.codex/skills/ for Codex CLI — and rename the copied folder to
   model-router/ so its directory name matches its frontmatter.
4. Copy the SKILL.md exactly as written. Do not rewrite, reword, shorten, or
   improve any SKILL.md. These are prompts, and the specific wording is what
   makes them work.
5. Once installed, tell me the table in AGENTS.md/CLAUDE.md ships with my
   real model names and scores as a starting template — go check they still
   match what I actually pay for and have access to.
6. When you're done, write me one paragraph covering what these skills do
   and how you'll know when to use them. No jargon, speak coherently, keep
   it simple and short, like one human talking to another.
```

### Option 2) Run the commands yourself

```sh
git clone https://github.com/bdbaraban/model-router
cd model-router

# 1. Add the routing table to your agent config
cat routing-table.md >> ~/AGENTS.md   # or wherever your AGENTS.md/CLAUDE.md lives

# 2. Install the skill(s) for the harness(es) you use
cp -R pi-model-router ~/.pi/agent/skills/model-router
cp -R claude-code-model-router ~/.claude/skills/model-router
cp -R codex-model-router ~/.codex/skills/model-router
```

The table in `routing-table.md` ships with a real model lineup and real
scores as a starting template, not empty placeholders — <u>**edit the model
names and scores to match what you actually pay for and have access
to**</u>.

> **Copy the text, don't just install the folder.** Open the `SKILL.md`, read
> it, and retype the parts you want. You'll get a feel for why one skill
> keeps getting used and another just sits there, and you'll end up with a
> version that fits how you work. The install commands are here if you'd
> rather start from a working copy and edit it from there.

<details>
<summary><b>How to set it up, step by step</b></summary>

<br>

### Step 1: Tell your agent when to route work

Paste the rules from **[`routing-table.md`](routing-table.md)** into your
`AGENTS.md` or `CLAUDE.md`.

Do this first. A skill only fires when something decides to fire it. The
skill file explains how to consult the table, but something still has to
notice "this dispatch needs a model choice," and that call gets made on
every delegation.

`routing-table.md` has a table ranking models on cost, coding, orchestration,
and taste, plus the rules for choosing between them. Change the names and
numbers to match what you're actually paying for.

### Step 2: Let pi route its subagent dispatches

```sh
# Copy the skill folder into ~/.pi/agent/skills/, or into your dotfiles if
# you symlink them in. pi picks it up next session, nothing to restart.
cp -R pi-model-router ~/.pi/agent/skills/model-router
```

**[`pi-model-router`](pi-model-router/)** fires before any one-off
`subagent` call, fan-out, or escalation judgment — the dispatches that
aren't already covered by a named, config-pinned role.

Use it for a task-graph harness where the coordinator dispatches most
implementation rather than editing inline.

### Step 3: Let Claude Code route its Task dispatches

```sh
# Copy the skill folder into ~/.claude/skills/, or into your dotfiles if you
# symlink them in. Claude Code picks it up next session, nothing to restart.
cp -R claude-code-model-router ~/.claude/skills/model-router
```

**[`claude-code-model-router`](claude-code-model-router/)** fires before a
`Task` dispatch, a fresh-context reviewer spin-up, or a session-level
`/model` escalation.

### Step 4: Let Codex CLI route its own delegated runs

```sh
# Copy the skill folder into ~/.codex/skills/, or into your dotfiles if you
# symlink them in. Codex picks it up next session, nothing to restart.
cp -R codex-model-router ~/.codex/skills/model-router
```

**[`codex-model-router`](codex-model-router/)** fires before a `codex exec`
dispatch, and pins `-m` and `-c model_reasoning_effort` explicitly per the
table instead of relying on `config.toml` defaults, which interactive CLI use
can mutate.

</details>

## Why the table ships with real values, not empty placeholders

A routing table only proves it works when it's actually one someone routes
with day to day. Starting from a filled-in template also shows the shape
scores should take — you're editing values, not inventing a schema. Expect
to change the model names first; the numbers will drift as pricing and
evals do.

## Adding another harness

1. Copy an existing skill folder as a starting point.
2. Rewrite the dispatch-mechanics steps to match that harness's actual
   delegation mechanism (a subagent tool, a Task tool, a CLI flag, whatever
   it has).
3. Keep the classification logic (step 2) and the "judge the result, not the
   price" closing principle — those don't change per harness.
4. Send a PR.

Manual for now. I'll add an installer if it ever becomes annoying enough.
