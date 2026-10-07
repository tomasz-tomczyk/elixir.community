---
last_updated: '2026-10-07'
name: X-Plane / Laminar Research
url: https://elixir-lang.org/blog/2021/07/29/bootstraping-a-multiplayer-server-with-elixir-at-x-plane/
industry: Flight simulation
about: An Elixir multiplayer server connects flight-simulation sessions over UDP.
order: 8
reading:
  - label: Engineering story
    url: https://elixir-lang.org/blog/2021/07/29/bootstraping-a-multiplayer-server-with-elixir-at-x-plane/
---

## How X-Plane / Laminar Research uses Elixir

Laminar Research chose Elixir for X-Plane's multiplayer server, looking for fault tolerance and predictable latency. Engineer Tyler Young first tried the language on a smaller weather-service proxy before building the multiplayer system.

The implementation brought the UDP-based RakNet protocol to Elixir. Mapping connections to isolated BEAM processes let the server use concurrency without making each connection depend on the health of every other one.

### Source

[Read the engineering story](https://elixir-lang.org/blog/2021/07/29/bootstraping-a-multiplayer-server-with-elixir-at-x-plane/). This profile describes the implementation discussed in that source.
