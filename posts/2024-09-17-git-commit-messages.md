---
title: Git Commit Messages
tags: [dev, git]
---

Here are some quick conventions for good commit messages and pull request titles.

<!-- truncate -->

-   Git commit messages have two parts, the title and the body.
    -   The title is the first line.
    -   The body is all subsequent lines.
    -   The title should generally have a max of 50-72 characters.
    -   The body can be any size.
-   Commit message titles should be in the imperative verb form.

    -   A git commit's message title should be able to complete this sentence: "Once applied, this commit will \<commit-message-title\>"
    -   Example: Once applied, this commit will "fix the user database tests"

-   Commit message titles should be short and succinct but detailed enough to explain what the commit is doing.
-   Commit message bodies can have long form paragraphs, with whatever extra info or context is needed and helpful.
-   To include ticket numbers (such as Jira ticket numbers or Git issue numbers) in the commit message, either list them last in the message title or push them off into the message body.
    -   A good way to include issue numbers in the body is with the ticket service name and then the ticket number: `\<service\>: \<ticket\>`
    -   On GitHub, you can use [their specific keywords for linking commits to issues](https://docs.github.com/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue#linking-a-pull-request-to-an-issue-using-a-keyword).

Pull request title conventions follow the same conventions as the commit message _title_ with the exception that an issue or ticket number should always be appended when relevant, even if it runs the title a bit long.

## Examples

1.  ```
    fix the user database tests

    The tests were reading from the incorrect request header when saving a user to the database.

    GitHub: #4
    ```

2.  ```
    add the new chat widget

    Jira: LCD-653
    ```

3.  ```
    add automated testing EVM-653
    ```

4.  ```
    convert the backend package from CJS to ESM

    resolves #62
    ```
