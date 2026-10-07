---
last_updated: '2026-10-07'
name: Duffel
url: https://elixir-lang.org/blog/2020/12/10/integrating-travel-with-elixir-at-duffel/
industry: Travel
about: An Elixir travel API brings airline search and booking behind a single
  interface.
order: 12
reading:
  - label: Engineering story
    url: https://elixir-lang.org/blog/2020/12/10/integrating-travel-with-elixir-at-duffel/
image: /images/companies/duffel.webp
---

## How Duffel uses Elixir

Duffel built its Flights API with Elixir, Phoenix and Ecto. One customer request could trigger many airline requests, each with its own payload format, response time and failure modes.

The team used Elixir's concurrency tools to manage that fan-out and normalize results. The BEAM was a good fit for the same sort of intensive network traffic and coordination it was designed to handle in telecom systems.

### Source

[Read the engineering story](https://elixir-lang.org/blog/2020/12/10/integrating-travel-with-elixir-at-duffel/). This profile describes the implementation discussed in that source.
