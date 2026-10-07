---
last_updated: '2026-10-07'
name: 'Pinterest'
url: 'https://www.pinterest.com/'
industry: 'Social discovery'
description: 'A visual discovery platform for saving ideas and finding inspiration.'
about: 'Used Elixir for notifications, API rate limiting and the Guardian anti-spam engine.'
order: 32
---

## How Pinterest uses Elixir

Pinterest used Elixir for high-volume notification delivery and API rate limiting. It also built Guardian, a real-time query and rules engine for detecting spam.

Guardian combines user events and spam signals into a dataset that analysts can query and use to create rules. Elixir coordinates concurrent work, with lower-level performance-sensitive operations implemented in C. These are documented implementations from 2015-2021, not a claim about the entire current Pinterest stack.
