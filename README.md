# Agentic QA Workflow

**Testing at the speed of AI coding.**

- **Testing is now the bottleneck.** AI makes code faster to write. If testing
  stays slow, delivery stays slow.
- **Review cannot find all problems.** AI writes more code than people can
  review line by line. Tests must find the problems that review does not find.
- **This workflow makes verification faster and stricter.** Agents design tests
  from each story, implement them in Playwright, and classify failures and
  fix test issues. Each test traces back to the requirement text.

![A Jira story becomes traceable BDD tests in ai-native-test-design, then Playwright scripts in ai-native-ui-automation. A requirement wiki gives business rules to the automation.](assets/workflow-light.svg#gh-light-mode-only)
![A Jira story becomes traceable BDD tests in ai-native-test-design, then Playwright scripts in ai-native-ui-automation. A requirement wiki gives business rules to the automation.](assets/workflow-dark.svg#gh-dark-mode-only)

## Key outcomes

| Task | Manual | With the workflow | Faster |
|---|---|---|---|
| Design functional tests for one story | ~1 h | ~15 min: agent draft in [3 min](https://github.com/DerrickDeng/ai-native-test-design/blob/main/docs/evaluation/results.md), then 10 min of review and fixes | **~4×** |
| Implement a BDD regression scenario of ~15 steps | ~1 day | ~30 min, with review and fixes | **~16×** |
| Repair a test that fails after an app change | ~half a day | ~30 min: agent fix in 20 min, then 10 min of review and fixes | **~8×** |
| Sync one story with Jira: fetch the requirement, upload the BDD, and create the Zephyr tests | ~1 h | ~5 min with the `jira-sync` CLI | **~12×** |

## Technical Details

Agent workflows built on Claude Code, Codex, and Gemini CLI.

### 1. Test Design

Project: [ai-native-test-design](https://github.com/DerrickDeng/ai-native-test-design)

| Skill / Tool | What it does |
|---|---|
| [`functional-test-design`](https://github.com/DerrickDeng/ai-native-test-design/tree/main/skills/functional-test-design) | Reads the Story and relevant related Stories to understand requirements.<br>Organizes test points.<br>Records requirement defects and test logic that needs clarification.<br>Writes BDD `.feature` test cases.<br>Checks requirement traceability, runs lint, and completes an independent review. |
| [`automation-coverage-analysis`](https://github.com/DerrickDeng/ai-native-test-design/tree/main/skills/automation-coverage-analysis) | Recommends unit, integration, or end-to-end coverage for each behavior using architecture and test evidence. Reports coverage gaps and unknowns. |
| [`regression-suite-design`](https://github.com/DerrickDeng/ai-native-test-design/tree/main/skills/regression-suite-design) | Selects regression scenarios by business risk from existing functional tests. Produces a BDD suite, full source mapping, and a Jira coverage table. |
| [`jira-sync` CLI](https://github.com/DerrickDeng/ai-native-test-design/blob/main/bin/jira-sync) | Fetches Jira requirement snapshots, lints and exports Gherkin, and uploads Story test content or creates Zephyr tests on explicit commands. |
| [Requirement wiki](https://github.com/DerrickDeng/ai-native-test-design/tree/main/wiki) | Uses OpenViking to compile Stories and notes into cross-Story topic pages with source links. Exports the pages as Markdown. |

The same skills run in Claude Code, Codex, and Gemini CLI. A check keeps the
three copies the same.

### 2. UI Automation

Project: [ai-native-ui-automation](https://github.com/DerrickDeng/ai-native-ui-automation)

| Skill / Tool | What it does |
|---|---|
| [`playwright-bdd-step-implementor`](https://github.com/DerrickDeng/ai-native-ui-automation/tree/main/.claude/skills/playwright-bdd-step-implementor) | Implements missing steps in an authored BDD scenario using Playwright CLI browser evidence. Adds step definitions and Page Objects, then runs the scenario. |
| [`playwright-bdd-test-healer`](https://github.com/DerrickDeng/ai-native-ui-automation/tree/main/.claude/skills/playwright-bdd-test-healer) | Diagnoses previously passing BDD tests from failure reports and traces. Uses live debugging when needed, repairs test code, and reruns affected scenarios. |
| [`requirement-context-retrieval`](https://github.com/DerrickDeng/ai-native-ui-automation/tree/main/.claude/skills/requirement-context-retrieval) | Searches the requirement Wiki through OpenViking, reads cited Stories or notes, and checks source freshness to answer a specific business question. |

**Rules that shape the agent's output.** `CLAUDE.md` is a short map that the
agent reads first. It points to `CodeRules.md`, which has 92 numbered rules.
ESLint and TypeScript enforce the rules that a machine can check, and 3 rules
fail at runtime so that no one can skip them. Contract tests check that each
skill still states the key rules.

### 3. Skill Evaluation

**Skills are tested like code.** Each skill has golden tasks with written
checks. A grader reviews each run against the checks. The tasks run again after
each skill change to find regressions.

**A self-built app under test.** The evals run against
[QA Dashboard](https://github.com/DerrickDeng/qa-dashboard), an app built for
this workflow. Its source is outside the agent's repository, so the agent cannot
read the answers. It is a live app, so the evals see real behavior: the first
eval run found a real filter race in the dashboard. The dashboard also measures
the value of agents in daily use: adoption, edits before adoption, and accuracy
against reviewed tests.

**With and without the skill.** Both configurations work in the same
repository, with the same rules files and lint. The difference shows what the
skill adds. The samples are small, so the results show passed checks, not
success rates.

| Skill | Without the skill | With the skill | Sample |
|---|---|---|---|
| [Functional test design](https://github.com/DerrickDeng/ai-native-test-design/blob/main/docs/evaluation/results.md#functional-test-design-with-and-without-the-skill) | 141 / 165 | **159 / 165** | 4 tasks × 3 runs |
| [Step implementor](https://github.com/DerrickDeng/ai-native-ui-automation/blob/main/docs/evaluation/results.md#playwright-bdd-step-implementor-with-and-without-the-skill) | 13 / 36 | **34 / 36** | 2 tasks × 1 run |
| [Test healer](https://github.com/DerrickDeng/ai-native-ui-automation/blob/main/docs/evaluation/results.md#playwright-bdd-test-healer) | 8 / 15 | **13 / 15** | 1 task × 1 run |

Deterministic gates run on each change: 66 CLI and lint tests, and 42
framework and skill contract tests.
