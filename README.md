# Agentic QA Workflow

Agents turn a Jira story into traceable BDD tests, automate them with
Playwright, and repair them when the app changes. Deterministic gates and evals
decide which of their output is accepted.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/workflow-dark.svg">
  <img alt="A Jira story becomes traceable BDD tests in ai-native-test-design, then Playwright automation in ai-native-ui-automation, which runs against qa-dashboard. A requirement wiki feeds business rules to the automation. Four guardrails sit underneath: the spec is frozen, locators come from tool evidence, failures stay visible, and remote writes are explicit." src="assets/workflow-light.svg">
</picture>

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

## Evidence

Skills are tested like code: fixed tasks, graded against written checks.
Small samples are reported as passed checks, not as success rates.

| Skill | Checks passed | Sample |
|---|---|---|
| [Functional test design](https://github.com/DerrickDeng/ai-native-test-design/blob/main/docs/evaluation/results.md) | **155 / 164** (previous version 137 / 165) | 4 tasks × 3 runs |
| [Test healer](https://github.com/DerrickDeng/ai-native-ui-automation/blob/main/docs/evaluation/results.md) | **53 / 61** | 4 tasks × 1 run |

Deterministic gates run on every change: 66 CLI and lint tests, and 42
framework and skill contract tests.

---

Built by Derrick Deng, QA lead with 8 years in banking and telecom.\
Playwright · TypeScript · playwright-bdd · Python · Jenkins · Claude Code · Codex · Gemini CLI
