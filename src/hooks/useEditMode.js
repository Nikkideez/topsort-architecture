import { useState, useCallback, useMemo, useRef } from 'react'
import { applyNodeChanges } from '@xyflow/react'

function loadSaved(storageKey) {
  try {
    const s = localStorage.getItem(storageKey)
    if (!s) return null
    const parsed = JSON.parse(s)
    // Migrate old format: { nodeId: {x,y} } → { nodes: {...}, curvatures: {} }
    if (parsed && !parsed.nodes && !parsed.curvatures) {
      return { nodes: parsed, curvatures: {}, handles: {}, zones: {} }
    }
    return parsed
  } catch { return null }
}

function saveToDisk(storageKey, nodes, curvatures, handles) {
  const positions = {}
  const zones = {}
  nodes.forEach(n => {
    if (n.type === 'zone') {
      zones[n.id] = {
        position: n.position,
        width: n.measured?.width || n.style?.width,
        height: n.measured?.height || n.style?.height,
      }
    } else {
      positions[n.id] = n.position
    }
  })
  localStorage.setItem(storageKey, JSON.stringify({ nodes: positions, zones, curvatures, handles }))
}

function applyOverrides(defaultNodes, defaultEdges, saved) {
  const positions = saved?.nodes || null
  const zones = saved?.zones || {}
  const curvatures = saved?.curvatures || {}
  const handles = saved?.handles || {}

  const nodes = defaultNodes.map(n => {
    if (n.type === 'zone' && zones[n.id]) {
      const z = zones[n.id]
      return { ...n, position: z.position, style: { ...n.style, width: z.width, height: z.height } }
    }
    if (positions && positions[n.id] && n.type !== 'zone') {
      return { ...n, position: positions[n.id] }
    }
    return n
  })

  const edges = defaultEdges.map(e => {
    let updated = e
    if (curvatures[e.id] !== undefined) {
      updated = { ...updated, data: { ...updated.data, curvature: curvatures[e.id] } }
    }
    if (handles[e.id]) {
      const h = handles[e.id]
      updated = {
        ...updated,
        source: h.source || updated.source,
        target: h.target || updated.target,
        sourceHandle: h.sourceHandle !== undefined ? h.sourceHandle : updated.sourceHandle,
        targetHandle: h.targetHandle !== undefined ? h.targetHandle : updated.targetHandle,
      }
    }
    return updated
  })

  return { nodes, edges }
}

export default function useEditMode(storageKey, defaultNodes, defaultEdges) {
  const saved = useMemo(() => loadSaved(storageKey), [storageKey])
  const initial = useMemo(() => applyOverrides(defaultNodes, defaultEdges, saved), [defaultNodes, defaultEdges, saved])

  const [nodes, setNodes] = useState(initial.nodes)
  const [edges, setEdges] = useState(initial.edges)
  const [editing, setEditing] = useState(false)
  const [selectedEdge, setSelectedEdge] = useState(null)

  // Snapshot for cancel
  const snapshot = useRef(null)

  // In edit mode, make zones draggable/selectable and pass editing flag
  const displayNodes = useMemo(() => {
    return nodes.map(n => {
      if (n.type !== 'zone') return n
      if (editing) {
        return { ...n, draggable: true, selectable: true, data: { ...n.data, editing: true } }
      }
      return { ...n, draggable: false, selectable: false }
    })
  }, [nodes, editing])

  // Build curvatures map from current edges
  const getCurvatures = useCallback((edgeList) => {
    const c = {}
    edgeList.forEach(e => {
      if (e.data?.curvature !== undefined) c[e.id] = e.data.curvature
    })
    return c
  }, [])

  // Build handles map from current edges
  const getHandles = useCallback((edgeList) => {
    const h = {}
    edgeList.forEach(e => {
      if (e.sourceHandle || e.targetHandle) {
        h[e.id] = {
          source: e.source,
          target: e.target,
          sourceHandle: e.sourceHandle || null,
          targetHandle: e.targetHandle || null,
        }
      }
    })
    return h
  }, [])

  const startEdit = useCallback(() => {
    snapshot.current = {
      nodes: nodes.map(n => ({ ...n, data: { ...n.data }, style: n.style ? { ...n.style } : undefined })),
      edges: edges.map(e => ({ ...e, data: { ...e.data } })),
    }
    setEditing(true)
    setSelectedEdge(null)
  }, [nodes, edges])

  const cancelEdit = useCallback(() => {
    if (snapshot.current) {
      setNodes(snapshot.current.nodes)
      setEdges(snapshot.current.edges)
    }
    snapshot.current = null
    setEditing(false)
    setSelectedEdge(null)
  }, [])

  const saveEdit = useCallback(() => {
    saveToDisk(storageKey, nodes, getCurvatures(edges), getHandles(edges))
    snapshot.current = null
    setEditing(false)
    setSelectedEdge(null)
  }, [storageKey, nodes, edges, getCurvatures, getHandles])

  const resetToDefault = useCallback(() => {
    localStorage.removeItem(storageKey)
    setNodes(defaultNodes)
    setEdges(defaultEdges)
    snapshot.current = {
      nodes: defaultNodes.map(n => ({ ...n, data: { ...n.data }, style: n.style ? { ...n.style } : undefined })),
      edges: defaultEdges.map(e => ({ ...e, data: { ...e.data } })),
    }
    setSelectedEdge(null)
  }, [storageKey, defaultNodes, defaultEdges])

  const onNodesChange = useCallback((changes) => {
    if (!editing) {
      // In view mode, only allow non-position, non-resize changes (like selection)
      const filtered = changes.filter(c => c.type !== 'position' && c.type !== 'dimensions')
      if (filtered.length > 0) setNodes(nds => applyNodeChanges(filtered, nds))
      return
    }
    setNodes(nds => {
      let updated = applyNodeChanges(changes, nds)
      // Keep zone style in sync with resized dimensions
      changes.forEach(c => {
        if (c.type === 'dimensions' && c.dimensions) {
          updated = updated.map(n =>
            n.id === c.id && n.type === 'zone'
              ? { ...n, style: { ...n.style, width: c.dimensions.width, height: c.dimensions.height } }
              : n
          )
        }
      })
      return updated
    })
  }, [editing])

  const onEdgeClick = useCallback((event, edge) => {
    if (!editing) return
    setSelectedEdge(prev => prev === edge.id ? null : edge.id)
  }, [editing])

  const onReconnect = useCallback((oldEdge, newConnection) => {
    if (!editing) return
    setEdges(prev => prev.map(e =>
      e.id === oldEdge.id
        ? {
            ...e,
            source: newConnection.source,
            target: newConnection.target,
            sourceHandle: newConnection.sourceHandle,
            targetHandle: newConnection.targetHandle,
          }
        : e
    ))
  }, [editing])

  const edgeCurvature = useMemo(() => {
    if (!selectedEdge) return 0.25
    const e = edges.find(e => e.id === selectedEdge)
    return e?.data?.curvature ?? 0.25
  }, [selectedEdge, edges])

  const setEdgeCurvature = useCallback((value) => {
    if (!selectedEdge) return
    setEdges(prev => prev.map(e =>
      e.id === selectedEdge
        ? { ...e, data: { ...e.data, curvature: value } }
        : e
    ))
  }, [selectedEdge])

  const selectedEdgeData = useMemo(() => {
    if (!selectedEdge) return null
    return edges.find(e => e.id === selectedEdge) || null
  }, [selectedEdge, edges])

  const setEdgeHandle = useCallback((field, value) => {
    if (!selectedEdge) return
    setEdges(prev => prev.map(e =>
      e.id === selectedEdge
        ? { ...e, [field]: value }
        : e
    ))
  }, [selectedEdge])

  const onPaneClick = useCallback(() => {
    setSelectedEdge(null)
  }, [])

  const exportLayout = useCallback(() => {
    const cleanZones = nodes
      .filter(n => n.type === 'zone')
      .map(n => {
        const { measured, dragging, selected, ...rest } = n
        const width = measured?.width || rest.style?.width
        const height = measured?.height || rest.style?.height
        return { ...rest, style: { width, height } }
      })
    const cleanNodes = nodes
      .filter(n => n.type !== 'zone')
      .map(n => {
        const { measured, dragging, selected, ...rest } = n
        return rest
      })
    const cleanEdges = edges.map(e => {
      const { selected, ...rest } = e
      return rest
    })

    const toJS = (obj, indent = 2) => {
      const pad = ' '.repeat(indent)
      const pad2 = ' '.repeat(indent + 2)
      if (Array.isArray(obj)) {
        if (obj.length === 0) return '[]'
        return '[\n' + obj.map(item => pad + toJS(item, indent)).join(',\n') + ',\n' + ' '.repeat(indent - 2) + ']'
      }
      if (obj && typeof obj === 'object') {
        const entries = Object.entries(obj).filter(([, v]) => v !== undefined)
        const inner = entries.map(([k, v]) => {
          const key = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k) ? k : `'${k}'`
          return `${pad2}${key}: ${toJS(v, indent + 2)}`
        }).join(', ')
        return `{ ${inner} }`
      }
      if (typeof obj === 'string') return `'${obj.replace(/'/g, "\\'")}'`
      return String(obj)
    }

    let output = ''
    if (cleanZones.length > 0) {
      output += 'const ZONE_NODES = ' + toJS(cleanZones) + '\n\n'
    }
    output += 'const INITIAL_NODES = ' + toJS(cleanNodes) + '\n'
    output += '\nconst DEFAULT_EDGES = ' + toJS(cleanEdges) + '\n'

    navigator.clipboard.writeText(output)
    return output
  }, [nodes, edges])

  return {
    nodes: displayNodes, edges, editing, selectedEdge,
    startEdit, cancelEdit, saveEdit, resetToDefault,
    onNodesChange, onEdgeClick, onPaneClick, onReconnect,
    edgeCurvature, setEdgeCurvature,
    selectedEdgeData, setEdgeHandle,
    exportLayout,
    setNodes, setEdges,
  }
}
