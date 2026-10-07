---
name: Discord
url: https://discord.com
industry: Communication
about: Runs real-time chat for millions of users on Elixir.
color: '#5865f2'
order: 1
reading:
  - label: How Discord scaled Elixir to 5,000,000 concurrent users
    url: https://discord.com/blog/how-discord-scaled-elixir-to-5-000-000-concurrent-users
  - label: Using Rust to scale Elixir for 11 million concurrent users
    url: https://discord.com/blog/using-rust-to-scale-elixir-for-11-million-concurrent-users
---

## What they do

Discord is a voice, video, and text chat app. People use it to talk in servers built around games, hobbies, study groups, and open-source projects.

## How they use Elixir

Elixir sits at the center of Discord's real-time system. Each server (a "guild") and each connected session is a process on the BEAM. When someone sends a message, Elixir fans it out to everyone who needs to see it.

The engineering team has written in detail about how they pushed this design to millions of concurrent users. They built libraries such as Manifold to spread messages across nodes, and they added Rust NIFs where a data structure needed more raw speed than the BEAM gives.

It is one of the clearest public examples of what the actor model does at very large scale.
