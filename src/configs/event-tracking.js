export default {
  meta: { name: "event-tracking", storageKey: "event-tracking-diagram-positions", height: 280 },
  zones: [],
  nodes: [
    { id: "browser", type: "service", position: { x: 0, y: 0 }, data: { label: "Browser", subtitle: "shopper device", borderColor: "#fb7185" } },
    { id: "order-svc", type: "service", position: { x: 0, y: 110 }, data: { label: "Order Service", subtitle: "server-side", borderColor: "#4f8ff7" } },
    { id: "jssdk", type: "service", position: { x: 250, y: 0 }, data: { label: "Topsort JS SDK", subtitle: "impressions & clicks", borderColor: "#fb7185" } },
    { id: "event-relay", type: "service", position: { x: 250, y: 110 }, data: { label: "Event Relay", subtitle: "purchases & conversions", borderColor: "#4f8ff7" } },
    { id: "events-api", type: "external", position: { x: 520, y: 50 }, data: { label: "Topsort Events API", subtitle: "POST /v2/events", borderColor: "#a78bfa" } },
  ],
  edges: [
    { id: "e1", source: "browser", target: "jssdk", sourceHandle: "right", targetHandle: "left", data: { label: "client-side", color: "#fb7185" } },
    { id: "e2", source: "order-svc", target: "event-relay", sourceHandle: "right", targetHandle: "left", data: { label: "server-side", color: "#4f8ff7" } },
    { id: "e3", source: "jssdk", target: "events-api", sourceHandle: "right", targetHandle: "left", data: { color: "#fb7185" } },
    { id: "e4", source: "event-relay", target: "events-api", sourceHandle: "right", targetHandle: "left", data: { color: "#4f8ff7" } },
  ],
}
