---
last_updated: '2026-10-07'
name: BBC
url: https://www.bbc.co.uk
industry: Broadcasting
description: "The UK's public broadcaster, with TV, radio, news and the iPlayer streaming service."
about: Elixir routing infrastructure handles BBC web and app traffic, with
  circuit breakers for resilience.
order: 23
reading:
  - label: ElixirConf EU 2025 talk
    url: https://www.youtube.com/watch?v=e99QDd0_C20
image: /images/companies/bbc.webp
---

## How BBC uses Elixir

Ettore Berardi's ElixirConf EU talk follows the BBC's journey from a proof of concept to infrastructure serving almost all of its web and app traffic. A small team introduced Elixir and gradually built organizational confidence in the system.

The presentation covers a route-management DSL, handling traffic spikes and circuit breakers with fallback behavior. Those examples show Elixir at the routing layer, not a claim that every BBC product uses it.
