---
last_updated: '2026-10-07'
name: Supabase
url: https://supabase.com
industry: Database tools
description: 'An open-source backend platform built on Postgres, with auth, storage and APIs.'
about: Supavisor, its Postgres connection pooler, is built in Elixir with Rust
  handling SQL parsing.
order: 16
reading:
  - label: Supabase blog
    url: https://supabase.com/blog/supavisor-postgres-connection-pooler
image: /images/companies/supabase.webp
---

## How Supabase uses Elixir

Supabase built Supavisor in Elixir to manage Postgres connections with high concurrency and heavy I/O. The pooler sits between clients and database servers rather than replacing Postgres itself.

For SQL parsing, the team brought Rust into the Elixir application through Rustler. Supavisor also supports distributing read requests between a primary server and replicas.

### Source

[Supabase blog](https://supabase.com/blog/supavisor-postgres-connection-pooler). This profile describes the implementation discussed in that source.
