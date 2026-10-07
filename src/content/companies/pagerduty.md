---
last_updated: '2026-10-07'
name: 'PagerDuty'
url: 'https://www.pagerduty.com/'
industry: 'Incident management'
description: 'Incident response and on-call software for teams running production services.'
about: 'Adopted Elixir for backend services, including webhook processing and stateful event handling.'
order: 33
---

## How PagerDuty uses Elixir

PagerDuty introduced Elixir alongside its Ruby and Scala systems, then adopted it more widely for backend work. Its webhook processing service is one concrete example: receiving incident events, validating them, delivering requests and recording responses.

The implementation separates business logic from parsing, delivery and persistence. This profile covers its documented Elixir adoption and service design, rather than claiming that every current PagerDuty component uses the language.
