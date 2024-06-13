---
title: How GraphQL Works
tags: [dev, web, backend, GraphQL, guide]
---

This is intended to be a very basic high level overview of GraphQL, explained to a developer that already understands the basics of REST API design. This is not a deep dive into all GraphQL's features or a GraphQL pros/cons list. Also, while GraphQL is backend language agnostic, this guide will be mentioning JavaScript implementations (since that's what I work with).

<!-- truncate -->

For a full GraphQL overview, read GraphQL's own guide: https://graphql.org/learn

## What sending a GraphQL request is like

First of all, let's briefly overview what sending a GraphQL request to a GraphQL server is like:

-   GraphQL requests are sent as JSON and responses are received as JSON.
-   All GraphQL requests are sent to a single endpoint (`/graphql`).
-   Each GraphQL request includes a `query` property with a string value that instructs the GraphQL server what to do.
    -   Like this: `{"query": "GraphQL query goes here"}`
-   A GraphQL query string includes one or more "resolver" operations.
    -   A "resolver" is like an individual endpoint.
-   A GraphQL query string specifies optional inputs to each resolver.
-   A GraphQL query string must select exactly which fields it wants to receive from each resolver operation.
    -   Rather than receiving all fields like in a REST API endpoint, GraphQL requires you to specify the fields you want.
    -   There is no way to select all fields (you can't do something like `SELECT *` from SQL).
-   A GraphQL response's JSON object either has a `data` property or an `errors` property.

## What is GraphQL?

Now then, what is GraphQL itself? GraphQL is merely a specification that describes:

1.  A schema language: used to define all input and output types for resolvers.

    -   It looks similar to JSON:

        ```graphql
        type Query {
            Users: [User]
            Regions: [Region]
        }

        type User {
            id: ID!
            name: String
        }

        type Region {
            id: ID!
            name: String
        }
        ```

        This schema describes two "query" resolvers named `Users` and `Regions` which each return an array of their respective type. You can also define "mutation" resolvers and "subscription" resolvers.

2.  A query language: used for the query strings included in requests.

    -   It also looks similar to JSON:

        ```graphql
        query {
            Users {
                name
            }
            Regions {
                name
            }
        }
        ```

        This query triggers both resolvers and selects only the `name` field from each.

3.  How the defined schema and query languages are meant to be used and how they interact with each other in "resolvers".

## What does GraphQL give us?

Besides the specifications mentioned above, all that GraphQL itself gives us are some helper utilities for:

-   building and parsing schemas and queries
-   building resolvers

For JavaScript, this is published on NPM: https://www.npmjs.com/package/graphql

GraphQL's specification does not include a server or client implementation.

## What you have to bring to a GraphQL server

To actually run a GraphQL server, you must implement the following:

-   your GraphQL schema
-   all of your resolver functionality
    -   You still need to implement each resolver; just like in a REST API where each endpoint needs to be implemented.
-   a GraphQL server implementation
    -   there are packages that you can use for this, such as:
        -   Apollo: https://www.npmjs.com/package/@apollo/server
        -   Yoga: https://www.npmjs.com/package/graphql-yoga

## Typical GraphQL setup

A typical GraphQL setup looks like this:

-   the backend
    -   a GraphQL schema file, `schema.graphql`
    -   all resolver implementations
    -   a GraphQL server implementation that is passed the GraphQL schema file and the resolver implementations (probably using one of the aforementioned [Yoga](https://www.npmjs.com/package/graphql-yoga) or [Apollo](https://www.npmjs.com/package/@apollo/server) packages)
    -   a "context" object generated within the GraphQL server setup
        -   A GraphQL server's context object is used as an extra input to its resolvers.
        -   For example, this is where you could parse request headers or cookies and determine if a request is from an authorized user or not.
    -   a single path listener, `/graphql`
-   the frontend
    -   post requests sent to the backend GraphQL server's `/graphql` path
    -   a GraphQL query string included in each post request's body
        -   like this:
            ```javascript
            await fetch('/graphql', {
                body: JSON.stringify({
                    query: 'query {Users {name}}',
                }),
            });
            ```
        -   a JSON object of variables can also be included (see [here](https://github.com/electrovir/prisma-to-graphql/blob/b778d246941c8dd128e9a6d376f879e9204e2daa/packages/fetch-graphql/src/fetch-graphql/fetch-raw-graphql.ts#L11-L14))

## How a GraphQL request is handled

1. a client or frontend sends a request, using GraphQL's query language in the body, to the server
2. the server receives the request
3. the server extracts and parses the query (and its optional variables)
4. the server validates that the query matches the loaded GraphQL schema
5. the server splits up the query by each resolver (multiple resolver calls can be included in a single request)
6. the server passes each resolver query to its respective resolver implementation
7. the resolver implementation (which _you_ need to implement) executes and returns some output
8. the server verifies that the resolver's output matches the loaded GraphQL schema
9. the server masks the resolver output with the user's requested selection set
10. the server responds to the request with the masked and validated resolver output

IMO, the distinguishing features for GraphQL in this flow are:

-   **step 4**: request validation against a schema
    -   Rather than validating each request within each individual endpoint handler, a single source of truth, the GraphQL schema, is used.
-   **step 9**: masking the output
    -   Rather than sending _all_ data for a given endpoint (or resolver) in a response, only the requested fields are selected and sent.
