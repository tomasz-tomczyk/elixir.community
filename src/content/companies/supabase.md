---
name: Supabase
url: https://supabase.com
industry: Developer platform
about: The Supabase Realtime server is written in Elixir.
color: '#3fcf8e'
order: 3
reading:
  - label: supabase/realtime on GitHub
    url: https://github.com/supabase/realtime
---

## What they do

Supabase is an open-source backend platform built on Postgres. It gives developers a database, auth, storage, edge functions, and real-time updates.

## How they use Elixir

Supabase Realtime is an Elixir and Phoenix server. It listens to changes in Postgres and pushes them to connected clients over WebSockets. It also gives apps broadcast messages and presence ("who is online") on top of Phoenix Channels.

The project is open source, so you can read how a production team uses Phoenix Channels and clustering for a multi-tenant real-time service.
