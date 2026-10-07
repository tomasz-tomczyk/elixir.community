---
number: 43
title: Types in practice, a LiveView form trick, and Goatmire recap
date: 2026-10-02
summary: What the type checker catches in a real app today, a small pattern for nested forms, and talks to watch from Varberg.
topics: [Types, LiveView, Events]
---

Hi friends,

This week the type system work moved from "interesting" to "useful on Monday morning". Below is a short tour, plus the usual links.

## The big one: types in a real codebase

The core team ran the new checks against a few large open-source apps. Most warnings pointed at real bugs: a branch that could never match, or a map key that a function never sets. You get these warnings with **no annotations**. Upgrade, compile, and read the output.

```elixir
def label(%{status: :active}), do: "Active"
def label(%{status: :archived}), do: "Archived"

# warning: this clause will never match
def label(%{state: :draft}), do: "Draft"
```

## Libraries

- **Req** got a small plugin for retry budgets. It caps retries per host so one slow API does not eat your pool.
- **Oban** has a clear guide on how to pick queue limits. Read it before you add a fifth queue.
- **Explorer** now reads Parquet files from S3 with lazy frames, so you only load the columns you query.

## A LiveView pattern worth stealing

Use `inputs_for` with a hidden `_persistent_id` to keep nested rows stable while users add and remove them. Your diffs stay small and focus does not jump.

## Spotlight

This month we talk to [Wojtek Mach](/people) about Req, Hex, and why defaults matter more than features.

## Events

Talks from Goatmire are up. Start with the one on running Phoenix on small hardware. It is 25 minutes and you will want to try it.

See you next Thursday,
the Elixir Community team
