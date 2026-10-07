// Outbound click counts from Workers Analytics Engine.
// Usage: CF_ACCOUNT_ID=... CF_API_TOKEN=... node scripts/click-report.mjs [days=30]
// The token needs Account > Account Analytics > Read. Keep it out of the repo.
const { CF_ACCOUNT_ID: account, CF_API_TOKEN: token } = process.env
if (!account || !token) {
  console.error('Set CF_ACCOUNT_ID and CF_API_TOKEN.')
  process.exit(1)
}
const days = Number(process.argv[2] || 30)
if (!Number.isInteger(days) || days < 1 || days > 92) {
  console.error('Days must be 1-92.')
  process.exit(1)
}
const since = `timestamp > NOW() - INTERVAL '${days}' DAY`
async function query(sql) {
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${account}/analytics_engine/sql`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: sql + ' FORMAT JSON',
    },
  )
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`)
  return (await res.json()).data
}
// SUM(_sample_interval) stays correct if Analytics Engine samples the data.
const report = [
  [
    'Destinations',
    `SELECT concat(blob1, blob2) AS destination, SUM(_sample_interval) AS clicks FROM elixir_community_clicks WHERE ${since} GROUP BY destination ORDER BY clicks DESC LIMIT 100`,
  ],
  [
    'Destination sites',
    `SELECT blob1 AS site, SUM(_sample_interval) AS clicks FROM elixir_community_clicks WHERE ${since} GROUP BY site ORDER BY clicks DESC LIMIT 50`,
  ],
  [
    'Source pages',
    `SELECT blob3 AS page, SUM(_sample_interval) AS clicks FROM elixir_community_clicks WHERE ${since} GROUP BY page ORDER BY clicks DESC LIMIT 50`,
  ],
]
for (const [title, sql] of report) {
  console.log(`\n${title}, last ${days} days`)
  console.table(await query(sql))
}
