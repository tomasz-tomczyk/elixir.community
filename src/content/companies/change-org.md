---
last_updated: '2026-10-07'
name: Change.org
url: https://www.change.org
industry: Social impact
description: 'A petition platform where people start and sign campaigns for change.'
about: Elixir powers petition messaging and event-driven services, from email
  delivery to internal analytics.
order: 2
reading:
  - label: Elixir blog case study
    url: https://elixir-lang.org/blog/2020/10/27/delivering-social-change-with-elixir-at-change.org/
image: /images/companies/change-org.webp
---

## How Change.org uses Elixir

Change.org replaced an external messaging vendor with three Elixir applications. They decided which messages to send, assembled email content and delivered it, moving the workload in-house after testing several competing stacks.

The team later adopted Broadway for data ingestion and processing, with Phoenix exposing APIs and internal analytics. The Bandit service used feedback from user interactions to choose which copy to show.

### Source

[Elixir blog case study](https://elixir-lang.org/blog/2020/10/27/delivering-social-change-with-elixir-at-change.org/). This profile describes the implementation discussed in that source.
