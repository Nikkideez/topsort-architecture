import React, { useMemo } from 'react'
import { ReactFlow, Background, MiniMap, Controls } from '@xyflow/react'
import ServiceNode from './nodes/ServiceNode'
import DataStoreNode from './nodes/DataStoreNode'
import ExternalNode from './nodes/ExternalNode'
import ZoneNode from './nodes/ZoneNode'
import LabeledEdge from './edges/LabeledEdge'
import EditToolbar from './EditToolbar'
import NodePalette from './NodePalette'
import useEditMode from '../hooks/useEditMode'

const nodeTypes = { service: ServiceNode, datastore: DataStoreNode, external: ExternalNode, zone: ZoneNode }
const edgeTypes = { labeled: LabeledEdge }

export default function ConfigDiagram({
  config,
  height: heightOverride,
  showMiniMap = false,
  flowFilter,
}) {
  const { nodes: defaultNodes, edges: defaultEdges, meta } = config
  const storageKey = meta.storageKey || 'diagram-positions'
  const configName = meta.name || 'diagram'
  const height = heightOverride || meta.height || 600

  const {
    nodes, edges, editing,
    setNodes, setEdges,
    startEdit, cancelEdit, saveEdit, resetToDefault,
    onNodesChange, onEdgesChange, onConnect,
    addNode, deleteSelected,
    onNodeDoubleClick, updateNodeData, cancelNodeEdit,
    exportConfig,
  } = useEditMode(storageKey, defaultNodes, defaultEdges)

  // Inject _onDataChange callback into node data for inline editing
  const nodesWithCallbacks = useMemo(() =>
    nodes.map(n => n.data._editing
      ? { ...n, data: { ...n.data, _onDataChange: updateNodeData, _onCancel: cancelNodeEdit } }
      : n
    ),
  [nodes, updateNodeData, cancelNodeEdit])

  // Apply flow filter if provided (e.g. ArchitectureDiagram dimming)
  const [displayNodes, displayEdges] = useMemo(() => {
    if (!flowFilter) return [nodesWithCallbacks, edges]
    return flowFilter(nodesWithCallbacks, edges)
  }, [nodesWithCallbacks, edges, flowFilter])

  const hasSelection = useMemo(() =>
    nodes.some(n => n.selected) || edges.some(e => e.selected),
  [nodes, edges])

  return (
    <div style={{ height, borderRadius: 12, overflow: 'hidden', border: '1px solid var(--bdr)' }}>
      <ReactFlow
        nodes={displayNodes}
        edges={displayEdges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDoubleClick={onNodeDoubleClick}
        nodesDraggable={editing}
        edgesUpdatable={editing}
        nodesConnectable={editing}
        fitView
        colorMode="dark"
        proOptions={{ hideAttribution: true }}
        minZoom={0.3}
        maxZoom={2}
        className={editing ? 'editing' : ''}
        deleteKeyCode={editing ? 'Delete' : null}
        onDelete={editing ? () => deleteSelected() : undefined}
      >
        <Background color="#1f2335" gap={20} size={1} />
        {showMiniMap && (
          <MiniMap
            nodeStrokeColor={(n) => n.data?.borderColor || '#4f8ff7'}
            nodeColor={() => '#141620'}
            style={{ background: '#0c0f19', border: '1px solid #1f2335' }}
          />
        )}
        <Controls style={{ background: '#141620', border: '1px solid #1f2335', borderRadius: 8 }} />
        <EditToolbar
          editing={editing}
          onEdit={startEdit}
          onCancel={cancelEdit}
          onSave={saveEdit}
          onReset={resetToDefault}
          onExport={() => exportConfig(configName)}
          onDelete={deleteSelected}
          hasSelection={hasSelection}
        />
        {editing && <NodePalette onAddNode={addNode} />}
      </ReactFlow>
    </div>
  )
}
