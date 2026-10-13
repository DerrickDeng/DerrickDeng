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
| [playwright bdd step implementor](https://github.com/DerrickDeng/ai-native-ui-automation/tree/main/.claude/skills/playwright-bdd-step-implementor) | **Turns a BDD feature into Playwright scripts.** Runs the scenario in debug mode and stops at each missing step, so the agent sees the real page and test state. Takes each locator from Playwright CLI output, not from a guess. Writes step definitions and Page Objects, and never changes the feature text. Runs the scenario again to confirm that it passes. |
| [playwright bdd test healer](https://github.com/DerrickDeng/ai-native-ui-automation/tree/main/.claude/skills/playwright-bdd-test-healer) | Diagnoses previously passing BDD tests from failure reports and traces. Uses live debugging when needed, repairs test code, and reruns affected scenarios. |
| [requirement context retrieval](https://github.com/DerrickDeng/ai-native-ui-automation/tree/main/.claude/skills/requirement-context-retrieval) | Searches the requirement Wiki through OpenViking, reads cited Stories or notes, and checks source freshness to answer a specific business question. |

### 3. Agent Output Control

An agent writes fast, but it can guess, skip a rule, or stop before the work is
complete. Both projects control the output before, during, and after each run.
Each control catches what the control before it misses.

| Control | How it works | Example |
|---|---|---|
| **Context management** | Give the agent the right context at the right time. Fixed rules load at the start of each session. Detailed references load only when a step needs them. Business rules come from the requirement Wiki on demand, and the agent checks each answer against the original Story. The reviewer gets only the requirement and the output, on purpose. | `CLAUDE.md` or `AGENTS.md` loads first and points to `CodeRules.md`, which has 102 numbered rules. One source serves Claude Code, Codex, and Gemini CLI. |
| **Skill structure** | Each skill uses the same sections: an evidence contract, non-negotiables, gotchas, stop conditions, and an output contract. | Each gotcha is a mistake from a real run, and the fix for it. |
| **Evidence for each output** | The evidence contract names the source for each question. When the evidence is missing, the agent records a question and does not guess. | Each test traces to a quote from the requirement. Each locator comes from Playwright CLI output. |
| **Structured output contract** | The output has fixed fields, and each field has a rule. A script checks each field, so a missing or wrong field fails the check. In other projects, I used JSON contracts in the same way: a schema sets each field, and a review checks each field rule. | In the coverage trace, each requirement claim has a status, and each `Then` links to its claim. |
| **Machine checks** | ESLint and TypeScript check the code. Custom scripts check the rules that a general lint tool cannot check. Runtime guards stop a wrong run. | `jira-sync lint` checks each feature and its coverage trace. Other scripts check the regression suite mapping and that each Wiki citation still matches its source. |
| **Independent review** | A second agent reviews the output in a fresh context. It reads only the requirement and the output, not the author's reasoning, so it does not share the author's blind spots. | The reviewer lists the requirement claims again and finds the ones that no test covers. |
| **Skill evaluation** | Golden tasks with written checks measure each skill. A run with the skill and a run without it show what the skill adds. The tasks run again after a major skill change, to show that it improves and does not regress. | See [Skill Evaluation](#4-skill-evaluation). |

### 4. Skill Evaluation

**Skills are tested like code.** Each skill has golden tasks with written
checks. A grader reviews each run against the checks. The tasks run again after
a major skill change to find regressions.

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
| [functional-test-design](https://github.com/DerrickDeng/ai-native-test-design/blob/main/docs/evaluation/results.md#functional-test-design-with-and-without-the-skill) | 141 / 165 | **159 / 165** | 4 tasks × 3 runs |
| [playwright-bdd-step-implementor](https://github.com/DerrickDeng/ai-native-ui-automation/blob/main/docs/evaluation/results.md#playwright-bdd-step-implementor-with-and-without-the-skill) | 13 / 36 | **34 / 36** | 2 tasks × 1 run |
| [playwright-bdd-test-healer](https://github.com/DerrickDeng/ai-native-ui-automation/blob/main/docs/evaluation/results.md#playwright-bdd-test-healer) | 8 / 15 | **13 / 15** | 1 task × 1 run |

Deterministic gates run on each change: 66 CLI and lint tests, and 42
framework and skill contract tests.
