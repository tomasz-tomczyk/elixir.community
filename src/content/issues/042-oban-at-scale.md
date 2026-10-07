---
number: 42
title: Oban at scale, Nx on one GPU, and a new Ash release
date: 2026-09-25
summary: Lessons from a billion background jobs, how to serve a model behind Phoenix, and Igniter installers that do the boring setup.
topics: [Oban, Nx, Ash]
---

Hi friends,

Three long reads this week, and all three are worth your coffee.

## A billion jobs later

The Oban team wrote up what they saw across many large installs. The short version:

1. Keep jobs small. Split a big job into many jobs that each do one thing.
2. Use unique jobs on purpose. Pick the fields that make two jobs "the same".
3. Measure queue latency, not only throughput.

## Nx on one GPU

A clear walkthrough that puts a Bumblebee text model behind `Nx.Serving` and calls it from a controller. Batching does the heavy lifting. A single card handled more traffic than the author expected.

## Ash ships new generators

Igniter installers now set up auth, an admin UI, and a JSON:API endpoint in one command. Even if you do not use Ash, read the source of an installer. It is a great example of code that edits code.

## Jobs

Four new companies on the [jobs board](/jobs) this week. Each one links straight to the careers page.

Until next week,
the Elixir Community team
