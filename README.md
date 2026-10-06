# Derrick Deng

**QA lead · AI-native test automation**

I build AI agents that design, automate, and repair tests, and the guardrails
that decide whether their output can be trusted.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/workflow-dark.svg">
  <img alt="A Jira story becomes traceable BDD tests in ai-native-test-design, then Playwright automation in ai-native-ui-automation, which runs against qa-dashboard. A requirement wiki feeds business rules to the automation. Four guardrails sit underneath: the spec is frozen, locators come from tool evidence, failures stay visible, and remote writes are explicit." src="assets/workflow-light.svg">
</picture>

| Repository | What it does |
|---|---|
| **[ai-native-test-design](https://github.com/DerrickDeng/ai-native-test-design)** | Turns a Jira story into traceable BDD tests, recommends the automation layer, and composes the release regression suite. |
| **[ai-native-ui-automation](https://github.com/DerrickDeng/ai-native-ui-automation)** | Playwright + playwright-bdd framework where agents implement missing steps and heal broken tests. |
| **[qa-dashboard](https://github.com/DerrickDeng/qa-dashboard)** | The app under test, and where results land: execution, defects, and AI effectiveness. |

## Evidence

Skills are tested like code: fixed tasks, graded against written checks.
Small samples are reported as passed checks, not as success rates.

| Skill | Checks passed | Sample |
|---|---|---|
| [Functional test design](https://github.com/DerrickDeng/ai-native-test-design/blob/main/docs/evaluation/results.md) | **155 / 164** (previous version 137 / 165) | 4 tasks × 3 runs |
| [Test healer](https://github.com/DerrickDeng/ai-native-ui-automation/blob/main/docs/evaluation/results.md) | **53 / 61** | 4 tasks × 1 run |

Deterministic gates run on every change: 66 CLI and lint tests, and 42
framework and skill contract tests.

## Background

8 years in software quality, in banking (wealth management across Hong Kong,
Singapore, and Taiwan) and telecom. QA owner and team lead; built UI and API
automation and Jenkins regression from zero.

Playwright · TypeScript · Cucumber / playwright-bdd · Python · Selenium · PyTest ·
Jenkins · Claude Code · Codex · Gemini CLI
