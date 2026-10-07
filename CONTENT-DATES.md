# Content dates

`last_updated` is the date this directory record was edited, not a claim that the external book, person, company or podcast changed. Initial values are 2026-10-07, when the records were imported and enriched. Update this field only when editing a record, never on every build.

`created` is optional and must be source-backed. Use the book edition publication date, podcast/channel launch date, company founding date or resource publication date as appropriate. Omit unknown values. A book's existing `year` supplies year-only publication data; do not fabricate a day or month. Event `date`, `last_episode`, `last_video`, and job `checked` remain distinct. Job `posted` is not populated where the employer gave none. Do not infer a podcast start from a truncated feed.

Structured data separates CreativeWork directory records (`dateModified`) from the subject (`Book.datePublished`, for example). The page modification date is the latest record update on that page. Person creation/birth dates are not inferred. `sources.json` records artwork provenance, not publication dates.
