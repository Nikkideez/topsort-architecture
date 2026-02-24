export default {
  meta: { name: "catalog-sync", storageKey: "catalog-sync-diagram-positions", height: 320 },
  zones: [],
  nodes: [
    { id: "seller", type: "service", position: { x: 0, y: 40 }, data: { label: "Seller", subtitle: "updates product", borderColor: "#fb7185" } },
    { id: "catalog-svc", type: "service", position: { x: 170, y: 40 }, data: { label: "Catalog Service", subtitle: "existing \u2014 product CRUD", borderColor: "#4f8ff7" } },
    { id: "postgres", type: "datastore", position: { x: 170, y: 140 }, data: { label: "PostgreSQL", subtitle: "products table" } },
    { id: "kafka", type: "datastore", position: { x: 370, y: 40 }, data: { label: "Kafka", subtitle: "catalog.updates topic" } },
    { id: "catalog-sync", type: "service", position: { x: 530, y: 40 }, data: { label: "Catalog Sync Service", subtitle: "NEW \u2014 transform + batch (max 500/req)", borderColor: "#34d399" } },
    { id: "topsort-api", type: "external", position: { x: 740, y: 40 }, data: { label: "Topsort Catalog API", subtitle: "/public/v1/.../products", borderColor: "#a78bfa" } },
    { id: "product-index", type: "external", position: { x: 940, y: 40 }, data: { label: "Product Index", subtitle: "for auctions", borderColor: "#a78bfa", dashed: true } },
  ],
  edges: [
    { id: "e1", source: "seller", target: "catalog-svc", sourceHandle: "right", targetHandle: "left", data: { color: "#fb7185" } },
    { id: "e2", source: "catalog-svc", target: "postgres", data: { label: "write", color: "#4f8ff7" } },
    { id: "e3", source: "catalog-svc", target: "kafka", sourceHandle: "right", targetHandle: "left", data: { label: "publish", color: "#4f8ff7" } },
    { id: "e4", source: "kafka", target: "catalog-sync", sourceHandle: "right", targetHandle: "left", data: { label: "consume", color: "#fbbf24" } },
    { id: "e5", source: "catalog-sync", target: "topsort-api", sourceHandle: "right", targetHandle: "left", data: { label: "PUT", color: "#34d399" } },
    { id: "e6", source: "topsort-api", target: "product-index", sourceHandle: "right", targetHandle: "left", data: { color: "#a78bfa", dashed: true } },
  ],
}
