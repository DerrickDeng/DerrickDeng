# Agentic QA Workflow

**Testing at the speed of AI coding.**

- **Testing is now the bottleneck.** AI has made writing code much faster. If
  testing keeps its old pace, delivery does not speed up.
- **The bar for verification is higher.** More code is now written than anyone
  reviews line by line, so tests carry more of the quality burden.
- **So verification must be both stricter and faster.** In this workflow,
  agents do the test work, and deterministic gates and evals decide what is
  accepted.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/workflow-dark.svg">
  <img alt="A Jira story becomes traceable BDD tests in ai-native-test-design, then Playwright automation in ai-native-ui-automation, which runs against qa-dashboard. A requirement wiki feeds business rules to the automation. Four guardrails sit underneath: the spec is frozen, locators come from tool evidence, failures stay visible, and remote writes are explicit." src="assets/workflow-light.svg">
</picture>

## Results

| Task | Before | With the workflow | Agent time |
|---|---|---|---|
| Design functional tests for one story | ~4 h | ~1 h · **4× faster** | [3 min](https://github.com/DerrickDeng/ai-native-test-design/blob/main/docs/evaluation/results.md) |
| Implement one BDD regression scenario | ~8 h | ~1 h · **8× faster** | [7 min](https://github.com/DerrickDeng/ai-native-ui-automation/blob/main/docs/evaluation/results.md#playwright-bdd-step-implementor) |
| Repair a test broken by an app change | manual debugging | review the fix | [14 min](https://github.com/DerrickDeng/ai-native-ui-automation/blob/main/docs/evaluation/results.md#playwright-bdd-test-healer) |

- **Before / With the workflow:** per story or scenario on a production banking
  project. "With the workflow" includes human review of the agent's output.
- **Agent time:** median wall-clock time of recorded eval runs, from the prompt
  to the final report.
- **Quality of those runs:** 155 / 164, 109 / 121, and 53 / 61 graded checks
  passed. Small samples are reported as passed checks, not as success rates.

## How it works

1. **Design** · [ai-native-test-design](https://github.com/DerrickDeng/ai-native-test-design)\
   Reads the story and its acceptance criteria, then decides what to test, where
   to automate, and how much to regress. Every `Then` traces back to the
   requirement text it proves.
2. **Automate** · [ai-native-ui-automation](https://github.com/DerrickDeng/ai-native-ui-automation)\
   Implements missing steps from live browser evidence, and heals tests that
   went red after an app change, without touching the spec.
3. **Observe** · [qa-dashboard](https://github.com/DerrickDeng/qa-dashboard)\
   The app under test, and where results land: execution, defects, and AI
   effectiveness.

Deterministic gates run on every change: 66 CLI and lint tests, and 42
framework and skill contract tests.

---

Built by Derrick Deng, QA lead with 8 years in banking and telecom.\
Playwright · TypeScript · playwright-bdd · Python · Jenkins · Claude Code · Codex · Gemini CLI
