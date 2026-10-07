# SEO audit - 7 October 2026

## Result

Audited the live apex after the dates deployment and inspected all 71 freshly built HTML pages. Titles are unique, descriptions are present and under 160 characters, each page has one H1, every image has an alt attribute, and all local internal link destinations exist. Decorative/redundant artwork keeps empty alt text; cover and portrait images retain descriptive alt text.

## Fixes

- Added absolute og:url, site name, locale and a 1200x630 social image, plus Twitter summary-large-image metadata. No invented social account handles.
- Normalized canonicals to the trailing-slash URL actually served by Pages. Query strings and signup tokens are not included.
- Added noindex,follow to confirmation, thank-you and 404 templates. Removed these utility pages from the sitemap. No robots disallow that would stop crawlers seeing noindex.
- Added a standard origin robots.txt with the sitemap URL. Cloudflare can prepend its managed policy; this audit does not change that dashboard policy.
- Added stable sitemap lastmod from the directory records, including company/person/job detail pages. Dates do not refresh merely because CI runs.
- Added visible directory-entry update dates and structured metadata. Book publication years retain their known precision. Unknown publication/launch/founding dates remain absent. Event dates and latest episode/upload dates stay distinct from publication dates.

## Structured data caveats

Directory records are CreativeWork objects with dateModified, describing a Book, PodcastSeries, Person, Organization, Event or resource. The outer page describes the page, not an invented article. Job pages do not claim JobPosting rich-result eligibility because a verified employer datePosted is missing. Event markup reflects known dates, but unknown venue/status/details are not invented; no rich-result eligibility claim is made. No fake reviews, ratings, newsletter issues or subscriber figures.

## Recommendations needing a decision

1. Connect this domain in Search Console and submit sitemap-index.xml; review indexing after launch. This audit checks technical crawlability, not whether Google has already indexed or ranked the site.
2. Replace thin one-line profiles with useful original context when evidence is available. Avoid generating filler just to lengthen pages. Decide whether books/podcasts/resources merit dedicated pages before adding hundreds of near-duplicate routes.
3. Add exact book publication dates and podcast/channel launch dates only from authoritative sources, preserving edition specificity and year-only precision when that is all we know. An RSS feed's oldest remaining episode is not proof of launch date.
4. Complete remaining official artwork gaps and the documented Astro Image migration. Consider responsive images and explicit dimensions, then measure Core Web Vitals. No Lighthouse/PageSpeed scores were run or promised in this pass.
5. Confirm legal/privacy drafts with a qualified reviewer. Privacy content was intentionally left to the separate Turnstile change in progress.
6. Review www behavior separately. The apex canonical is correct; preexisting www Gandi redirection/DNS was not changed by this audit.
7. Rich-result validation is a separate check. JSON parses and the selected schema types/properties were inspected; Google's Rich Results Test and indexing evidence have not been obtained.

## Sources

- Live site: https://elixir.community/ and directory/detail routes.
- https://developers.google.com/search/docs/appearance/publication-dates - page dates must describe the page, not future event dates; keep visible and structured dates consistent.
- https://developers.google.com/search/docs/crawling-indexing/block-indexing - noindex must be accessible to crawlers.
- https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap - canonical URLs and meaningful lastmod.
- https://schema.org/Book - Book publication metadata.
- https://schema.org/PodcastSeries - podcast series type.
- https://schema.org/CollectionPage - directory page type.
