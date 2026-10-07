---
last_updated: '2026-10-07'
name: Mux
url: https://www.mux.com
industry: Video infrastructure
description: 'An API for video streaming, hosting and playback analytics.'
about: Phoenix powers its public video API and real-time dashboard, alongside Go video-processing services.
order: 25
reading:
  - label: Running in Production podcast
    url: https://runninginproduction.com/podcast/31-mux-is-an-api-based-platform-that-lets-you-process-and-stream-videos
image: /images/companies/mux.svg
---

## How Mux uses Elixir

Mux engineer Dylan Jhaveri describes a Phoenix public API and a real-time dashboard powered by WebSockets and Channels. Elixir handles API work, asynchronous jobs and rate limiting, while Go services do CPU-intensive video processing.

The team used the exq library for background jobs within the application supervision tree. This is a useful division of responsibilities: Elixir coordinates requests and application behavior, while the video infrastructure does the encoding.

### Source

[Running in Production podcast](https://runninginproduction.com/podcast/31-mux-is-an-api-based-platform-that-lets-you-process-and-stream-videos). This profile describes the implementation discussed in that source.
