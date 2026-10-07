# Content dates

`last_updated` is the date this directory record was edited, not a claim that the external book, person, company or podcast changed. Initial values are 2026-10-07, when the records were imported and enriched. Update this field only when editing a record, never on every build.

`created` is optional and must be source-backed. Use the book edition publication date, podcast/channel launch date, company founding date or resource publication date as appropriate. Omit unknown values. A book's existing `year` supplies year-only publication data; do not fabricate a day or month. Event `date`, `last_episode`, `last_video`, and job `checked` remain distinct. Job `posted` is not populated where the employer gave none. Do not infer a podcast start from a truncated feed.

Structured data separates CreativeWork directory records (`dateModified`) from the subject (`Book.datePublished`, for example). The page modification date is the latest record update on that page. Person creation/birth dates are not inferred. `sources.json` records artwork provenance, not publication dates.

## Verified edition and launch dates

Book `created` values use the publisher's P1.0 first/final release history where available. These are edition release dates, not beta dates. Visible book labels retain year-only precision.

- advanced-functional-programming-with-elixir: 2025-11-17 - publisher P1.0 release history (https://pragprog.com/titles/jkelixir/advanced-functional-programming-with-elixir/)
- network-programming-in-elixir-and-erlang: 2025-08-21 - publisher P1.0 release history (https://pragprog.com/titles/alnpee/network-programming-in-elixir-and-erlang/)
- ash-framework: 2025-09-02 - publisher P1.0 release history (https://pragprog.com/titles/ldash/ash-framework/)
- elixir-patterns: 2025-05-16 - publisher P1.0 release history (https://pragprog.com/titles/d-akelixir/elixir-patterns/)
- northwind-elixir-traders: 2025-05-14 - publisher P1.0 release history (https://pragprog.com/titles/d-itnet/northwind-elixir-traders/)
- real-world-event-sourcing: 2025-03-31 - publisher P1.0 release history (https://pragprog.com/titles/khpes/real-world-event-sourcing/)
- engineering-elixir-applications: 2024-12-18 - publisher P1.0 release history (https://pragprog.com/titles/beamops/engineering-elixir-applications/)
- machine-learning-in-elixir: 2024-08-28 - publisher P1.0 release history (https://pragprog.com/titles/smelixir/machine-learning-in-elixir/)
- from-ruby-to-elixir: 2024-06-03 - publisher P1.0 release history (https://pragprog.com/titles/sbelixir/from-ruby-to-elixir/)
- building-table-views-with-phoenix-liveview: 2023-01-09 - publisher P1.0 release history (https://pragprog.com/titles/puphoe/building-table-views-with-phoenix-liveview/)
- exploring-graphs-with-elixir: 2022-11-08 - publisher P1.0 release history (https://pragprog.com/titles/thgraphs/exploring-graphs-with-elixir/)
- build-a-binary-clock-with-elixir-and-nerves: 2022-08-02 - publisher P1.0 release history (https://pragprog.com/titles/thnerves/build-a-binary-clock-with-elixir-and-nerves/)
- programmer-passport-otp: 2022-06-14 - publisher P1.0 release history (https://pragprog.com/titles/passotp/programmer-passport-otp/)
- programmer-passport-elixir: 2022-05-25 - publisher P1.0 release history (https://pragprog.com/titles/passelixir/programmer-passport-elixir/)
- build-a-weather-station-with-elixir-and-nerves: 2022-01-10 - publisher P1.0 release history (https://pragprog.com/titles/passweather/build-a-weather-station-with-elixir-and-nerves/)
- concurrent-data-processing-in-elixir: 2021-08-09 - publisher P1.0 release history (https://pragprog.com/titles/sgdpelixir/concurrent-data-processing-in-elixir/)
- testing-elixir: 2021-07-27 - publisher P1.0 release history (https://pragprog.com/titles/lmelixir/testing-elixir/)
- genetic-algorithms-in-elixir: 2021-01-20 - publisher P1.0 release history (https://pragprog.com/titles/smgaelixir/genetic-algorithms-in-elixir/)
- real-time-phoenix: 2020-03-31 - publisher P1.0 release history (https://pragprog.com/titles/sbsockets/real-time-phoenix/)
- designing-elixir-systems-with-otp: 2019-12-11 - publisher P1.0 release history (https://pragprog.com/titles/jgotp/designing-elixir-systems-with-otp/)
- programming-phoenix-1-4: 2019-10-08 - publisher P1.0 release history (https://pragprog.com/titles/phoenix14/programming-phoenix-1-4/)
- programming-ecto: 2019-04-08 - publisher P1.0 release history (https://pragprog.com/titles/wmecto/programming-ecto/)
- property-based-testing-with-proper-erlang-and-elixir: 2019-01-18 - publisher P1.0 release history (https://pragprog.com/titles/fhproper/property-based-testing-with-proper-erlang-and-elixir/)
- programming-elixir-1-6: 2018-05-17 - publisher P1.0 release history (https://pragprog.com/titles/elixir16/programming-elixir-1-6/)
- craft-graphql-apis-in-elixir-with-absinthe: 2018-03-26 - publisher P1.0 release history (https://pragprog.com/titles/wwgraphql/craft-graphql-apis-in-elixir-with-absinthe/)
- adopting-elixir: 2018-03-14 - publisher P1.0 release history (https://pragprog.com/titles/tvmelixir/adopting-elixir/)
- learn-functional-programming-with-elixir: 2018-02-27 - publisher P1.0 release history (https://pragprog.com/titles/cdc-elixir/learn-functional-programming-with-elixir/)
- functional-web-development-with-elixir-otp-and-phoenix: 2018-01-23 - publisher P1.0 release history (https://pragprog.com/titles/lhelph/functional-web-development-with-elixir-otp-and-phoenix/)
- metaprogramming-elixir: 2015-01-27 - publisher P1.0 release history (https://pragprog.com/titles/cmelixir/metaprogramming-elixir/)
- seven-more-languages-in-seven-weeks: 2014-11-18 - publisher P1.0 release history (https://pragprog.com/titles/7lang/seven-more-languages-in-seven-weeks/)
- programming-phoenix-liveview: 2026-03-04 - publisher P1.0 release history (https://pragprog.com/titles/liveview/programming-phoenix-liveview/)
- elixir-in-action-third-edition: 2024-02 - publisher publication date (https://www.manning.com/books/elixir-in-action-third-edition)
- the-little-elixir-otp-guidebook: 2016-09 - publisher publication date (https://www.manning.com/books/the-little-elixir-and-otp-guidebook)
- elixir-succinctly: 2019-04-16 - publisher publication date (https://www.syncfusion.com/ebooks/elixir-succinctly)

- Thinking Elixir: 2020-06-17, explicitly its first official episode: https://podcast.thinkingelixir.com/1
- Elixir Wizards: 2019, explicitly launched in early 2019: https://smartlogic.io/podcast/elixir-wizards/ . No day inferred from an episode listing.
- Other unknown launch/founding dates remain absent; oldest retained RSS items are not treated as launch evidence.

- Elixir em Foco: 2021-03-30, explicit creation date on https://elixiremfoco.com/ .
- Elixir Outlaws: 2018-04-15, first episode page: https://elixiroutlaws.com/1 .
- Elixir Mix: 2018-05-01, publisher welcome episode: https://topenddevs.com/podcasts/elixir-mix/emx-001-welcome-to-elixir-mix .
- BEAM Radio remains undated: https://www.beamrad.io/1 dates episode 1 to 2021-02-23, while https://www.beamrad.io/episodes says the first episode aired 2021-01-20. Neither conflicting day is silently selected.
