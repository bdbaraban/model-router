# Concepts

Model routing separates two orthogonal questions.

## Tier: where it runs and how it is paid for

A tier describes the execution and budget boundary, not quality: `local` for a
machine you control, `frontier-subscription` for work covered by a plan, and
`frontier-api` for metered API calls. Configure only tiers you are authorized
to use, then optionally constrain a request to a subset of them.

## Role: what seat it holds

A role describes responsibility: a `coordinator` scopes and judges work, an
`implementer` executes a clear assignment, and a `reviewer` independently
checks an outcome. Role is recorded alongside a routing decision so policies
and audit logs remain understandable.

The selection axis is separate again: coding for bounded implementation,
orchestration for open-ended multi-step work, and taste for design, wording,
or interface-shape decisions. Cost is used to rank qualified candidates. Pick
the cheapest enabled model whose relevant score meets the task's bar; request
escalation explicitly when the task truly needs it.
