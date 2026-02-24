/**
 * Transforms a JSON config into React Flow-ready arrays.
 * Zones get draggable:false, selectable:false, zIndex:-1.
 * All edges get type:'labeled'.
 */
export function loadConfig(json) {
  const zones = (json.zones || []).map(z => ({
    ...z,
    draggable: false,
    selectable: false,
    zIndex: -1,
  }))

  const nodes = [...zones, ...(json.nodes || [])]

  const edges = (json.edges || []).map(e => ({
    ...e,
    type: 'labeled',
  }))

  return {
    nodes,
    edges,
    meta: json.meta || {},
    flowDescriptions: json.flowDescriptions || null,
    flowLabels: json.flowLabels || null,
    legend: json.legend || null,
  }
}
