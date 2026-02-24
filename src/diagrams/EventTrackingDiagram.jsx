import React from 'react'
import { ReactFlow, Background, Controls } from '@xyflow/react'
import ServiceNode from '../components/nodes/ServiceNode'
import ExternalNode from '../components/nodes/ExternalNode'
import LabeledEdge from '../components/edges/LabeledEdge'
import EditToolbar from '../components/EditToolbar'
import CurvatureSlider from '../components/CurvatureSlider'
import useEditMode from '../hooks/useEditMode'

const nodeTypes = { service: ServiceNode, external: ExternalNode }
const edgeTypes = { labeled: LabeledEdge }

const INITIAL_NODES = [
  { id: 'browser', type: 'service', position: { x: 0, y: 0 }, data: { label: 'Browser', subtitle: 'shopper device', borderColor: '#fb7185' } },
  { id: 'jssdk', type: 'service', position: { x: 240, y: 0 }, data: { label: 'Topsort JS SDK', subtitle: 'impressions & clicks', borderColor: '#fb7185' } },
  { id: 'event-proxy', type: 'service', position: { x: 202.34422619056653, y: 103.44849064622623 }, data: { label: 'Customer API Gateway', subtitle: 'Option B — key injected server-side', borderColor: '#fb923c' } },
  { id: 'order-svc', type: 'service', position: { x: 0, y: 180 }, data: { label: 'Order Service', subtitle: 'server-side', borderColor: '#4f8ff7' } },
  { id: 'event-relay', type: 'service', position: { x: 240, y: 180 }, data: { label: 'Event Relay', subtitle: 'purchases & conversions', borderColor: '#4f8ff7' } },
  { id: 'events-api', type: 'external', position: { x: 634.1841758273894, y: 105.88674490290452 }, data: { label: 'Topsort Events API', subtitle: 'POST /v2/events', borderColor: '#a78bfa' } },
]

const DEFAULT_EDGES = [
  { id: 'e1', source: 'browser', target: 'jssdk', sourceHandle: 'right', targetHandle: 'left', type: 'labeled', data: { label: 'resolvedBidId', color: '#fb7185' } },
  { id: 'e-optA', source: 'jssdk', target: 'events-api', sourceHandle: 'right', targetHandle: 'left', type: 'labeled', data: { label: 'Option A: direct (scoped key)', color: '#fb7185' } },
  { id: 'e-optB1', source: 'jssdk', target: 'event-proxy', sourceHandle: 'bottom', targetHandle: 'top', type: 'labeled', data: { label: 'Option B', color: '#fb923c', dashed: true } },
  { id: 'e-optB2', source: 'event-proxy', target: 'events-api', sourceHandle: 'right', targetHandle: 'left', type: 'labeled', data: { label: 'key injected', color: '#fb923c', dashed: true } },
  { id: 'e2', source: 'order-svc', target: 'event-relay', sourceHandle: 'right', targetHandle: 'left', type: 'labeled', data: { label: 'server-side', color: '#4f8ff7' } },
  { id: 'e4', source: 'event-relay', target: 'events-api', sourceHandle: 'right', targetHandle: 'left', type: 'labeled', data: { color: '#4f8ff7' } },
]


const STORAGE_KEY = 'event-tracking-diagram-positions'

export default function EventTrackingDiagram() {
  const {
    nodes, edges, editing, selectedEdge,
    startEdit, cancelEdit, saveEdit, resetToDefault,
    onNodesChange, onEdgeClick, onPaneClick, onReconnect,
    edgeCurvature, setEdgeCurvature,
    selectedEdgeData, setEdgeHandle,
    exportLayout,
  } = useEditMode(STORAGE_KEY, INITIAL_NODES, DEFAULT_EDGES)

  return (
    <div style={{ height: 350, borderRadius: 12, overflow: 'hidden', border: '1px solid var(--bdr)', margin: '16px 0' }}>
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
