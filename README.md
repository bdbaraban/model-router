# model-router

A small, configurable TypeScript engine for choosing an LLM for a task, then
translating that decision into a harness-specific invocation. It supplies a
transparent selection policy and example drivers for pi and Claude Code; it
does not make model calls.

## Why

Routing tables change frequently as pricing, availability, and evaluation data
change. Separating the selection engine from configuration lets teams revise
and share their data independently of routing logic and harness integrations.

> The shipped default configuration is **illustrative, not authoritative**.
> Populate it with models you can access, your own pricing basis, and scores
> from evaluations you trust.

## Install

```sh
npm install model-router
```

## Library usage

```ts
import { classifyTask, loadConfig, selectModel } from "model-router";
import { toPiInvocation } from "model-router/drivers";

const config = await loadConfig("./node_modules/model-router/src/config/default.config.yaml");
const task = classifyTask("Implement a bounded TypeScript migration", {
  role: "implementer",
  axis: "coding",
  difficulty: "medium",
});
const decision = selectModel(task, config, { allowedTiers: ["frontier-api"] });
const invocation = toPiInvocation(decision);
// { model: "provider/medium", thinking: "medium" }
```

`classifyTask` is deliberately a documented, small heuristic rather than magic
NLP. For dependable automation, provide its `role`, `axis`, and `difficulty`
explicitly. The selector filters unavailable/budget-exceeding models, requires
the requested skill score, then chooses the cheapest qualifying candidate.
Use `escalate: true` only for work that genuinely needs a higher bar.

## CLI

```sh
model-router pick --role implementer --axis coding --budget medium --driver pi
model-router pick --role reviewer --axis orchestration --budget high --driver claude-code --config ./models.private.yaml
```

The command prints JSON containing the selected model, rationale, and native
invocation shape. `--budget` is a difficulty bar (`low`, `medium`, or `high`),
not a currency amount. Use a private config for actual costs and assignments.

## Configuration layering

`loadConfig(defaultPath, userPath)` reads YAML or JSON. If `userPath` is
omitted, it uses `MODEL_ROUTER_CONFIG`. User models replace defaults with the
same `id` and append new IDs; threshold fields merge individually. This makes
it safe to commit a generic baseline while keeping local assignments private.

```yaml
# models.private.yaml
models:
  - id: provider/medium
    tier: frontier-api
    cost: 2.5
    scores: { cost: 8, coding: 7, orchestration: 6, taste: 5 }
    notes: Locally evaluated configuration.
  - id: my-provider/private-model
    tier: local
    cost: 0
    scores: { cost: 10, coding: 6, orchestration: 5, taste: 4 }
thresholds:
  high: 9
```

See [`src/config/default.config.yaml`](src/config/default.config.yaml) for the
complete schema and [`docs/CONCEPTS.md`](docs/CONCEPTS.md) for the routing
mental model. To integrate another harness, read
[`docs/WRITING_A_DRIVER.md`](docs/WRITING_A_DRIVER.md).

## Development

```sh
npm install
npm run build
npm test
```

MIT © bdbaraban.
