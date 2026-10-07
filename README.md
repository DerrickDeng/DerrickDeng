# Agentic QA Workflow

**Testing at the speed of AI coding.**

- **Testing is now the bottleneck.** AI makes code faster to write. If testing
  stays slow, delivery stays slow.
- **Review cannot find all problems.** AI writes more code than people can
  review line by line. Tests must find the problems that review does not find.
- **Verification must be stricter and faster.** In this workflow, agents do the
  test work. Automated checks and a human review decide what gets merged. Evals
  measure if the agents are reliable.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/workflow-dark.svg">
  <img alt="A Jira story becomes traceable BDD tests in ai-native-test-design, then Playwright automation in ai-native-ui-automation, which runs against qa-dashboard. A requirement wiki gives business rules to the automation. Four guardrails are below: the spec is frozen, locators come from tool evidence, failures stay visible, and remote writes are explicit." src="assets/workflow-light.svg">
</picture>

## Results

| Task | Manual | With the workflow | Faster |
|---|---|---|---|
| Design functional tests for one story | ~1 h | ~20 min: agent draft in [3 min](https://github.com/DerrickDeng/ai-native-test-design/blob/main/docs/evaluation/results.md), then 15 min of review and fixes | **~3×** |
| Implement a BDD regression scenario of ~15 steps | ~1 day | ~1 h, with review and fixes | **~8×** |
| Repair a test that fails after an app change | Manual debugging | Agent fix in [~15 min](https://github.com/DerrickDeng/ai-native-ui-automation/blob/main/docs/evaluation/results.md#playwright-bdd-test-healer), then review | — |

- The manual, review, and total times are estimates from a production banking
  project.
- The agent times are median times of recorded eval runs. The time starts at
  the prompt and stops at the final report.
- In the eval runs, the agents passed 155 of 164 checks for test design, 109 of
  121 for step implementation, and 53 of 61 for repair. We show small samples
  as counts, not as success rates.

## How it works

1. **Design** · [ai-native-test-design](https://github.com/DerrickDeng/ai-native-test-design)\
   Reads the story and its acceptance criteria. Decides what to test, where to
   automate, and how much regression is necessary. Each `Then` step refers to
   the requirement text that it proves.
2. **Automate** · [ai-native-ui-automation](https://github.com/DerrickDeng/ai-native-ui-automation)\
   Implements missing steps from live browser evidence. Repairs tests that fail
   after an app change. It does not change the spec.
3. **Observe** · [qa-dashboard](https://github.com/DerrickDeng/qa-dashboard)\
   The app under test. It also shows the results: execution, defects, and AI
   effectiveness.

Automated checks run on each change: 66 CLI and lint tests, and 42 framework
and skill contract tests.
