export default {
  meta: { name: "search-auction", storageKey: "search-auction-diagram-positions", height: 300 },
  zones: [],
  nodes: [
    { id: "search", type: "service", position: { x: 0, y: 80 }, data: { label: "Search Service", subtitle: "fan-out", borderColor: "#4f8ff7" } },
    { id: "es", type: "service", position: { x: 250, y: 0 }, data: { label: "Elasticsearch", subtitle: "organic results (~40ms)", borderColor: "#4f8ff7" } },
    { id: "topsort", type: "external", position: { x: 250, y: 160 }, data: { label: "Topsort Auction", subtitle: "POST /v2/auctions (~15ms p99)", borderColor: "#34d399" } },
    { id: "merge", type: "service", position: { x: 500, y: 80 }, data: { label: "Merge", subtitle: "rank & interleave", borderColor: "#fbbf24" } },
    { id: "response", type: "service", position: { x: 680, y: 80 }, data: { label: "API Response", subtitle: "to frontend", borderColor: "#fbbf24" } },
  ],
  edges: [
    { id: "e1", source: "search", target: "es", sourceHandle: "right", targetHandle: "left", data: { label: "parallel", color: "#4f8ff7" } },
    { id: "e2", source: "search", target: "topsort", sourceHandle: "right", targetHandle: "left", data: { label: "parallel", color: "#34d399" } },
    { id: "e3", source: "es", target: "merge", sourceHandle: "right", targetHandle: "left", data: { color: "#4f8ff7" } },
    { id: "e4", source: "topsort", target: "merge", sourceHandle: "right", targetHandle: "left", data: { color: "#34d399" } },
    { id: "e5", source: "merge", target: "response", sourceHandle: "right", targetHandle: "left", data: { color: "#fbbf24" } },
  ],
}
