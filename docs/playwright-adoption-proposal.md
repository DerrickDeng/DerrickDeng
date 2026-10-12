# Why Move from Selenium to Playwright

Playwright makes UI tests more stable and failures easier to diagnose. It also
gives AI agents first-party tools to read pages, write tests, and debug
failures. For a team that uses Selenium, these two reasons make the move worth
it.

## 1. Playwright compared with Selenium

| Area | Selenium | Playwright |
|---|---|---|
| Waits | You write explicit waits and wait helpers. | Each action waits until the element is ready. [Assertions retry](https://playwright.dev/docs/test-assertions) until the condition is true. ([auto-waiting](https://playwright.dev/docs/actionability)) |
| Test runner | You add a runner, such as TestNG, JUnit, or Cucumber, and a report tool. | [Playwright Test](https://playwright.dev/docs/test-parallel) includes fixtures, retries, parallel runs, sharding, and an HTML report. |
| Failure evidence | Screenshots and logs, if you add them. | The [Trace Viewer](https://playwright.dev/docs/trace-viewer) shows each action, DOM snapshots, network calls, and console logs. You do not need to run the test again. |
| Locators | CSS and XPath are common, and they break when the layout changes. | [Role-based locators](https://playwright.dev/docs/locators) find elements as a user sees them, for example by role and name. CSS and XPath are still available as a fallback. |
| Network and API | You need a proxy or another tool. | One test can [mock network calls](https://playwright.dev/docs/mock) and [call APIs](https://playwright.dev/docs/api-testing) directly. |
| Browser connection | Each command goes over HTTP to a WebDriver, such as ChromeDriver, and then to the browser. | No WebDriver. Playwright talks to the browser over one open connection, so commands run faster. One API controls Chromium, Firefox, and WebKit. |

## 2. Built-in support for AI agents

AI agents work with text. Playwright gives an agent text views of the page and
of each failure, so the agent works from evidence and does not guess.

| Tool | What it gives the agent |
|---|---|
| [Playwright MCP](https://github.com/microsoft/playwright-mcp) | An agent controls a browser through MCP. It reads the page as an accessibility snapshot, not as a screenshot. |
| [Playwright CLI](https://github.com/microsoft/playwright-cli) | The same browser control as shell commands, for coding agents. It uses fewer tokens than MCP, and it can generate a locator for an element on the live page. |
| Trace CLI (`npx playwright trace`) | An agent reads a failed run's trace as text: the actions, network calls, console, errors, and DOM snapshots. |
| [ARIA snapshots](https://playwright.dev/docs/aria-snapshots) | A text tree of the page. A failed test saves one, so the agent sees the page at the moment of failure. |
| [Test Agents](https://playwright.dev/docs/test-agents) | Planner, generator, and healer agent templates. `npx playwright init-agents` adds them to a project. |

Selenium does not include these tools. A team must build them or use
third-party tools.

## 3. Evidence from my workflow

[ai-native-ui-automation](https://github.com/DerrickDeng/ai-native-ui-automation)
uses these tools in two agent skills:

- **Step implementor:** the test runner stops at a missing step. The agent
  reads the live page with Playwright CLI, and each locator comes from CLI
  output.
- **Test healer:** the agent reads the failure report and the ARIA snapshot
  first, then the trace with the trace CLI. It opens a live browser only when
  the trace is not enough.

The results are in the
[Agentic QA Workflow](agentic-qa-workflow.md#key-outcomes): a BDD scenario of
about 15 steps takes about 30 minutes instead of a day, and a test repair takes
about 30 minutes instead of half a day.

[Back to home](../README.md)
