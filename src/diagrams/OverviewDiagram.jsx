import React from 'react'
import { ReactFlow, Background, Controls } from '@xyflow/react'
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
  { id: 'zone-mkt', type: 'zone', position: { x: -15, y: -15 }, data: { label: 'Customer Marketplace', color: '#34d399' }, style: { width: 370, height: 460 }, draggable: false, selectable: false, zIndex: -1 },
  { id: 'zone-infra', type: 'zone', position: { x: 355, y: -15 }, data: { label: 'Infrastructure', color: '#fbbf24' }, style: { width: 170, height: 390 }, draggable: false, selectable: false, zIndex: -1 },
  { id: 'zone-ts', type: 'zone', position: { x: 535, y: -15 }, data: { label: 'Topsort', color: '#4f8ff7' }, style: { width: 370, height: 430 }, draggable: false, selectable: false, zIndex: -1 },
]

const INITIAL_NODES = [
  { id: 'frontend', type: 'service', position: { x: 10, y: 15 }, data: { label: 'Frontend', subtitle: 'React / Next.js', borderColor: '#34d399' } },
  { id: 'apigw', type: 'service', position: { x: 10, y: 95 }, data: { label: 'API Gateway', subtitle: 'Auth / Rate Limit', borderColor: '#34d399' } },
  { id: 'search-svc', type: 'service', position: { x: 10, y: 175 }, data: { label: 'Search Service', subtitle: 'Organic + Merge', borderColor: '#34d399' } },
  { id: 'ts-client', type: 'service', position: { x: 194.6801392411303, y: 44.489602927241194 }, data: { label: 'Topsort Client', subtitle: 'Circuit Breaker', borderColor: '#34d399' } },
  { id: 'catalog-svc', type: 'service', position: { x: 10, y: 255 }, data: { label: 'Catalog Service', borderColor: '#34d399' } },
  { id: 'event-relay', type: 'service', position: { x: 199.8591232519541, y: 121.38221252074695 }, data: { label: 'Event Relay', subtitle: 'Batch + Retry', borderColor: '#34d399' } },
  { id: 'catalog-sync', type: 'service', position: { x: 10, y: 345 }, data: { label: 'Catalog Sync', borderColor: '#22d3ee' } },
  { id: 'es', type: 'datastore', position: { x: 374.14318720865907, y: 181.46997934936786 }, data: { label: 'ES', subtitle: 'Search Index' } },
  { id: 'postgres', type: 'datastore', position: { x: 374.143187208659, y: 250.07621452555568 }, data: { label: 'PostgreSQL', subtitle: 'Products/Orders' } },
  { id: 'kafka', type: 'datastore', position: { x: 374.143187208659, y: 309.3221712194828 }, data: { label: 'Kafka', subtitle: 'Event Bus' } },
  { id: 'auctions-api', type: 'external', position: { x: 560, y: 60 }, data: { label: 'Auctions API', subtitle: 'POST /v2/auctions' } },
  { id: 'events-api', type: 'external', position: { x: 561.0357968021648, y: 136.1766735502107 }, data: { label: 'Events API', subtitle: 'POST /v2/events' } },
  { id: 'catalog-api', type: 'external', position: { x: 560, y: 340 }, data: { label: 'Catalog API', subtitle: 'PUT /public/v1/...', borderColor: '#34d399' } },
  { id: 'auction-engine', type: 'external', position: { x: 720, y: 100 }, data: { label: 'Auction Engine', subtitle: 'eCPM Ranking', borderColor: '#1a3060' } },
  { id: 'attribution', type: 'external', position: { x: 720, y: 200 }, data: { label: 'Attribution', subtitle: 'Click/View-thru', borderColor: '#1a3060' } },
  { id: 'billing', type: 'external', position: { x: 720, y: 295 }, data: { label: 'Billing', subtitle: 'CPC / CPM / CPA', borderColor: '#1a3060' } },
]

const DEFAULT_EDGES = [
  { id: 'e-fe-apigw', source: 'frontend', target: 'apigw', sourceHandle: 'bottom', targetHandle: 'top', type: 'labeled', data: { color: '#5c6178' } },
  { id: 'e-apigw-search', source: 'apigw', target: 'search-svc', sourceHandle: 'bottom', targetHandle: 'top', type: 'labeled', data: { color: '#5c6178' } },
  { id: 'e-search-tsclient', source: 'search-svc', target: 'ts-client', sourceHandle: 'right', targetHandle: 'left', type: 'labeled', data: { label: 'parallel', color: '#4f8ff7' } },
  { id: 'e-search-es', source: 'search-svc', target: 'es', sourceHandle: 'right', targetHandle: 'left', type: 'labeled', data: { label: 'query', color: '#4f8ff7' } },
  { id: 'e-cat-pg', source: 'catalog-svc', target: 'postgres', sourceHandle: 'right', targetHandle: 'left', type: 'labeled', data: { label: 'write', color: '#5c6178' } },
  { id: 'e-cat-kafka', source: 'catalog-svc', target: 'kafka', sourceHandle: 'right', targetHandle: 'left', type: 'labeled', data: { label: 'publish', color: '#fbbf24', dashed: true } },
  { id: 'e-kafka-sync', source: 'kafka', target: 'catalog-sync', sourceHandle: 'left', targetHandle: 'right', type: 'labeled', data: { label: 'consume', color: '#22d3ee', dashed: true } },
  { id: 'e-tsclient-auctions', source: 'ts-client', target: 'auctions-api', sourceHandle: 'right', targetHandle: 'left', type: 'labeled', data: { label: 'Auctions', color: '#4f8ff7' } },
  { id: 'e-relay-events', source: 'event-relay', target: 'events-api', sourceHandle: 'right', targetHandle: 'left', type: 'labeled', data: { label: 'Events', color: '#fbbf24' } },
  { id: 'e-sync-catalog', source: 'catalog-sync', target: 'catalog-api', sourceHandle: 'right', targetHandle: 'left', type: 'labeled', data: { label: 'Catalog Sync', color: '#34d399' } },
  { id: 'e-auctions-engine', source: 'auctions-api', target: 'auction-engine', sourceHandle: 'right', targetHandle: 'left', type: 'labeled', data: { color: '#4f8ff7', dashed: true } },
  { id: 'e-events-attr', source: 'events-api', target: 'attribution', sourceHandle: 'right', targetHandle: 'left', type: 'labeled', data: { color: '#fbbf24', dashed: true } },
  { id: 'e-attr-billing', source: 'attribution', target: 'billing', sourceHandle: 'bottom', targetHandle: 'top', type: 'labeled', data: { color: '#fb7185', dashed: true } },
]


const STORAGE_KEY = 'overview-diagram-positions'
const ALL_DEFAULT_NODES = [...ZONE_NODES, ...INITIAL_NODES]

export default function OverviewDiagram() {
  const {
    nodes, edges, editing, selectedEdge,
    startEdit, cancelEdit, saveEdit, resetToDefault,
    onNodesChange, onEdgeClick, onPaneClick, onReconnect,
    edgeCurvature, setEdgeCurvature,
    selectedEdgeData, setEdgeHandle,
    exportLayout,
  } = useEditMode(STORAGE_KEY, ALL_DEFAULT_NODES, DEFAULT_EDGES)

  return (
    <div style={{ height: 600, borderRadius: 12, overflow: 'hidden', border: '1px solid var(--bdr)' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
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
        <Controls style={{ background: '#141620', border: '1px solid #1f2335', borderRadius: 8 }} />
        <EditToolbar editing={editing} onEdit={startEdit} onCancel={cancelEdit} onSave={saveEdit} onReset={resetToDefault} onExport={exportLayout} />
        <CurvatureSlider edgeId={selectedEdge} value={edgeCurvature} onChange={setEdgeCurvature} onClose={() => onEdgeClick(null, { id: selectedEdge })} edgeData={selectedEdgeData} onHandleChange={setEdgeHandle} />
      </ReactFlow>
    </div>
  )
}
