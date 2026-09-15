# Writing a driver

The core engine returns a `RoutingDecision`; it deliberately has no knowledge
of a particular coding harness. A driver converts that decision into the
harness's native invocation data.

```ts
import type { RoutingDecision } from "model-router";
import type { HarnessInvocation } from "model-router/drivers";

export function toExampleInvocation(decision: RoutingDecision): HarnessInvocation {
  return {
    model: decision.model.id,
    effort: decision.effort,
  };
}
```

Keep drivers thin and deterministic: do not select another model, perform I/O,
or assume credentials. If a harness uses different reasoning labels, define a
small explicit mapping from the engine's effort values and test every mapped
level. Export the driver from `src/drivers/index.ts`, add a unit test, and
extend the CLI only if it is a built-in driver rather than an application-local
adapter.
