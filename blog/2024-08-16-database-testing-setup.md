---
title: Database Testing Setup
tags: [Node.js, dev, database]
---

Here's an example of an existing production application's database testing setup in a TypeScript, Node.js backend. It's not perfect, but it works well enough.

<!-- truncate -->

## Mocha and Chai

For starters, the backend uses [Mocha](https://www.npmjs.com/package/mocha) to run unit tests and [Chai](https://www.npmjs.com/package/chai) as an assertion library. I'm not completely satisfied with either of these libraries but they're consistent and they get the job done well enough.

These libraries have no impact on how the database testing is implemented, but Mocha defines how tests are started and determines the overall, high-level testing paradigm followed.

## Prisma and PostgreSQL

The backend uses Prisma as an ORM on top of a PostgreSQL database. I've been very happy with both technologies, and recommend them to everyone in this tech stack.

Both of these, particularly Prisma, determine what tools can be used for running tests.

### `PrismaClient` as an input

The most important part of manageable database testing is to never access your `PrismaClient` instance as a global object or as an import. Any function or class that needs to access to the `PrismaClient` instance should accept it as an argument. This makes mocking Prisma trivially easy in tests. (If you're using dependency injector, this advice is moot. However, I don't enjoy or recommend using injectors.) This is particularly important for the next section...

## prismock

Testing anything that requires a `PrismaClient` instance is amazingly easy with the [prismock](https://www.npmjs.com/package/prismock) package. It creates an in-memory database mock that allows you to call most Prisma operations on it. It's extremely fast, it's easy to setup, and if your functions have a `PrismaClient` input, you can just pass the mocked instance straight in there. Here's an example code snippet for creating a prismock instance:

```TypeScript
import {PrismockClient} from 'prismock';

export async function createMockPrismaClient(data: DatabaseSeed = {}) {
    const prismockClient = new PrismockClient();

    await seedDatabase(prismockClient, data);

    return prismockClient;
}
```

`seedDatabase` is a little helper function that simply seeds the mock database with any provided data so that the mock `PrismaClient` can easily be created and filled with data at the same time.

Each unit test should make its own instance of prismock. Thus, writing a test that uses prismock looks like this:

```TypeScript
import {assert} from 'chai';
import {myFunction} from './my-function';
import {createMockPrismaClient} from './prisma-client.mock';

describe(myFunction.name, () => {
    it('acts on data', async () => {
        const prismaClient = await createMockPrismaClient({
            user: [{id: 1, role: 'admin', name: 'test user'}],
        });

        const result = await myFunction(prismaClient);

        assert.deepStrictEqual(result, expectation);
    });
});
```

### prismock database diff

prismock exposes a handy method called [`getData`](https://www.npmjs.com/package/prismock#internal-data) which is used to get a dump of the whole mock database. This is useful for debugging but, especially, for writing tests that compare the _entire_ database's contents before and after a function is called. Here's an example that uses a database diff:

```TypeScript
import {assert} from 'chai';
import {diffObjects} from 'run-time-assertions';
import {myFunction} from './my-function';
import {createMockPrismaClient} from './prisma-client.mock';

describe(myFunction.name, () => {
    it('acts on data', async () => {
        const prismaClient = await createMockPrismaClient({
            user: [{id: 1, role: 'admin', name: 'test user'}],
        });

        const databaseBefore = {...prismaClient.getData()};
        await myFunction(prismaClient);
        const databaseAfter = {...prismaClient.getData()};

        const diff = diffObjects(databaseBefore, databaseAfter);

        assert.deepStrictEqual(diff, expectation);
    });
});
```

## Real database tests

There are a few cases where a test needs an actual, running PostgreSQL database:

1.  when raw sql queries are used (these can't be mocked by prismock)
2.  when deeply nested relations are used (prismock sometimes doesn't handle these correctly)

To account these cases, the backend starts up a local Docker PostgreSQL container. Using such a container is _much_ slower than prismock, but it will take care of the above edge cases that prismock can't handle.

Creating a new database instance per test would be extremely slow. Thus, instead of doing that, a single database is started for all tests. This then requires the following conditions:

-   tests cannot run in parallel (since they're accessing a shared database instance)
-   each test will most likely need to start by clearing out the database (this will require a raw SQL query as Prisma has no API for this)

When using a real database for tests, use the real `PrismaClient` instance (as long as its connecting to the correct PostgreSQL instance). I'd still recommend using the `seedDatabase` function though, to make it easy populate data in each test.
