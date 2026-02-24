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
  { id: 'search', type: 'service', position: { x: 0, y: 80 }, data: { label: 'Search Service', subtitle: 'fan-out', borderColor: '#4f8ff7' } },
  { id: 'es', type: 'service', position: { x: 250, y: 0 }, data: { label: 'Elasticsearch', subtitle: 'organic results (~40ms)', borderColor: '#4f8ff7' } },
  { id: 'topsort', type: 'external', position: { x: 250, y: 160 }, data: { label: 'Topsort Auction', subtitle: 'listings + banners (~15ms p99)', borderColor: '#34d399' } },
  { id: 'merge', type: 'service', position: { x: 500, y: 80 }, data: { label: 'Merge + Route', subtitle: 'listings → interleave / banners → slots', borderColor: '#fbbf24' } },
  { id: 'response', type: 'service', position: { x: 789.0227298960373, y: 80 }, data: { label: 'API Response', subtitle: 'to frontend', borderColor: '#fbbf24' } },
]

const DEFAULT_EDGES = [
  { id: 'e1', source: 'search', target: 'es', sourceHandle: 'right', targetHandle: 'left', type: 'labeled', data: { label: 'parallel', color: '#4f8ff7' } },
  { id: 'e2', source: 'search', target: 'topsort', sourceHandle: 'right', targetHandle: 'left', type: 'labeled', data: { label: 'parallel', color: '#34d399' } },
  { id: 'e3', source: 'es', target: 'merge', sourceHandle: 'right', targetHandle: 'left', type: 'labeled', data: { color: '#4f8ff7' } },
  { id: 'e4', source: 'topsort', target: 'merge', sourceHandle: 'right', targetHandle: 'left', type: 'labeled', data: { label: 'winners[]', color: '#34d399' } },
  { id: 'e5', source: 'merge', target: 'response', sourceHandle: 'right', targetHandle: 'left', type: 'labeled', data: { color: '#fbbf24' } },
]

const STORAGE_KEY = 'search-auction-diagram-positions'

export default function SearchAuctionDiagram() {
  const {
    nodes, edges, editing, selectedEdge,
    startEdit, cancelEdit, saveEdit, resetToDefault,
    onNodesChange, onEdgeClick, onPaneClick, onReconnect,
    edgeCurvature, setEdgeCurvature,
    selectedEdgeData, setEdgeHandle,
    exportLayout,
  } = useEditMode(STORAGE_KEY, INITIAL_NODES, DEFAULT_EDGES)

  return (
    <div style={{ height: 300, borderRadius: 12, overflow: 'hidden', border: '1px solid var(--bdr)', margin: '16px 0' }}>
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
