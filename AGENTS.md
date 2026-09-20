# Agent Guidelines (Universal)

Refer to `skills/INDEX.md` for on-demand skill routing.

## Lazy Loading Policy
Do not read skill files upfront. Only inspect a skill's full documentation when the user task explicitly requires it:
- Parallel execution / multi-slice work -> read `skills/harness-task-architect/SKILL.md`
- Subagent delegation / role assignment -> read `skills/harness-subagent-master/SKILL.md`
- AST rewrites / symbol-aware code intelligence -> read `skills/harness-code-intelligence/SKILL.md`
- Memory lookup / token optimization -> read `skills/harness-token-routing/SKILL.md`
