export default async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  }

  const feeds = [
    { url: 'https://cointelegraph.com/rss', source: 'CoinTelegraph', type: 'crypto_media' },
    { url: 'https://www.coindesk.com/arc/outboundfeeds/rss/', source: 'CoinDesk', type: 'crypto_media' },
    { url: 'https://feeds.reuters.com/reuters/businessNews', source: 'Reuters', type: 'financial_media' },
  ]

  const allItems: any[] = []

  const results = await Promise.allSettled(
    feeds.map(async (feed) => {
      const res = await fetch(
        `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}&count=10`,
        { signal: AbortSignal.timeout(8000) }
      )
      if (!res.ok) throw new Error(`${res.status}`)
      const json = await res.json()
      if (json.status !== 'ok' || !json.items) throw new Error('bad response')
      return json.items.map((item: any) => ({
        title: item.title,
        description: item.description?.replace(/<[^>]*>/g, '').slice(0, 300),
        link: item.link,
        pubDate: item.pubDate,
        source: feed.source,
        source_type: feed.type,
      }))
    })
  )

  for (const r of results) {
    if (r.status === 'fulfilled') allItems.push(...r.value)
  }

  allItems.sort((a: any, b: any) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())

  return new Response(JSON.stringify({ ok: true, items: allItems.slice(0, 30) }), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  })
}

export const config = { runtime: 'nodejs' }
