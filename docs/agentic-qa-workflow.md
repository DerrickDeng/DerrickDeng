# Agentic QA Workflow

**Testing at the speed of AI coding.**

- **Testing is now the bottleneck.** AI makes code faster to write. If testing
  stays slow, delivery stays slow.
- **Review cannot find all problems.** AI writes more code than people can
  review line by line. Tests must find the problems that review does not find.
- **This workflow makes verification faster and stricter.** Agents design tests
  from each story, implement them in Playwright, and classify failures and
  fix test issues. Each test traces back to the requirement text.

![A Jira story becomes traceable BDD tests in ai-native-test-design, then Playwright scripts in ai-native-ui-automation. A requirement wiki gives business rules to the automation.](../assets/workflow-light.svg#gh-light-mode-only)
![A Jira story becomes traceable BDD tests in ai-native-test-design, then Playwright scripts in ai-native-ui-automation. A requirement wiki gives business rules to the automation.](../assets/workflow-dark.svg#gh-dark-mode-only)

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
| [functional test design](https://github.com/DerrickDeng/ai-native-test-design/tree/main/skills/functional-test-design) | Reads the Story and relevant related Stories to understand requirements. Organizes test points. Records requirement defects and test logic that needs clarification. Writes BDD `.feature` test cases. Checks requirement traceability, runs lint, and completes an independent review. |
| [automation coverage analysis](https://github.com/DerrickDeng/ai-native-test-design/tree/main/skills/automation-coverage-analysis) | Recommends automation test layers based on each feature’s implementation architecture. |
| [regression suite design](https://github.com/DerrickDeng/ai-native-test-design/tree/main/skills/regression-suite-design) | Combines existing functional test scenarios into representative user journeys for release regression. Adds high-risk scenarios based on business risk. |
| [jira cli](https://github.com/DerrickDeng/ai-native-test-design/tree/main/skills/testcase-agent-cli) | Downloads Jira Story requirements and referenced screenshots into local requirement files. Uploads BDD test cases to the Story ticket and creates or updates Zephyr tests. |
| [requirement wiki](https://github.com/DerrickDeng/ai-native-test-design/tree/main/wiki) | Uses OpenViking, a third-party LLM Wiki tool, to organize Stories into a Requirement Wiki. Helps agents find relevant requirements and retrieve context for test design and automation. |

### 2. UI Automation

Project: [ai-native-ui-automation](https://github.com/DerrickDeng/ai-native-ui-automation)

| Skill / Tool | What it does |
|---|---|
| [playwright bdd step implementor](https://github.com/DerrickDeng/ai-native-ui-automation/tree/main/.claude/skills/playwright-bdd-step-implementor) | **Turns a BDD feature into Playwright scripts.** Runs the scenario in debug mode and stops at each missing step, so the agent sees the real page and test state. Takes each locator from Playwright CLI output, not from a guess. Writes step definitions and Page Objects. Runs the scenario again to confirm that it passes. |
| [playwright bdd test healer](https://github.com/DerrickDeng/ai-native-ui-automation/tree/main/.claude/skills/playwright-bdd-test-healer) | Diagnoses previously passing BDD tests from failure reports and traces. Uses live debugging when needed, repairs test code, and reruns affected scenarios. |
| [requirement context retrieval](https://github.com/DerrickDeng/ai-native-ui-automation/tree/main/.claude/skills/requirement-context-retrieval) | Searches the requirement Wiki through OpenViking, reads cited Stories or notes, and checks source freshness to answer a specific business question. |

### 3. Agent Output Control

An agent writes fast, but it can guess, skip a rule, or stop before the work is
complete. Both projects control the output before, during, and after each run.

| Control | How it works | Example |
|---|---|---|
| **Context management** | Layered context. Global context loads at the start of each session. Skill references load only when a step needs them. A retrieval skill fetches domain knowledge on demand and checks each citation against its source. A subagent gets an isolated context when its judgment must stay independent. | `CLAUDE.md` or `AGENTS.md` is the global context. It points to `CodeRules.md`, which has 102 numbered rules, and one source serves Claude Code, Codex, and Gemini CLI. The step implementor looks up business rules in the requirement Wiki. |
| **Skill structure** | Fixed sections in each skill: an evidence contract, non-negotiables, gotchas, stop conditions, an output contract, and quality gates. | Non-negotiable: never invent an expected result. Gotcha: agents often add error and permission tests that the Story does not ask for. The skill tells the agent to test only what the requirement states. |
| **Evidence for each output** | A source-of-truth map gives one source for each question. When evidence is missing, the agent stops the step or records an open question. It never guesses. | Each test traces to a quote from the requirement. Each locator comes from Playwright CLI output. Requirement gaps go to `note.md`. |
| **Structured output contract** | Fixed output fields, defined by a JSON schema or a fixed table, with a rule for each field. A script checks each rule. | In the coverage trace, each requirement claim has a status, and each `Then` links to its claim. |
| **Machine checks** | Lint and type checks, custom scripts for domain rules, and runtime guards. | A script checks that each requirement claim has a test or a reason, and that each quoted text exists in the requirement. |
| **Independent review** | A subagent reviews the output in a fresh context. It gets only the source and the output, not the author's reasoning. | The reviewer lists the requirement claims again and finds the claims that no test covers. |
| **Skill evaluation** | Golden tasks with written checks and an LLM grader. A/B runs with and without the skill. Regression runs after a major skill change. Contract tests check that each skill still states its key rules. | See [Skill Evaluation](#4-skill-evaluation). |

### 4. Skill Evaluation

**Skills are tested like code.** Each skill has golden tasks with written
checks. A grader reviews each run against the checks. The tasks run again after
a major skill change to find regressions.

> [!IMPORTANT]
> **We built an app only for skill evaluation.**
> [QA Dashboard](https://github.com/DerrickDeng/qa-dashboard) changes its
> features to fit each test scenario.
>
> - **Any scenario:** break a locator, or leave out a tile on purpose.
> - **Stable:** local app, generated data, the same start state for each run.
> - **Fast regression:** rerun all golden tasks without a shared environment.
> - **Honest:** the agent cannot read the app source. The first eval run found
>   a real bug in the app.

**With and without the skill.** Both configurations work in the same
repository, with the same rules files and lint. The difference shows what the
skill adds. The samples are small, so the results show passed checks, not
success rates.

| Skill | Without the skill | With the skill | Sample |
|---|---|---|---|
| [functional-test-design](https://github.com/DerrickDeng/ai-native-test-design/blob/main/docs/evaluation/results.md#functional-test-design-with-and-without-the-skill) | 141 / 165 | **159 / 165** | 4 tasks × 3 runs |
| [playwright-bdd-step-implementor](https://github.com/DerrickDeng/ai-native-ui-automation/blob/main/docs/evaluation/results.md#playwright-bdd-step-implementor-with-and-without-the-skill) | 13 / 36 | **34 / 36** | 2 tasks × 1 run |
| [playwright-bdd-test-healer](https://github.com/DerrickDeng/ai-native-ui-automation/blob/main/docs/evaluation/results.md#playwright-bdd-test-healer) | 8 / 15 | **13 / 15** | 1 task × 1 run |

Deterministic gates run on each change: 66 CLI and lint tests, and 42
framework and skill contract tests.
