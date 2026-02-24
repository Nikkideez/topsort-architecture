import React from 'react'
import { ReactFlow, Background, Controls } from '@xyflow/react'
import ServiceNode from '../components/nodes/ServiceNode'
import DataStoreNode from '../components/nodes/DataStoreNode'
import ExternalNode from '../components/nodes/ExternalNode'
import LabeledEdge from '../components/edges/LabeledEdge'
import EditToolbar from '../components/EditToolbar'
import CurvatureSlider from '../components/CurvatureSlider'
import useEditMode from '../hooks/useEditMode'

const nodeTypes = { service: ServiceNode, datastore: DataStoreNode, external: ExternalNode }
const edgeTypes = { labeled: LabeledEdge }

const INITIAL_NODES = [
  { id: 'seller', type: 'service', position: { x: 0, y: 40 }, data: { label: 'Seller', subtitle: 'updates product', borderColor: '#fb7185' } },
  { id: 'catalog-svc', type: 'service', position: { x: 170, y: 40 }, data: { label: 'Catalog Service', subtitle: 'existing — product CRUD', borderColor: '#4f8ff7' } },
  { id: 'postgres', type: 'datastore', position: { x: 190.32457030402557, y: 140 }, data: { label: 'PostgreSQL', subtitle: 'products table' } },
  { id: 'kafka', type: 'datastore', position: { x: 381.29142794668087, y: 44.516571178672365 }, data: { label: 'Kafka', subtitle: 'catalog.updates topic' } },
  { id: 'catalog-sync', type: 'service', position: { x: 574.5003998573704, y: 40.91674630667033 }, data: { label: 'Catalog Sync Service', subtitle: 'transform + batch (max 500/req)', borderColor: '#34d399' } },
  { id: 'topsort-api', type: 'external', position: { x: 841.9302726138603, y: 41.1291427946681 }, data: { label: 'Topsort Catalog API', subtitle: '/public/v1/.../products', borderColor: '#a78bfa' } },
  { id: 'product-index', type: 'external', position: { x: 1034.3452868508107, y: 40.97543224780187 }, data: { label: 'Product Index', subtitle: 'for auctions', borderColor: '#a78bfa', dashed: true } },
]

const DEFAULT_EDGES = [
  { id: 'e1', source: 'seller', target: 'catalog-svc', sourceHandle: 'right', targetHandle: 'left', type: 'labeled', data: { color: '#fb7185' } },
  { id: 'e2', source: 'catalog-svc', target: 'postgres', sourceHandle: 'bottom', targetHandle: 'top', type: 'labeled', data: { label: 'write', color: '#4f8ff7' } },
  { id: 'e3', source: 'catalog-svc', target: 'kafka', sourceHandle: 'right', targetHandle: 'left', type: 'labeled', data: { label: 'publish', color: '#4f8ff7' } },
  { id: 'e4', source: 'kafka', target: 'catalog-sync', sourceHandle: 'right', targetHandle: 'left', type: 'labeled', data: { label: 'consume', color: '#fbbf24' } },
  { id: 'e5', source: 'catalog-sync', target: 'topsort-api', sourceHandle: 'right', targetHandle: 'left', type: 'labeled', data: { label: 'PUT', color: '#34d399' } },
  { id: 'e6', source: 'topsort-api', target: 'product-index', sourceHandle: 'right', targetHandle: 'left', type: 'labeled', data: { color: '#a78bfa', dashed: true } },
]


const STORAGE_KEY = 'catalog-sync-diagram-positions'

export default function CatalogSyncDiagram() {
  const {
    nodes, edges, editing, selectedEdge,
    startEdit, cancelEdit, saveEdit, resetToDefault,
    onNodesChange, onEdgeClick, onPaneClick, onReconnect,
    edgeCurvature, setEdgeCurvature,
    selectedEdgeData, setEdgeHandle,
    exportLayout,
  } = useEditMode(STORAGE_KEY, INITIAL_NODES, DEFAULT_EDGES)

  return (
    <div style={{ height: 320, borderRadius: 12, overflow: 'hidden', border: '1px solid var(--bdr)', margin: '16px 0' }}>
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
        <Controls position="top-right" style={{ background: '#141620', border: '1px solid #1f2335', borderRadius: 8 }} />
        <EditToolbar editing={editing} onEdit={startEdit} onCancel={cancelEdit} onSave={saveEdit} onReset={resetToDefault} onExport={exportLayout} />
        <CurvatureSlider edgeId={selectedEdge} value={edgeCurvature} onChange={setEdgeCurvature} onClose={() => onEdgeClick(null, { id: selectedEdge })} edgeData={selectedEdgeData} onHandleChange={setEdgeHandle} />
      </ReactFlow>
    </div>
  )
}
