---
title: A Collection of PostgreSQL Commands
tags: [dev, backend, PostgreSQL, database]
# last_update
---

A collection of commands for use in PostgreSQL. Many will be applicable to any SQL database (not just PostgreSQL). I'll add more to this over time.

If you're an experienced database dev, these will probably be stupidly obvious to you.

-   list columns of a table

    ```sql
    SELECT column_name FROM information_schema.columns where table_name = '<table-name>' ORDER BY ordinal_position;
    ```

-   add a column if it does not exist

    ```sql
    ALTER TABLE "<table-name>" ADD COLUMN IF NOT EXISTS "<column-name>" <column-type>;
    ```

-   get the size of all tables

    ```sql
    SELECT
        table_name,
        pg_size_pretty(pg_total_relation_size(quote_ident(table_name))) AS size,
        pg_total_relation_size(quote_ident(table_name)) AS relation_size
    FROM information_schema.tables
    WHERE table_schema = 'public'
    ORDER BY 3 DESC;
    ```
