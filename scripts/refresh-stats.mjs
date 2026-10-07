// Refresh podcast and YouTube numbers in src/data/*.yaml.
// Run with `npm run refresh`. It keeps comments and order in the YAML files.
import { readFile, writeFile } from 'node:fs/promises'
import { parseDocument } from 'yaml'

const today = new Date().toISOString().slice(0, 10)
const headers = { 'user-agent': 'Mozilla/5.0 (elixir-community stats)', 'accept-language': 'en-US,en' }

async function text(url) {
  const res = await fetch(url, { headers })
  if (!res.ok) throw new Error(`${res.status} ${url}`)
  return res.text()
}

const day = (value) => new Date(value).toISOString().slice(0, 10)

async function update(file, refresh) {
  const doc = parseDocument(await readFile(file, 'utf8'))
  for (const item of doc.contents.items) {
    const id = item.get('id')
    try {
      const stats = await refresh(item)
      for (const [key, value] of Object.entries(stats)) item.set(key, value)
      item.set('checked', today)
      console.log(`ok   ${id}`, stats)
    } catch (error) {
      console.warn(`skip ${id}: ${error.message}`)
    }
  }
  await writeFile(file, doc.toString({ lineWidth: 0 }))
}

// Podcasts: count <item> entries and take the newest <pubDate> in the RSS feed.
await update('src/data/podcasts.yaml', async (item) => {
  const xml = await text(item.get('feed'))
  const dates = [...xml.matchAll(/<item>[\s\S]*?<pubDate>([^<]+)<\/pubDate>/g)].map((m) => new Date(m[1]))
  if (dates.length === 0) throw new Error('no episodes in feed')
  return { episodes: dates.length, last_episode: day(Math.max(...dates)) }
})

// YouTube: the channel page header has the video count. The channel RSS feed has the newest upload.
await update('src/data/youtube.yaml', async (item) => {
  const page = await text(`https://www.youtube.com/@${item.get('handle')}`)
  const channelId = page.match(/"externalId":"(UC[\w-]+)"/)?.[1]
  const count = page.match(/"text":\{"content":"([\d,.]+K?) videos?"/)?.[1]
  if (!channelId || !count) throw new Error('could not read channel page')
  const feed = await text(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`)
  // The first <published> belongs to the channel itself, so skip it.
  const published = [...feed.matchAll(/<published>([^<]+)<\/published>/g)].slice(1).map((m) => new Date(m[1]))
  const videos = count.endsWith('K') ? Math.round(parseFloat(count) * 1000) : Number(count.replace(/,/g, ''))
  return { channel_id: channelId, videos, last_video: published.length ? day(Math.max(...published)) : null }
})
