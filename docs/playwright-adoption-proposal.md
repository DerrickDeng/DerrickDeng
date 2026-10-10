# Playwright Adoption Proposal

A proposal for evaluating Playwright and moving an existing Selenium suite in stages.

## Why consider Playwright

**Less manual waiting logic.** Playwright checks whether an element is ready before an action. Its assertions retry until the expected condition is met or the timeout expires. This can reduce custom waiting code. It does not remove the need to wait for business events or data changes. See [auto-waiting](https://playwright.dev/docs/actionability).

**Better evidence for failed tests.** Trace Viewer brings action history, page snapshots, logs, and network information together. This can help engineers understand a failure without rerunning it locally. See [Trace Viewer](https://playwright.dev/docs/trace-viewer).

**A clearer starting point for new UI tests.** These built-in tools are a reason to pilot Playwright for a modern web application. The expected gains in reliability and maintenance still need to be measured on the company's own tests.

## Compare against the current Selenium suite

Selenium supports explicit waits. The comparison should consider the team's existing wait helpers, reports, and debugging tools. See [Selenium waiting strategies](https://www.selenium.dev/documentation/webdriver/waits/).

Check required browsers, existing language choices, CI infrastructure, and the value of the current test suite before choosing a migration scope.

## Start with a pilot

1. Choose representative user journeys, including a test that is difficult to maintain.
2. Implement the same checks in Playwright. Keep test data and environments comparable.
3. Compare unstable failures, runtime, debugging time, and effort to update tests after an app change.
4. Move new tests and selected existing tests if the pilot shows a clear benefit.
5. Retire each Selenium test only after its replacement covers the required behavior.

[Back to home](../README.md)
