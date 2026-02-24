import React from 'react'
import CatalogSyncDiagram from '../diagrams/CatalogSyncDiagram'
import SearchAuctionDiagram from '../diagrams/SearchAuctionDiagram'
import EventTrackingDiagram from '../diagrams/EventTrackingDiagram'

const chunk1 = `
  <div class="sh">
    <span class="badge" style="background:#4f8ff7;">Lifecycle</span>
    <h2>Integration Lifecycle &mdash; 6 Phases</h2>
    <p>End-to-end flow from catalog ingestion through attribution and billing.</p>
  </div>

  <h3><span class="badge" style="background:#a78bfa;">Phase 1</span> Catalog Sync</h3>
  <p>The marketplace pushes product data to Topsort's Catalog API. A dedicated Catalog Sync Service
     consumes <code>product.updated</code> events from Kafka, transforms schema, batches up to 500 products,
     and PUTs to Topsort using an Advanced API key.</p>

  <div class="c c-purple fw">
    <h3>Sync Pipeline</h3>
    <ol>
      <li><strong>Catalog Service &rarr; PostgreSQL</strong> &mdash; persists product change</li>
      <li><strong>Catalog Service &rarr; Kafka</strong> &mdash; publishes <code>product.updated</code> event</li>
      <li><strong>Catalog Sync Service</strong> &mdash; consumes, transforms, batches (max 500)</li>
      <li><strong>PUT to Topsort</strong> &mdash; <code>PUT /public/v1/catalog-search-service/catalogs/products</code></li>
    </ol>
  </div>
`

const chunk2 = `
  <pre class="code">
<span class="cm">// PUT – batch upsert (max 500/request, 10 req/sec rate limit)</span>
<span class="kw">PUT</span> <span class="str">https://api.topsort.com/public/v1/catalog-search-service/catalogs/products</span>
<span class="fn">Authorization</span>: Bearer <span class="hl">&lt;ADVANCED_API_KEY&gt;</span>
<span class="fn">Content-Type</span>: application/json

{
  <span class="fn">"products"</span>: [
    {
      <span class="fn">"id"</span>: <span class="str">"sku-00184"</span>,
      <span class="fn">"name"</span>: <span class="str">"Wireless Headphones Pro"</span>,
      <span class="fn">"categories"</span>: [<span class="str">"cat-electronics"</span>, <span class="str">"cat-audio"</span>],
      <span class="fn">"vendors"</span>: [<span class="str">"vendor-9281"</span>],
      <span class="fn">"price"</span>: <span class="num">79.99</span>,
      <span class="fn">"active"</span>: <span class="kw">true</span>,
      <span class="fn">"quality_score"</span>: <span class="num">0.85</span>
    }
  ]
}
  </pre>

  <h4>Schema Mapping</h4>
  <div class="tbl">
    <table>
      <thead>
        <tr><th>Source Column</th><th>Topsort Field</th><th>Type</th><th>Transform</th></tr>
      </thead>
      <tbody>
        <tr><td><code>product_id</code></td><td><code>id</code></td><td>string (required)</td><td>cast to string</td></tr>
        <tr><td><code>title</code></td><td><code>name</code></td><td>string (required)</td><td>trim, max 256 chars</td></tr>
        <tr><td><code>category_path</code></td><td><code>categories</code></td><td>string[]</td><td>split path into array of IDs</td></tr>
        <tr><td><code>seller_id</code></td><td><code>vendors</code></td><td>string[]</td><td>wrap in array</td></tr>
        <tr><td><code>price_cents</code></td><td><code>price</code></td><td>number &gt; 0</td><td><code>price / 100</code></td></tr>
        <tr><td><code>status</code></td><td><code>active</code></td><td>boolean</td><td><code>status === 'live'</code></td></tr>
        <tr><td><code>rating</code></td><td><code>quality_score</code></td><td>0 &lt; n &le; 1</td><td><code>rating / 5.0</code></td></tr>
      </tbody>
    </table>
  </div>

  <div class="g2">
    <div class="callout co-green">
      <strong>Idempotent:</strong> Product <code>id</code> is the natural key &mdash; re-sends overwrite safely.
    </div>
    <div class="callout co-rose">
      <strong>Throughput:</strong> 10 req/sec &times; 500 products/req = 5,000 products/sec.
    </div>
  </div>

  <div class="sep"></div>

  <h3><span class="badge" style="background:#4f8ff7;">Phase 2</span> User Search</h3>
  <p>Search Service fans out two parallel requests: Elasticsearch for organic results,
     Topsort Auction API for sponsored slots. Hard timeout at <code>200ms</code> on the Topsort call
     (p99 resolves in &lt;15ms).</p>

  <div class="sep"></div>

  <h3><span class="badge" style="background:#34d399;">Phase 3</span> Auction Call</h3>
  <p>Topsort returns winning sponsored products ranked by predicted relevance &times; bid.</p>
`

const chunk3 = `
  <div class="g2">
    <div class="c c-green">
      <h4>Request &mdash; POST /v2/auctions</h4>
      <pre class="code">
{
  <span class="fn">"auctions"</span>: [
    {
      <span class="fn">"type"</span>: <span class="str">"listings"</span>,
      <span class="fn">"slots"</span>: <span class="num">3</span>,
      <span class="fn">"category"</span>: {
        <span class="fn">"id"</span>: <span class="str">"cat-electronics-audio"</span>
      },
      <span class="fn">"searchQuery"</span>: <span class="str">"wireless headphones"</span>,
      <span class="fn">"geoTargeting"</span>: {
        <span class="fn">"country"</span>: <span class="str">"US"</span>
      }
    }
  ]
}
      </pre>
    </div>

    <div class="c c-blue">
      <h4>Response</h4>
      <pre class="code">
{
  <span class="fn">"results"</span>: [
    {
      <span class="fn">"winners"</span>: [
        {
          <span class="fn">"rank"</span>: <span class="num">1</span>,
          <span class="fn">"type"</span>: <span class="str">"listing"</span>,
          <span class="fn">"id"</span>: <span class="str">"sku-00184"</span>,
          <span class="fn">"resolvedBidId"</span>: <span class="str">"<span class="hl">bid_8f3a...</span>"</span>,
          <span class="fn">"assetUrl"</span>: <span class="str">""</span>
        }
      ],
      <span class="fn">"error"</span>: <span class="kw">false</span>
    }
  ]
}
      </pre>
    </div>
  </div>

  <div class="sep"></div>

  <h3><span class="badge" style="background:#fbbf24;color:#0c0f19;">Phase 4</span> Merge &amp; Render</h3>
  <p>Sponsored items are interleaved into organic results at configurable slot positions,
     deduplicating against organic. <code>resolvedBidId</code> is preserved on each merged item for event tracking.</p>

  <div class="algo">
    <h4>Merge Algorithm</h4>
    <pre class="code">
<span class="kw">function</span> <span class="fn">mergeResults</span>(organic, sponsored, slotPositions) {
  <span class="kw">const</span> merged = [...organic];
  <span class="kw">const</span> seen = <span class="kw">new</span> <span class="fn">Set</span>(organic.<span class="fn">map</span>(p =&gt; p.id));
  <span class="kw">let</span> slotIdx = <span class="num">0</span>;

  <span class="kw">for</span> (<span class="kw">const</span> winner <span class="kw">of</span> sponsored) {
    <span class="kw">if</span> (seen.<span class="fn">has</span>(winner.id)) {
      merged.<span class="fn">splice</span>(merged.<span class="fn">findIndex</span>(p =&gt; p.id === winner.id), <span class="num">1</span>);
    }
    <span class="kw">const</span> pos = slotPositions[slotIdx++] ?? merged.length;
    merged.<span class="fn">splice</span>(pos, <span class="num">0</span>, {
      ...winner,
      <span class="hl">isSponsored: true</span>,
      <span class="hl">resolvedBidId: winner.resolvedBidId</span>
    });
    seen.<span class="fn">add</span>(winner.id);
  }
  <span class="kw">return</span> merged;
}
    </pre>
  </div>

  <div class="sep"></div>

  <h3><span class="badge" style="background:#fb7185;">Phase 5</span> Event Tracking</h3>
  <p>Client-side JS SDK for real-time browser events (impressions, clicks);
     server-side Event Relay for transactional events (purchases).</p>
`

const chunk4 = `
  <div class="g3">
    <div class="c c-rose">
      <h4>Impression</h4>
      <pre class="code">
{
  <span class="fn">"impressions"</span>: [{
    <span class="fn">"resolvedBidId"</span>: <span class="str">"<span class="hl">bid_8f3a...</span>"</span>,
    <span class="fn">"entity"</span>: {
      <span class="fn">"type"</span>: <span class="str">"product"</span>,
      <span class="fn">"id"</span>:   <span class="str">"sku-00184"</span>
    },
    <span class="fn">"occurredAt"</span>: <span class="str">"2026-02-23T..."</span>
  }]
}
      </pre>
    </div>

    <div class="c c-amber">
      <h4>Click</h4>
      <pre class="code">
{
  <span class="fn">"clicks"</span>: [{
    <span class="fn">"resolvedBidId"</span>: <span class="str">"<span class="hl">bid_8f3a...</span>"</span>,
    <span class="fn">"entity"</span>: {
      <span class="fn">"type"</span>: <span class="str">"product"</span>,
      <span class="fn">"id"</span>:   <span class="str">"sku-00184"</span>
    },
    <span class="fn">"occurredAt"</span>: <span class="str">"2026-02-23T..."</span>
  }]
}
      </pre>
    </div>

    <div class="c c-green">
      <h4>Purchase</h4>
      <pre class="code">
{
  <span class="fn">"purchases"</span>: [{
    <span class="fn">"resolvedBidId"</span>: <span class="str">"<span class="hl">bid_8f3a...</span>"</span>,
    <span class="fn">"entity"</span>: {
      <span class="fn">"type"</span>: <span class="str">"product"</span>,
      <span class="fn">"id"</span>:   <span class="str">"sku-00184"</span>
    },
    <span class="fn">"amount"</span>: <span class="num">7999</span>,
    <span class="fn">"occurredAt"</span>: <span class="str">"2026-02-23T..."</span>
  }]
}
      </pre>
    </div>
  </div>

  <div class="sep"></div>

  <h3><span class="badge" style="background:#a78bfa;">Phase 6</span> Attribution &amp; Billing</h3>
  <p>Conversions attributed to originating auction within configurable time windows. Billing is CPC, CPM, or CPA depending on campaign type.</p>

  <div class="tbl">
    <table>
      <thead>
        <tr>
          <th>Event Type</th>
          <th>Attribution Window</th>
          <th>Match Key</th>
          <th>Billing Model</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Impression</td>
          <td>Immediate (real-time)</td>
          <td><code>resolvedBidId</code></td>
          <td>CPM (per 1 000)</td>
        </tr>
        <tr>
          <td>Click</td>
          <td>Immediate (real-time)</td>
          <td><code>resolvedBidId</code></td>
          <td>CPC</td>
        </tr>
        <tr>
          <td>Purchase &mdash; same session</td>
          <td>0 &ndash; 30 min</td>
          <td><code>resolvedBidId</code> + session</td>
          <td>CPA / ROAS</td>
        </tr>
        <tr>
          <td>Purchase &mdash; click-through</td>
          <td>0 &ndash; 24 h (default 7 d)</td>
          <td><code>resolvedBidId</code> + user</td>
          <td>CPA / ROAS</td>
        </tr>
        <tr>
          <td>Purchase &mdash; view-through</td>
          <td>0 &ndash; 24 h (default 1 d)</td>
          <td><code>resolvedBidId</code> + user</td>
          <td>CPA / ROAS</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="g2">
    <div class="callout co-amber">
      <strong>Deduplication:</strong> Last-click attribution &mdash; prevents double-billing.
    </div>
    <div class="callout co-green">
      <strong>Reconciliation:</strong> <code>GET /v2/billing/reports</code>, T+1 cadence.
    </div>
  </div>
`

const chunk5 = `
  <div class="sep"></div>

  <div class="sh">
    <span class="badge" style="background:#fb923c;">Banner Lifecycle</span>
    <h2>Banner Lifecycle &mdash; How Banners Differ from Listings</h2>
    <p>Banners are display ad placements &mdash; hero images, sidebar ads, category takeovers &mdash; that follow the same auction pipeline but differ in rendering, tracking, and merge behavior.</p>
  </div>

  <div class="tbl">
    <table>
      <thead>
        <tr>
          <th>Phase</th>
          <th>Listings (Sponsored Products)</th>
          <th>Banners (Display Ads)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>1 &mdash; Catalog Sync</strong></td>
          <td>Products pushed via Catalog API</td>
          <td>Same &mdash; banners bid on catalog products; creative assets uploaded separately</td>
        </tr>
        <tr>
          <td><strong>2 &mdash; User Search</strong></td>
          <td>Triggered by search query or category browse</td>
          <td>Triggered by page load (homepage hero, category sidebar)</td>
        </tr>
        <tr>
          <td><strong>3 &mdash; Auction Call</strong></td>
          <td><code>type: "listings"</code> &mdash; returns product IDs</td>
          <td><code>type: "banners"</code> &mdash; returns product IDs + <code>asset</code> (image URL)</td>
        </tr>
        <tr>
          <td><strong>4 &mdash; Merge &amp; Render</strong></td>
          <td>Interleaved into organic results at slot positions</td>
          <td>No merge &mdash; routed to dedicated placements (hero, sidebar, inline)</td>
        </tr>
        <tr>
          <td><strong>5 &mdash; Event Tracking</strong></td>
          <td>Impression when product card enters viewport</td>
          <td>Impression when &ge;50% pixels visible for &ge;1&thinsp;s (IAB standard)</td>
        </tr>
        <tr>
          <td><strong>6 &mdash; Attribution</strong></td>
          <td>CPC / CPA billing</td>
          <td>CPM billing (per 1,000 viewable impressions) + optional CPC</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="c c-blue fw">
    <h3>Batched Auction &mdash; Listings + Banners in One Call</h3>
    <p>Both auction types in a single <code>POST /v2/auctions</code> &mdash; resolved in parallel server-side.</p>

    <div class="g2">
      <div class="c c-green">
        <h4>Request &mdash; POST /v2/auctions</h4>
        <pre class="code">
{
  <span class="fn">"auctions"</span>: [
    {
      <span class="fn">"type"</span>: <span class="str">"listings"</span>,
      <span class="fn">"slots"</span>: <span class="num">3</span>,
      <span class="fn">"category"</span>: {
        <span class="fn">"id"</span>: <span class="str">"cat-electronics"</span>
      }
    },
    {
      <span class="fn">"type"</span>: <span class="str">"banners"</span>,
      <span class="fn">"slots"</span>: <span class="num">1</span>,
      <span class="fn">"category"</span>: {
        <span class="fn">"id"</span>: <span class="str">"cat-electronics"</span>
      },
      <span class="fn">"device"</span>: <span class="str">"desktop"</span>
    }
  ]
}
        </pre>
      </div>

      <div class="c c-amber">
        <h4>Response</h4>
        <pre class="code">
{
  <span class="fn">"results"</span>: [
    {
      <span class="fn">"winners"</span>: [
        {
          <span class="fn">"rank"</span>: <span class="num">1</span>,
          <span class="fn">"type"</span>: <span class="str">"listing"</span>,
          <span class="fn">"id"</span>: <span class="str">"sku-00184"</span>,
          <span class="fn">"resolvedBidId"</span>: <span class="str">"<span class="hl">bid_8f3a...</span>"</span>,
          <span class="fn">"assetUrl"</span>: <span class="str">""</span>
        }
      ],
      <span class="fn">"error"</span>: <span class="kw">false</span>
    },
    {
      <span class="fn">"winners"</span>: [
        {
          <span class="fn">"rank"</span>: <span class="num">1</span>,
          <span class="fn">"type"</span>: <span class="str">"banner"</span>,
          <span class="fn">"id"</span>: <span class="str">"sku-00221"</span>,
          <span class="fn">"resolvedBidId"</span>: <span class="str">"<span class="hl">bid_c7e2...</span>"</span>,
          <span class="fn">"asset"</span>: [{
            <span class="fn">"url"</span>: <span class="str">"https://cdn.topsort.com/banners/hero-221.webp"</span>
          }]
        }
      ],
      <span class="fn">"error"</span>: <span class="kw">false</span>
    }
  ]
}
        </pre>
      </div>
    </div>
  </div>

  <div class="g2">
    <div class="callout co-green">
      <strong>Banners:</strong> Routed to dedicated placements (hero, sidebar) &mdash; no merge needed.
    </div>
    <div class="callout co-amber">
      <strong>IAB viewability:</strong> &ge;50% pixels visible for &ge;1s before firing impression.
    </div>
  </div>
`

export default function LifecycleSection() {
  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: chunk1 }} />
      <CatalogSyncDiagram />
      <div dangerouslySetInnerHTML={{ __html: chunk2 }} />
      <SearchAuctionDiagram />
      <div dangerouslySetInnerHTML={{ __html: chunk3 }} />
      <EventTrackingDiagram />
      <div dangerouslySetInnerHTML={{ __html: chunk4 }} />
      <div dangerouslySetInnerHTML={{ __html: chunk5 }} />
    </div>
  )
}
