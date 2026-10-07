---
name: Vetspire
url: https://vetspire.com
industry: Veterinary software
about: Practice management for veterinary clinics, built on Elixir and Phoenix.
order: 9
reading: []
---

## What they do

Vetspire is a cloud practice management system for veterinary clinics. Clinics use it for appointments, medical records, billing, inventory, and client messages.

## How they use Elixir

The Vetspire backend is an Elixir and Phoenix application. It serves a GraphQL API with Absinthe to a React web app, and it runs background work such as reminders and integrations with Oban.

Clinic groups run many locations on one system. The BEAM lets one platform serve all of them, with real-time updates on busy days.
