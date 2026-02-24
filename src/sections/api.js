export const api = `
<section id="api" class="sec vis">
  <h2 class="sh">API Reference — Accurate from Topsort Docs</h2>

  <!-- Authentication Card -->
  <div class="g2">
    <div class="c c-blue">
      <h3>Authentication</h3>
      <p>All requests require a <span class="code">Bearer</span> token in the <span class="code">Authorization</span> header. Topsort issues two distinct API key types:</p>
      <table class="tbl">
        <thead>
          <tr>
            <th>Key Type</th>
            <th>Scope</th>
            <th>Endpoints</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Marketplace API Key</strong></td>
            <td>Core auction &amp; event tracking</td>
            <td><span class="code">POST /v2/auctions</span>, <span class="code">POST /v2/events</span></td>
          </tr>
          <tr>
            <td><strong>Advanced API Key</strong></td>
            <td>Catalog, Campaign, Billing &amp; Reporting management</td>
            <td>Catalog API, Campaign API, Billing API, Reporting API</td>
          </tr>
        </tbody>
      </table>
      <div class="callout co-blue">
        <strong>Note:</strong> Marketplace keys cannot access Advanced endpoints and vice versa. Generate both from the Topsort dashboard under <em>Settings → API Keys</em>.
      </div>
    </div>
  </div>

  <!-- Rate Limits -->
  <h3 class="sh">Rate Limits</h3>
  <div class="c">
    <table class="tbl">
      <thead>
        <tr>
          <th>API Group</th>
          <th>Production</th>
          <th>Sandbox (Default)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Auctions &amp; Events</strong></td>
          <td><span class="code">10,000 req/sec</span></td>
          <td><span class="code">10,000 req/sec</span></td>
        </tr>
        <tr>
          <td><strong>Catalog API</strong></td>
          <td><span class="code">10 req/sec</span></td>
          <td><span class="code">4 req/sec</span></td>
        </tr>
        <tr>
          <td><strong>Other Advanced APIs</strong></td>
          <td><span class="code">45 req/2sec</span></td>
          <td><span class="code">5 req/2sec</span></td>
        </tr>
      </tbody>
    </table>
    <div class="callout co-blue">
      <strong>429 Too Many Requests:</strong> If you exceed these limits the API responds with HTTP 429. Implement exponential back-off and respect the <span class="code">Retry-After</span> header.
    </div>
  </div>

  <!-- All Endpoints Table -->
  <h3 class="sh">All Endpoints</h3>
  <div class="c">
    <table class="tbl">
      <thead>
        <tr>
          <th>Method</th>
          <th>Endpoint</th>
          <th>Key</th>
          <th>Limits / Notes</th>
        </tr>
      </thead>
      <tbody>
        <!-- Marketplace Endpoints -->
        <tr>
          <td><span class="code">POST</span></td>
          <td><span class="code">/v2/auctions</span></td>
          <td>Marketplace</td>
          <td>1–5 auctions per request, 1–40 slots each</td>
        </tr>
        <tr>
          <td><span class="code">POST</span></td>
          <td><span class="code">/v2/events</span></td>
          <td>Marketplace</td>
          <td>Up to 50 events per event type per request</td>
        </tr>
        <!-- Catalog Endpoints -->
        <tr>
          <td><span class="code">PUT</span></td>
          <td><span class="code">/public/v1/.../catalogs/products</span></td>
          <td>Advanced</td>
          <td>Up to 500 products per batch</td>
        </tr>
        <tr>
          <td><span class="code">PUT</span></td>
          <td><span class="code">/public/v1/.../catalogs/vendors</span></td>
          <td>Advanced</td>
          <td>Up to 500 vendors per batch</td>
        </tr>
        <tr>
          <td><span class="code">PUT</span></td>
          <td><span class="code">/public/v1/.../catalogs/categories</span></td>
          <td>Advanced</td>
          <td>Up to 500 categories per batch</td>
        </tr>
        <!-- Campaign Endpoints -->
        <tr>
          <td><span class="code">POST</span></td>
          <td><span class="code">/public/v1/.../campaigns</span></td>
          <td>Advanced</td>
          <td>Create a new campaign</td>
        </tr>
        <tr>
          <td><span class="code">GET</span></td>
          <td><span class="code">/public/v1/.../campaigns</span></td>
          <td>Advanced</td>
          <td>List campaigns with pagination</td>
        </tr>
        <tr>
          <td><span class="code">PATCH</span></td>
          <td><span class="code">/public/v1/.../campaigns/{id}</span></td>
          <td>Advanced</td>
          <td>Update campaign budget, status, or targeting</td>
        </tr>
        <!-- Billing Endpoints -->
        <tr>
          <td><span class="code">GET</span></td>
          <td><span class="code">/public/v1/.../billing/invoices</span></td>
          <td>Advanced</td>
          <td>Retrieve invoices for a vendor</td>
        </tr>
        <tr>
          <td><span class="code">GET</span></td>
          <td><span class="code">/public/v1/.../billing/balance</span></td>
          <td>Advanced</td>
          <td>Current balance and credit info</td>
        </tr>
        <!-- Reporting Endpoints -->
        <tr>
          <td><span class="code">GET</span></td>
          <td><span class="code">/public/v1/.../reporting/campaigns</span></td>
          <td>Advanced</td>
          <td>Campaign performance metrics</td>
        </tr>
        <tr>
          <td><span class="code">GET</span></td>
          <td><span class="code">/public/v1/.../reporting/products</span></td>
          <td>Advanced</td>
          <td>Per-product spend &amp; attribution data</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Auction Types & Event Types -->
  <div class="g2">
    <!-- Auction Types -->
    <div class="c c-amber">
      <h3>Auction Types</h3>
      <p>The <span class="code">type</span> field in each auction object controls placement format:</p>
      <table class="tbl">
        <thead>
          <tr>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><span class="code">listings</span></td>
            <td>Sponsored product listings in search results or category pages. The most common auction type.</td>
          </tr>
          <tr>
            <td><span class="code">banners</span></td>
            <td>Display banner placements — hero images, sidebar ads, and interstitial creatives.</td>
          </tr>
          <tr>
            <td><span class="code">sponsored-brand</span></td>
            <td>Brand-level placements that highlight a vendor or store rather than individual products.</td>
          </tr>
          <tr>
            <td><span class="code">travel</span></td>
            <td>Travel-specific auction format for accommodations, flights, and experience placements.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Event Types -->
    <div class="c c-blue">
      <h3>Event Types</h3>
      <p>Events are reported via <span class="code">POST /v2/events</span> to track user interactions:</p>
      <table class="tbl">
        <thead>
          <tr>
            <th>Event</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><span class="code">impressions</span></td>
            <td>Fired when a promoted item becomes visible in the viewport. Required for billing on CPM campaigns.</td>
          </tr>
          <tr>
            <td><span class="code">clicks</span></td>
            <td>Fired on user tap/click of a promoted item. Primary billing event for CPC campaigns.</td>
          </tr>
          <tr>
            <td><span class="code">purchases</span></td>
            <td>Fired on successful checkout. Used for ROAS attribution and conversion tracking.</td>
          </tr>
          <tr>
            <td><span class="code">pageviews</span></td>
            <td>Fired on product detail page (PDP) visits. Supports view-through attribution models.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Error Codes Grid -->
  <h3 class="sh">Error Codes</h3>
  <div class="g3">
    <div class="c c-blue">
      <h4>2xx — Success</h4>
      <table class="tbl">
        <tbody>
          <tr><td><span class="code">200</span></td><td>OK — Request succeeded</td></tr>
          <tr><td><span class="code">201</span></td><td>Created — Resource created</td></tr>
          <tr><td><span class="code">204</span></td><td>No Content — Deleted successfully</td></tr>
        </tbody>
      </table>
    </div>
    <div class="c c-amber">
      <h4>4xx — Client Errors</h4>
      <table class="tbl">
        <tbody>
          <tr><td><span class="code">400</span></td><td>Bad Request — Malformed payload or missing fields</td></tr>
          <tr><td><span class="code">401</span></td><td>Unauthorized — Invalid or missing API key</td></tr>
          <tr><td><span class="code">403</span></td><td>Forbidden — Key lacks required scope</td></tr>
          <tr><td><span class="code">404</span></td><td>Not Found — Resource does not exist</td></tr>
          <tr><td><span class="code">409</span></td><td>Conflict — Duplicate or version mismatch</td></tr>
          <tr><td><span class="code">422</span></td><td>Unprocessable — Validation error on fields</td></tr>
          <tr><td><span class="code">429</span></td><td>Too Many Requests — Rate limit exceeded</td></tr>
        </tbody>
      </table>
    </div>
    <div class="c c-rose">
      <h4>5xx — Server Errors</h4>
      <table class="tbl">
        <tbody>
          <tr><td><span class="code">500</span></td><td>Internal Server Error — Unexpected failure</td></tr>
          <tr><td><span class="code">502</span></td><td>Bad Gateway — Upstream service unavailable</td></tr>
          <tr><td><span class="code">503</span></td><td>Service Unavailable — Maintenance or overload</td></tr>
          <tr><td><span class="code">504</span></td><td>Gateway Timeout — Upstream did not respond</td></tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- API Boundaries SVG Diagram -->
  <h3 class="sh">API Boundaries</h3>
  <div class="diagram-wrap">
    <svg viewBox="0 0 900 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:900px;">
      <rect width="900" height="200" rx="12" fill="#0c0f19"/>

      <!-- Marketplace Boundary -->
      <rect x="30" y="30" width="240" height="140" rx="8" fill="none" stroke="#4f8ff7" stroke-width="2" stroke-dasharray="6 3"/>
      <text x="150" y="58" text-anchor="middle" fill="#4f8ff7" font-size="13" font-weight="bold">Marketplace</text>
      <rect x="55" y="72" width="190" height="30" rx="5" fill="#4f8ff720" stroke="#4f8ff7" stroke-width="1"/>
      <text x="150" y="92" text-anchor="middle" fill="#fff" font-size="11">POST /v2/auctions</text>
      <rect x="55" y="112" width="190" height="30" rx="5" fill="#4f8ff720" stroke="#4f8ff7" stroke-width="1"/>
      <text x="150" y="132" text-anchor="middle" fill="#fff" font-size="11">POST /v2/events</text>

      <!-- Arrows from Marketplace to Topsort -->
      <line x1="270" y1="87" x2="360" y2="87" stroke="#4f8ff7" stroke-width="2" marker-end="url(#arrowBlue)"/>
      <line x1="270" y1="127" x2="360" y2="127" stroke="#4f8ff7" stroke-width="2" marker-end="url(#arrowBlue)"/>

      <!-- Topsort Core -->
      <rect x="360" y="30" width="180" height="140" rx="8" fill="none" stroke="#34d399" stroke-width="2"/>
      <text x="450" y="58" text-anchor="middle" fill="#34d399" font-size="13" font-weight="bold">Topsort Core</text>
      <rect x="380" y="72" width="140" height="30" rx="5" fill="#34d39920" stroke="#34d399" stroke-width="1"/>
      <text x="450" y="92" text-anchor="middle" fill="#fff" font-size="11">Auction Engine</text>
      <rect x="380" y="112" width="140" height="30" rx="5" fill="#34d39920" stroke="#34d399" stroke-width="1"/>
      <text x="450" y="132" text-anchor="middle" fill="#fff" font-size="11">Event Pipeline</text>

      <!-- Arrows from Topsort to Advanced -->
      <line x1="540" y1="87" x2="630" y2="87" stroke="#fbbf24" stroke-width="2" marker-end="url(#arrowAmber)"/>
      <line x1="540" y1="127" x2="630" y2="127" stroke="#fbbf24" stroke-width="2" marker-end="url(#arrowAmber)"/>

      <!-- Advanced Boundary -->
      <rect x="630" y="30" width="240" height="140" rx="8" fill="none" stroke="#fbbf24" stroke-width="2" stroke-dasharray="6 3"/>
      <text x="750" y="58" text-anchor="middle" fill="#fbbf24" font-size="13" font-weight="bold">Advanced APIs</text>
      <rect x="655" y="72" width="190" height="26" rx="5" fill="#fbbf2420" stroke="#fbbf24" stroke-width="1"/>
      <text x="750" y="90" text-anchor="middle" fill="#fff" font-size="10">Catalog &amp; Campaign</text>
      <rect x="655" y="108" width="190" height="26" rx="5" fill="#fbbf2420" stroke="#fbbf24" stroke-width="1"/>
      <text x="750" y="126" text-anchor="middle" fill="#fff" font-size="10">Billing &amp; Reporting</text>
      <rect x="655" y="144" width="190" height="20" rx="5" fill="#fbbf2420" stroke="#fbbf24" stroke-width="1"/>
      <text x="750" y="158" text-anchor="middle" fill="#fff" font-size="9">Advanced API Key Required</text>

      <!-- Arrow Markers -->
      <defs>
        <marker id="arrowBlue" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#4f8ff7"/>
        </marker>
        <marker id="arrowAmber" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#fbbf24"/>
        </marker>
      </defs>
    </svg>
  </div>

</section>
`;
