import React, { useState, useMemo } from 'react'
import { ReactFlow, Background, MiniMap, Controls } from '@xyflow/react'
import ServiceNode from '../components/nodes/ServiceNode'
import DataStoreNode from '../components/nodes/DataStoreNode'
import ExternalNode from '../components/nodes/ExternalNode'
import ZoneNode from '../components/nodes/ZoneNode'
import LabeledEdge from '../components/edges/LabeledEdge'
import EditToolbar from '../components/EditToolbar'
import CurvatureSlider from '../components/CurvatureSlider'
import useEditMode from '../hooks/useEditMode'

const nodeTypes = { service: ServiceNode, datastore: DataStoreNode, external: ExternalNode, zone: ZoneNode }
const edgeTypes = { labeled: LabeledEdge }

const ZONE_NODES = [
  {     id: 'zone-client',     type: 'zone',     position: {       x: 0,       y: 0 },     data: {       label: 'Client Layer',       color: '#34d399' },     style: {       width: 680,       height: 100 },     draggable: false,     selectable: false,     zIndex: -1 },
  {     id: 'zone-backend',     type: 'zone',     position: {       x: 0,       y: 120 },     data: {       label: 'Your Marketplace Backend',       color: '#a78bfa' },     style: {       width: 510,       height: 400 },     draggable: false,     selectable: false,     zIndex: -1 },
  {     id: 'zone-topsort',     type: 'zone',     position: {       x: 525,       y: 120 },     data: {       label: 'Topsort (External)',       color: '#4f8ff7' },     style: {       width: 400,       height: 400 },     draggable: false,     selectable: false,     zIndex: -1 },
  {     id: 'zone-data',     type: 'zone',     position: {       x: 0,       y: 540 },     data: {       label: 'Data Layer',       color: '#fbbf24' },     style: {       width: 509,       height: 173 },     draggable: false,     selectable: false,     zIndex: -1,     width: 509,     height: 173,     resizing: false },
  {     id: 'zone-ts-internal',     type: 'zone',     position: {       x: 525,       y: 540 },     data: {       label: 'Topsort Internal',       color: '#4f8ff7' },     style: {       width: 402,       height: 174 },     draggable: false,     selectable: false,     zIndex: -1,     width: 402,     height: 174,     resizing: false },
  {     id: 'zone-reporting',     type: 'zone',     position: {       x: -0.051379342345114765,       y: 727.5691587404573 },     data: {       label: 'Your Reporting',       color: '#a78bfa' },     style: {       width: 510,       height: 100 },     draggable: false,     selectable: false,     zIndex: -1 },
  {     id: 'zone-ts-outputs',     type: 'zone',     position: {       x: 523.3169602452241,       y: 725.1473577929837 },     data: {       label: 'Topsort Outputs',       color: '#4f8ff7' },     style: {       width: 402,       height: 100 },     draggable: false,     selectable: false,     zIndex: -1,     width: 402,     height: 100,     resizing: false },
]

const INITIAL_NODES = [
  {     id: 'user',     type: 'service',     position: {       x: 21.34220284379427,       y: 31.904471089782866 },     data: {       label: 'User',       subtitle: 'Browser / App',       borderColor: '#34d399',       flows: [
      'search',
      'catalog',
      'events',
      'purchase',
    ] } },
  {     id: 'frontend',     type: 'service',     position: {       x: 203.78778625583993,       y: 32.44558341204573 },     data: {       label: 'Frontend',       subtitle: 'React / Next.js',       borderColor: '#34d399',       flows: [
      'search',
      'events',
      'purchase',
    ] } },
  {     id: 'jssdk',     type: 'external',     position: {       x: 517.559255821335,       y: 34.955614769250026 },     data: {       label: 'Topsort JS SDK',       subtitle: 'analytics.js',       dashed: true,       flows: [
      'events',
    ] } },
  {     id: 'apigw',     type: 'service',     position: {       x: 180.01915995485317,       y: 169.07725826768373 },     data: {       label: 'API Gateway',       subtitle: 'OAuth / Rate Limit',       borderColor: '#a78bfa',       flows: [
      'search',
      'purchase',
      'events',
    ] } },
  {     id: 'search',     type: 'service',     position: {       x: 6.936088424846872,       y: 233.19358955292392 },     data: {       label: 'Search Service',       subtitle: 'Organic + Merge + Banners',       borderColor: '#a78bfa',       flows: [
      'search',
    ] } },
  {     id: 'tsclient',     type: 'service',     position: {       x: 193.90754816490596,       y: 305.39063124417436 },     data: {       label: 'Topsort Client',       subtitle: '100ms timeout / CB',       borderColor: '#4f8ff7',       flows: [
      'search',
    ] } },
  {     id: 'order',     type: 'service',     position: {       x: 355.98880683078045,       y: 151.74713892478616 },     data: {       label: 'Order Service',       subtitle: 'Checkout',       borderColor: '#a78bfa',       flows: [
      'purchase',
    ] } },
  {     id: 'catalog-svc',     type: 'service',     position: {       x: 8.364213749450968,       y: 351.78505927481365 },     data: {       label: 'Catalog Service',       subtitle: 'EXISTING — product CRUD',       borderColor: '#34d399',       flows: [
      'catalog',
    ] } },
  {     id: 'event-relay',     type: 'service',     position: {       x: 350.0282868117643,       y: 356.51472156502155 },     data: {       label: 'Event Relay',       subtitle: 'Batch / Retry / DLQ',       borderColor: '#fbbf24',       flows: [
      'events',
      'purchase',
    ] } },
  {     id: 'catalog-sync',     type: 'service',     position: {       x: 365.8562242744255,       y: 441.01257646436505 },     data: {       label: 'Catalog Sync',       badge: 'NEW — for Topsort',       subtitle: 'transform + batch',       borderColor: '#22d3ee',       flows: [
      'catalog',
    ] } },
  {     id: 'ts-apigw',     type: 'external',     position: {       x: 711.9040944254951,       y: 181.02721928690966 },     data: {       label: 'Topsort API GW',       subtitle: 'Auth / Routing',       flows: [
      'search',
      'catalog',
      'events',
      'purchase',
    ] } },
  {     id: 'auctions-api',     type: 'external',     position: {       x: 696.8041326622996,       y: 358.6614965055675 },     data: {       label: 'Auctions API',       subtitle: 'listings + banners',       flows: [
      'search',
    ] } },
  {     id: 'catalog-api',     type: 'external',     position: {       x: 783.260120531498,       y: 455.1913125310671 },     data: {       label: 'Catalog API',       subtitle: 'PUT /public/v1/...',       borderColor: '#34d399',       flows: [
      'catalog',
    ] } },
  {     id: 'events-api',     type: 'external',     position: {       x: 592.4325364662998,       y: 283.4428396164465 },     data: {       label: 'Events API',       subtitle: 'POST /v2/events',       borderColor: '#fbbf24',       flows: [
      'events',
      'purchase',
    ] } },
  {     id: 'postgres',     type: 'datastore',     position: {       x: 22.01052079021396,       y: 611.215676199386 },     data: {       label: 'PostgreSQL',       subtitle: 'Products/Orders',       flows: [
      'search',
      'catalog',
      'purchase',
    ] } },
  {     id: 'es',     type: 'datastore',     position: {       x: 142.55077407006928,       y: 565.757396911996 },     data: {       label: 'Elasticsearch',       subtitle: 'Search Index',       flows: [
      'search',
    ] } },
  {     id: 'redis',     type: 'datastore',     position: {       x: 142.5850986878202,       y: 653.5605629017283 },     data: {       label: 'Redis',       subtitle: 'Cache',       flows: [
      'search',
    ] } },
  {     id: 'kafka',     type: 'datastore',     position: {       x: 287.40752679295736,       y: 610.0918443580941 },     data: {       label: 'Kafka',       subtitle: 'Event Bus',       flows: [
      'catalog',
    ] } },
  {     id: 'auction-engine',     type: 'external',     position: {       x: 698.0514115092795,       y: 647.001196579704 },     data: {       label: 'Auction Engine',       subtitle: 'eCPM / 2nd Price',       borderColor: '#1a3060',       flows: [
      'search',
    ] } },
  {     id: 'attribution',     type: 'external',     position: {       x: 552.8946117226894,       y: 566.6713339178436 },     data: {       label: 'Attribution',       subtitle: 'Click/View-thru',       borderColor: '#1a3060',       flows: [
      'events',
      'purchase',
    ] } },
  {     id: 'billing',     type: 'external',     position: {       x: 548.3566695892187,       y: 649.2623453157964 },     data: {       label: 'Billing',       subtitle: 'CPC / CPM / CPA',       borderColor: '#1a3060',       flows: [
      'purchase',
    ] } },
  {     id: 'product-index',     type: 'external',     position: {       x: 782.3902622538702,       y: 578.9015544051224 },     data: {       label: 'Product Index',       subtitle: 'Topsort\'s catalog',       borderColor: '#1a3060',       flows: [
      'catalog',
    ] } },
  {     id: 'admin-dash',     type: 'service',     position: {       x: 25.978958419572095,       y: 759.7061178071854 },     data: {       label: 'Admin Dashboard',       subtitle: 'Revenue / Performance',       borderColor: '#a78bfa',       flows: [
      'purchase',
    ] } },
  {     id: 'reporting-api',     type: 'external',     position: {       x: 542.2062102330848,       y: 758.9551321894561 },     data: {       label: 'Reporting API',       subtitle: 'GET /v2/reports',       flows: [
      'purchase',
    ] } },
  {     id: 'toppie',     type: 'external',     position: {       x: 704.0794831524446,       y: 757.9166330649045 },     data: {       label: 'Toppie (DSP)',       subtitle: 'Advertiser Portal' } },
]

const DEFAULT_EDGES = [
  {     id: 'e-user-frontend',     source: 'user',     target: 'frontend',     sourceHandle: 'right',     targetHandle: 'left',     type: 'labeled',     data: {       label: '1',       color: '#4f8ff7',       flows: [
      'search',
    ] } },
  {     id: 'e-frontend-apigw',     source: 'frontend',     target: 'apigw',     sourceHandle: 'bottom',     targetHandle: 'top',     type: 'labeled',     data: {       label: '2',       color: '#4f8ff7',       flows: [
      'search',
    ],       curvature: 0.15 } },
  {     id: 'e-apigw-search',     source: 'apigw',     target: 'search',     sourceHandle: 'bottom',     targetHandle: 'right',     type: 'labeled',     data: {       label: '3a route',       color: '#4f8ff7',       flows: [
      'search',
    ] } },
  {     id: 'e-search-tsclient',     source: 'search',     target: 'tsclient',     sourceHandle: 'right',     targetHandle: 'top',     type: 'labeled',     data: {       label: '3b parallel',       color: '#4f8ff7',       flows: [
      'search',
    ] } },
  {     id: 'e-tsclient-tsapigw',     source: 'tsclient',     target: 'ts-apigw',     sourceHandle: 'right',     targetHandle: 'left',     type: 'labeled',     data: {       label: '4 POST /v2/auctions',       color: '#4f8ff7',       flows: [
      'search',
    ] } },
  {     id: 'e-tsapigw-tsclient',     source: 'ts-apigw',     target: 'tsclient',     sourceHandle: 'left',     targetHandle: 'right',     type: 'labeled',     data: {       label: '5 winners[]',       color: '#4f8ff7',       dashed: true,       flows: [
      'search',
    ],       curvature: 0.4 } },
  {     id: 'e-tsapigw-auctions',     source: 'ts-apigw',     target: 'auctions-api',     sourceHandle: 'bottom',     targetHandle: 'top',     type: 'labeled',     data: {       label: 'route',       color: '#4f8ff7',       dashed: true,       flows: [
      'search',
    ] } },
  {     id: 'e-auctions-engine',     source: 'auctions-api',     target: 'auction-engine',     sourceHandle: 'bottom',     targetHandle: 'top',     type: 'labeled',     data: {       color: '#4f8ff7',       dashed: true,       flows: [
      'search',
    ] } },
  {     id: 'e-search-es',     source: 'search',     target: 'es',     sourceHandle: 'bottom',     targetHandle: 'top',     type: 'labeled',     data: {       label: '3c ES query',       color: '#4f8ff7',       flows: [
      'search',
    ] } },
  {     id: 'e-search-frontend',     source: 'search',     target: 'frontend',     sourceHandle: 'top',     targetHandle: 'bottom',     type: 'labeled',     data: {       label: '6 merged',       color: '#4f8ff7',       dashed: true,       flows: [
      'search',
    ],       curvature: 0.5 } },
  {     id: 'e-cat-pg',     source: 'catalog-svc',     target: 'postgres',     sourceHandle: 'bottom',     targetHandle: 'top',     type: 'labeled',     data: {       label: 'A write',       color: '#34d399',       flows: [
      'catalog',
    ] } },
  {     id: 'e-cat-kafka',     source: 'catalog-svc',     target: 'kafka',     sourceHandle: 'right',     targetHandle: 'top',     type: 'labeled',     data: {       label: 'B publish product.updated',       color: '#34d399',       dashed: true,       flows: [
      'catalog',
    ] } },
  {     id: 'e-kafka-sync',     source: 'kafka',     target: 'catalog-sync',     targetHandle: 'bottom',     sourceHandle: 'right',     type: 'labeled',     data: {       label: 'C consume',       color: '#22d3ee',       flows: [
      'catalog',
    ],       curvature: 0.4 } },
  {     id: 'e-sync-catapi',     source: 'catalog-sync',     target: 'catalog-api',     sourceHandle: 'right',     targetHandle: 'left',     type: 'labeled',     data: {       label: 'D PUT /public/v1/.../products',       color: '#22d3ee',       flows: [
      'catalog',
    ] } },
  {     id: 'e-catapi-prodidx',     source: 'catalog-api',     target: 'product-index',     sourceHandle: 'bottom',     targetHandle: 'top',     type: 'labeled',     data: {       label: 'index',       color: '#34d399',       dashed: true,       flows: [
      'catalog',
    ] } },
  {     id: 'e-frontend-jssdk',     source: 'frontend',     target: 'jssdk',     sourceHandle: 'right',     targetHandle: 'left',     type: 'labeled',     data: {       label: 'resolvedBidId',       color: '#fbbf24',       flows: [
      'events',
    ] } },
  {     id: 'e-jssdk-eventsapi',     source: 'jssdk',     target: 'events-api',     sourceHandle: 'bottom',     targetHandle: 'top',     type: 'labeled',     data: {       label: 'A: direct (scoped key)',       color: '#fbbf24',       flows: [
      'events',
    ] } },
  {     id: 'e-jssdk-apigw',     source: 'jssdk',     target: 'apigw',     sourceHandle: 'bottom',     targetHandle: 'top',     type: 'labeled',     data: {       label: 'B: via proxy',       color: '#fb923c',       dashed: true,       flows: [
      'events',
    ] } },
  {     id: 'e-relay-eventsapi',     source: 'event-relay',     target: 'events-api',     sourceHandle: 'right',     targetHandle: 'left',     type: 'labeled',     data: {       label: 'Server: POST /v2/events',       color: '#fbbf24',       flows: [
      'events',
      'purchase',
    ] } },
  {     id: 'e-frontend-apigw-purchase',     source: 'frontend',     target: 'apigw',     sourceHandle: 'bottom',     targetHandle: 'top',     type: 'labeled',     data: {       label: 'POST /checkout',       color: '#fb7185',       flows: [
      'purchase',
    ],       curvature: 0.4 } },
  {     id: 'e-apigw-order',     source: 'apigw',     target: 'order',     sourceHandle: 'right',     targetHandle: 'left',     type: 'labeled',     data: {       label: 'route',       color: '#fb7185',       flows: [
      'purchase',
    ] } },
  {     id: 'e-order-relay',     source: 'order',     target: 'event-relay',     sourceHandle: 'bottom',     targetHandle: 'top',     type: 'labeled',     data: {       label: 'purchase event',       color: '#fb7185',       flows: [
      'purchase',
    ] } },
  {     id: 'e-order-pg',     source: 'order',     target: 'postgres',     sourceHandle: 'bottom',     targetHandle: 'top',     type: 'labeled',     data: {       label: 'write order',       color: '#fb7185',       flows: [
      'purchase',
    ],       curvature: 0.3 } },
  {     id: 'e-eventsapi-attr',     source: 'events-api',     target: 'attribution',     sourceHandle: 'bottom',     targetHandle: 'top',     type: 'labeled',     data: {       label: 'match',       color: '#fb7185',       flows: [
      'purchase',
    ] } },
  {     id: 'e-attr-billing',     source: 'attribution',     target: 'billing',     sourceHandle: 'bottom',     targetHandle: 'top',     type: 'labeled',     data: {       label: 'charge',       color: '#fb7185',       flows: [
      'purchase',
    ] } },
  {     id: 'e-reportapi-dash',     source: 'reporting-api',     target: 'admin-dash',     sourceHandle: 'left',     targetHandle: 'right',     type: 'labeled',     data: {       label: 'GET /v2/reports (periodic)',       color: '#a78bfa',       dashed: true,       flows: [
      'purchase',
    ] } },
]


const FLOW_DESCS = {
  all: 'All Flows: Complete architecture showing every component. Click a specific flow to isolate a request path.',
  search: 'Search + Auction: User searches → Frontend → API GW → Search Service (parallel: Topsort Client + ES query) → POST /v2/auctions → winners[] returned → listings merged with organic, banners routed to dedicated placements.',
  catalog: 'Catalog Sync: Catalog Service (existing) writes to PostgreSQL and publishes product.updated to Kafka. Catalog Sync (new) consumes, transforms, and PUTs to Topsort Catalog API.',
  events: 'Events: Frontend passes resolvedBidId to JS SDK. <strong>Option A:</strong> SDK calls POST /v2/events directly with scoped Marketplace key. <strong>Option B:</strong> SDK proxies through your API Gateway which injects the key server-side. Server path: Event Relay batches purchases and sends.',
  purchase: 'Purchase: POST /checkout → Order Service → purchase event → Event Relay → Events API → Attribution → Billing → Reports to dashboard.',
}

const STORAGE_KEY = 'arch-diagram-positions'

const ALL_DEFAULT_NODES = [...ZONE_NODES, ...INITIAL_NODES]

export default function ArchitectureDiagram() {
  const [activeFlow, setActiveFlow] = useState('all')

  const {
    nodes, edges, editing, selectedEdge,
    startEdit, cancelEdit, saveEdit, resetToDefault,
    onNodesChange, onEdgeClick, onPaneClick, onReconnect,
    edgeCurvature, setEdgeCurvature,
    selectedEdgeData, setEdgeHandle,
    exportLayout,
  } = useEditMode(STORAGE_KEY, ALL_DEFAULT_NODES, DEFAULT_EDGES)

  const filteredNodes = useMemo(() =>
    nodes.map(n => {
      if (n.type === 'zone') return n
      if (activeFlow === 'all') return { ...n, data: { ...n.data, dimmed: false } }
      const flows = n.data.flows || []
      return { ...n, data: { ...n.data, dimmed: flows.length > 0 && !flows.includes(activeFlow) } }
    }),
    [nodes, activeFlow])

  const filteredEdges = useMemo(() =>
    edges.map(e => {
      if (activeFlow === 'all') return { ...e, data: { ...e.data, dimmed: false } }
      const flows = e.data.flows || []
      return { ...e, data: { ...e.data, dimmed: !flows.includes(activeFlow) } }
    }),
    [edges, activeFlow])

  return (
    <div>
      <div className="flow-nav">
        {Object.keys(FLOW_DESCS).map(flow => (
          <button
            key={flow}
            className={`flow-btn${activeFlow === flow ? ' active' : ''}`}
            data-flow={flow}
            onClick={() => setActiveFlow(flow)}
          >
            {flow === 'all' ? 'Show All' : flow === 'search' ? 'Search + Auction' : flow === 'catalog' ? 'Catalog Sync' : flow === 'events' ? 'Impressions & Clicks' : 'Purchase & Attribution'}
          </button>
        ))}
      </div>
      <div className="flow-desc" dangerouslySetInnerHTML={{ __html: FLOW_DESCS[activeFlow] }} />
      <div style={{ height: 870, borderRadius: 12, overflow: 'hidden', border: '1px solid var(--bdr)' }}>
        <ReactFlow
          nodes={filteredNodes}
          edges={filteredEdges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodesChange={onNodesChange}
          onEdgeClick={onEdgeClick}
          onPaneClick={onPaneClick}
          onReconnect={onReconnect}
          nodesDraggable={editing}
          edgesReconnectable={editing}
          fitView
          colorMode="dark"
          proOptions={{ hideAttribution: true }}
          minZoom={0.3}
          maxZoom={2}
          className={editing ? 'editing' : ''}
        >
          <Background color="#1f2335" gap={20} size={1} />
          <MiniMap
            nodeStrokeColor={(n) => n.data?.borderColor || '#4f8ff7'}
            nodeColor={() => '#141620'}
            style={{ background: '#0c0f19', border: '1px solid #1f2335' }}
          />
          <Controls style={{ background: '#141620', border: '1px solid #1f2335', borderRadius: 8 }} />
          <EditToolbar editing={editing} onEdit={startEdit} onCancel={cancelEdit} onSave={saveEdit} onReset={resetToDefault} onExport={exportLayout} />
          <CurvatureSlider edgeId={selectedEdge} value={edgeCurvature} onChange={setEdgeCurvature} onClose={() => onEdgeClick(null, { id: selectedEdge })} edgeData={selectedEdgeData} onHandleChange={setEdgeHandle} />
        </ReactFlow>
      </div>
      <div className="legend">
        <div className="legend-item"><div className="legend-line" style={{ background: '#4f8ff7' }}></div> Search + Auction</div>
        <div className="legend-item"><div className="legend-line" style={{ background: '#34d399' }}></div> Catalog Service (existing)</div>
        <div className="legend-item"><div className="legend-line" style={{ background: '#22d3ee' }}></div> Catalog Sync (new)</div>
        <div className="legend-item"><div className="legend-line" style={{ background: '#fbbf24' }}></div> Event Tracking</div>
        <div className="legend-item"><div className="legend-line" style={{ background: '#fb7185' }}></div> Purchase + Attribution</div>
        <div className="legend-item"><div className="legend-dash" style={{ borderColor: '#6a7090' }}></div> Response path</div>
      </div>
    </div>
  )
}
