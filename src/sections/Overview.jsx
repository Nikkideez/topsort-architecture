import React from 'react'
import OverviewDiagram from '../diagrams/OverviewDiagram'

const topHtml = `
  <div class="sh">
    <h2>System Overview</h2>
    <p class="sd">Topsort is a retail media infrastructure provider. Customers integrate it as an external service into their marketplace via 3 API boundaries.</p>
  </div>

  <div class="g4">
    <div class="c num-card"><div class="big" style="color:var(--green)">3</div><div class="lbl">API Integration Points<br>(Catalog, Auctions, Events)</div></div>
    <div class="c num-card"><div class="big" style="color:var(--blue)">2</div><div class="lbl">API Key Types<br>(Marketplace + Advanced)</div></div>
    <div class="c num-card"><div class="big" style="color:var(--amber)">10K</div><div class="lbl">req/sec Rate Limit<br>(Auctions & Events, prod)</div></div>
    <div class="c num-card"><div class="big" style="color:var(--rose)">&lt;100ms</div><div class="lbl">Auction Latency Target<br>(Hard timeout on customer side)</div></div>
  </div>
`

const bottomHtml = `
  <div class="fw">
    <div class="c">
      <h3>End-to-End Lifecycle</h3>
      <div class="flow">
        <div class="fs" style="border-left:3px solid var(--green)"><span class="n">PHASE 1</span><span class="t">Catalog Sync</span><span class="d">Push products, vendors, categories</span><span class="tech">PUT /public/v1/.../products</span></div>
        <div class="fa">&rarr;</div>
        <div class="fs"><span class="n">PHASE 2</span><span class="t">User Searches</span><span class="d">Organic ES query</span><span class="tech">Customer Search Service</span></div>
        <div class="fa">&rarr;</div>
        <div class="fs" style="border-left:3px solid var(--blue)"><span class="n">PHASE 3</span><span class="t">Auction</span><span class="d">Get sponsored products</span><span class="tech">POST /v2/auctions</span></div>
        <div class="fa">&rarr;</div>
        <div class="fs" style="border-left:3px solid var(--purple)"><span class="n">PHASE 4</span><span class="t">Merge</span><span class="d">Organic + Sponsored</span><span class="tech">Merge Service</span></div>
        <div class="fa">&rarr;</div>
        <div class="fs" style="border-left:3px solid var(--amber)"><span class="n">PHASE 5</span><span class="t">Events</span><span class="d">Impressions, clicks, purchases</span><span class="tech">POST /v2/events</span></div>
        <div class="fa">&rarr;</div>
        <div class="fs" style="border-left:3px solid var(--rose)"><span class="n">PHASE 6</span><span class="t">Attribution</span><span class="d">Match events &rarr; billing</span><span class="tech">Topsort Internal</span></div>
      </div>
    </div>
  </div>

  <div class="g2">
    <div class="c c-green">
      <h3><span class="own own-mp">Customer Marketplace</span></h3>
      <ul>
        <li>Frontend (React/Next.js) &mdash; search, product pages, checkout</li>
        <li>API Gateway &mdash; routing, rate limiting, OAuth 2.0</li>
        <li>Search Service &mdash; Elasticsearch organic results</li>
        <li><strong>Catalog Service</strong> &mdash; existing product CRUD, writes to PostgreSQL, publishes events to Kafka</li>
        <li><strong>Catalog Sync Service</strong> &mdash; <em>new</em>, consumes from Kafka, transforms schema, PUTs to Topsort</li>
        <li>Topsort Integration Service &mdash; auction calls, circuit breaker</li>
        <li>Event Relay Service &mdash; server-side event delivery</li>
        <li>Order Service &mdash; checkout, payment, purchase events</li>
        <li>PostgreSQL, Elasticsearch, Redis, Kafka</li>
      </ul>
    </div>
    <div class="c c-blue">
      <h3><span class="own own-ts">Topsort (External)</span></h3>
      <ul>
        <li><strong>Catalog API</strong> &mdash; receives products, vendors, categories</li>
        <li><strong>Auctions API</strong> &mdash; real-time ad auctions (listings, banners, brands)</li>
        <li><strong>Events API</strong> &mdash; impressions, clicks, purchases, pageviews</li>
        <li>Attribution Engine &mdash; matches conversions to ad interactions</li>
        <li>Billing Engine &mdash; charges advertisers (CPC/CPM/CPA)</li>
        <li>Campaign API, Reporting API, Toppie DSP</li>
        <li>Toptimize &mdash; AI forecasting, CTR/CVR predictions</li>
      </ul>
    </div>
  </div>

  <div class="callout co-blue">
    <strong>Key Architectural Insight:</strong> The marketplace owns its entire stack and integrates with Topsort as an external service. The 3 API boundaries (Catalog, Auctions, Events) are where all integration complexity lives.
  </div>
`

export default function OverviewSection() {
  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: topHtml }} />
      <div className="fw">
        <div className="c" style={{ padding: 12 }}>
          <OverviewDiagram />
        </div>
      </div>
      <div dangerouslySetInnerHTML={{ __html: bottomHtml }} />
    </div>
  )
}
