---
last_updated: '2026-10-07'
name: Discord
url: https://discord.com
industry: Communication
description: 'A chat app for communities, with voice, video and text channels.'
about: Real-time chat built on Elixir, with WebSocket gateways connecting people
  across text, voice and video.
order: 1
reading:
  - label: Elixir blog case study
    url: https://elixir-lang.org/blog/2020/10/08/real-time-communication-at-scale-with-elixir-at-discord/
image: /images/companies/discord.svg
---

## How Discord uses Elixir

Discord chose Elixir for its WebSocket gateway and real-time message delivery. Its engineers split the chat infrastructure into independently scalable services, while a separate Python API handled other parts of the product.

The team combined Distributed Erlang with service discovery to connect its nodes, and used Rustler to bring Rust data structures into Elixir. Elixir also handled voice and video signaling; the media streaming itself ran in C++.

### Source

[Elixir blog case study](https://elixir-lang.org/blog/2020/10/08/real-time-communication-at-scale-with-elixir-at-discord/). This profile describes the implementation discussed in that source.
