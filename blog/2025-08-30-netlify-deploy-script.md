---
title: Triggering a Netlify Deploy in Pipelines
tags: [dev, Netlify, CLI, web, deploy]
---

For a long time I, someone on my team, would wait for backend pipelines to finish before manually publishing deploys from Netlify. I finally automated it: here's how! (If you have auto-publish turned on for your production deploys, you don't need this.)

<!-- truncate -->

## Create a Netlify Access Token

To trigger the Netlify API (to publish the deploy), you need an access token from Netlify. Unfortunately, Netlify does not allow machine users or service accounts, so the token must be from an individual user. To work around that, I added a new user to our Netlify team that I'm considering a bot (note: this will cost another user per month).

Netlify's current steps, via their web UI, for generating an access token are as follows:

1. Log in to Netlify with the user that you want the token to be attached to.
2. Click your username in the bottom-left.
3. Navigate to User settings > Applications > Personal access tokens
4. Click "New access token"
5. Generate the token and paste it into your secrets manager (I prefer AWS Secrets Manager).

## Write a Script

You need a script to do the following:

1. Find the latest relevant deploy.
2. Publish that deploy.

I recommend _not_ using the [netlify-cli](https://www.npmjs.com/package/netlify-cli) npm package because it ships with an [npm-shrinkwrap.json](https://docs.npmjs.com/cli/v11/commands/npm-shrinkwrap) file. That file locks you into their transitive dependency versions, repeatedly exposing you to vulnerabilities that you can't patch (see https://github.com/netlify/cli/issues/6731 for more details).

The script should do the following:

1. Hit `https://api.netlify.com/api/v1/sites/${netlifySiteId}/deploys?state=ready&production=true`.
    - Make sure to substitute `netlifySiteId`.
    - Include your access token with the header `Authorization: Bearer ${token}`.
    - This returns a JSON response that matches the following TypeScript type:
        ```typescript
        export type NetlifyResponseData = {
            id: string;
            published_at: string | null;
            commit_ref: string;
        }[];
        ```
    - `published_at` is a valid UTC ISO string.
2. Read the JSON output and find a deploy that matches your current Git commit.
3. If `published_at` is non-null, someone already published the deploy! The script can simply exit since there's nothing left for it to do.
4. If `published_at` is `null`, publish it by sending a POST request to `https://api.netlify.com/api/v1/sites/${netlifySiteId}/deploys/${deployId}/restore`.
    - Make sure to fill in `netlifySiteId` and `deployId`
    - Include your access token with the header `Authorization: Bearer ${token}`

## Script Example

Here's the working script that I'm using. It includes:

-   pagination support
-   automatic retries
-   response data validation
-   human friendly logging

```typescript
import {check} from '@augment-vir/assert';
import {HttpMethod, indent, log, retry, selectFrom} from '@augment-vir/common';
import {FlagRequirement, parseArgs} from 'cli-vir';
import {utcIsoStringShape} from 'date-vir';
import {assertWrapValidShape, defineShape, nullableShape} from 'object-shape-tester';

const pageSize = 100;

type ScriptArgs = Readonly<{
    commitHash: string;
    netlifyAuthToken: string;
    netlifySiteId: string;
}>;

/** Many more properties exist but this is all we care about. */
const netlifyDeploysResponseShape = defineShape([
    {
        published_at: nullableShape(utcIsoStringShape()),
        commit_ref: nullableShape(''),
        id: '',
        /** The title of the commit that triggered this deploy. */
        title: nullableShape(''),
    },
]);

async function assertResponseSuccess(response: Readonly<Response>) {
    if (!response.ok) {
        const statusMessage = [
            response.status,
            response.statusText,
            await response.text(),
        ]
            .filter(check.isTruthy)
            .join(': ');
        throw new Error(`Request to '${response.url}' failed: ${statusMessage}`);
    }
}

async function findNetlifyDeploy({commitHash, netlifyAuthToken, netlifySiteId}: ScriptArgs) {
    let currentPageNumber = 0;
    let lastCount = 0;

    do {
        /** Start on page 1. */
        ++currentPageNumber;
        const deploys = await retry(
            /** Retry multiple times to help prevent flaky builds. */
            3,
            async () => {
                const response = await fetch(
                    `https://api.netlify.com/api/v1/sites/${netlifySiteId}/deploys?state=ready&per_page=${pageSize}&page=${currentPageNumber}&production=true`,
                    {
                        headers: {
                            Authorization: `Bearer ${netlifyAuthToken}`,
                        },
                    },
                );

                await assertResponseSuccess(response);

                return assertWrapValidShape(await response.json(), netlifyDeploysResponseShape, {
                    allowExtraKeys: true,
                });
            },
            {
                interval: {
                    seconds: 5,
                },
            },
        );

        const matchedDeploy = deploys.find((deploy) => deploy.commit_ref === commitHash);
        if (matchedDeploy) {
            /** To prevent massive logs, extract only the properties we care about. */
            return selectFrom(matchedDeploy, {
                commit_ref: true,
                published_at: true,
                id: true,
                title: true,
            });
        }
        lastCount = deploys.length;
    } while (lastCount >= pageSize);

    return undefined;
}

async function publishNetlifyDeploy(
    deploy: Readonly<{id: string}>,
    {netlifyAuthToken, netlifySiteId}: ScriptArgs,
) {
    await retry(
        3,
        async () => {
            const response = await fetch(
                `https://api.netlify.com/api/v1/sites/${netlifySiteId}/deploys/${deploy.id}/restore`,
                {
                    headers: {
                        Authorization: `Bearer ${netlifyAuthToken}`,
                    },
                    method: HttpMethod.Post,
                },
            );

            await assertResponseSuccess(response);
        },
        {
            interval: {
                seconds: 5,
            },
        },
    );
}

async function main() {
    const args: ScriptArgs = parseArgs(
        process.argv,
        {
            commitHash: {
                required: true,
                description:
                    'The commit hash of the current deploy source, used to find the Netlify build to publish.',
                flag: {
                    valueRequirement: FlagRequirement.Required,
                },
            },
            netlifySiteId: {
                required: true,
                description:
                    "Netlify's id for the site you're going to deploy. This is found at https://app.netlify.com/projects/<project-name>/configuration/general.",
                flag: {
                    valueRequirement: FlagRequirement.Required,
                },
            },
            netlifyAuthToken: {
                required: true,
                description: 'Your Netlify secret access token.',
                flag: {
                    valueRequirement: FlagRequirement.Required,
                },
            },
        },
        {
            binName: undefined,
            importMeta: import.meta,
        },
    );

    log.faint('Finding relevant Netlify deploy...');
    const deploy = await findNetlifyDeploy(args);

    if (!deploy) {
        throw new Error(`No Netlify deploy found for commit '${args.commitHash}'`);
    }

    log.faint(`Found deploy:\n${indent(JSON.stringify(deploy))}\n`);
    if (deploy.published_at) {
        /** Since this deploy is already published, there's nothing else for this script to do. */
        log.success('Netlify deploy already published.');
    } else {
        log.faint('Publishing Netlify deploy...');
        await publishNetlifyDeploy(deploy, args);
        log.success('Netlify deploy published.');
    }
}

await main();
```
