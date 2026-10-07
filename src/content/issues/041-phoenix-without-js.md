---
number: 41
title: Phoenix without a build step, testing with StreamData, and new meetups
date: 2026-09-18
summary: How far plain ES modules go in a Phoenix app, property tests that found a real bug, and two cities that started a meetup.
topics: [Phoenix, Testing, Meetups]
---

Hi friends,

This one is about doing less: fewer tools, fewer tests, more confidence.

## Phoenix with no JavaScript build

A team removed esbuild and serves plain ES modules with import maps. Their page loads did not get slower, and new hires stopped asking about the asset pipeline.

## StreamData found the bug

A short post shows a property test for a money-rounding function. Three lines of generator found an edge case that 40 example tests missed.

```elixir
property "splitting never loses a cent" do
  check all total <- positive_integer(), parts <- integer(1..12) do
    assert Enum.sum(Money.split(total, parts)) == total
  end
end
```

## New meetups

Elixir groups started in two more cities this month. See the [events page](/events) for the full list, and tell us about yours.

Have a good week,
the Elixir Community team
