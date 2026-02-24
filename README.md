# Topsort — Architecture Reference

An interactive web application that documents how a customer marketplace integrates with Topsort's retail media platform. Built as a single-page React app with interactive architecture diagrams.

## Purpose

This project provides a visual architecture reference for Topsort's integration model. It walks through an example customer integration focused on the 3 core API boundaries — **Catalog**, **Auctions**, and **Events** — covering the full lifecycle from catalog ingestion through attribution and billing.

The target audience is engineers familiar with Topsort's ecosystem. It demonstrates understanding of:

- How a customer marketplace connects to Topsort as an external service
- The end-to-end data flow across 6 integration phases
- API contracts, schema mappings, and event tracking patterns
- The distinction between listings and banner ad lifecycles

## Sections

| Tab | Content |
|-----|---------|
| **Overview** | High-level system diagram, key metrics, lifecycle summary, and component breakdown (customer vs Topsort) |
| **Architecture** | Full interactive architecture diagram with flow filtering (Search + Auction, Catalog Sync, Impressions & Clicks, Purchase & Attribution) |
| **Lifecycle** | Detailed 6-phase integration walkthrough with request/response examples, schema mappings, merge algorithm, and attribution windows |
| **API Reference** | Authentication, rate limits, all endpoints, auction types, event types, error codes, and API boundary diagram |

## Tech Stack

- **React 19** + **Vite 7** — app framework and build tool
- **XY Flow (React Flow) 12** — interactive node-based architecture diagrams
- **CSS custom properties** — dark theme design system

## Getting Started

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`.

## Project Structure

```
src/
├── App.jsx                  # Tab navigation, section routing
├── style.css                # Global dark theme styles
├── sections/                # Content for each tab
│   ├── Overview.jsx
│   ├── Architecture.jsx
│   ├── Lifecycle.jsx
│   ├── api.js               # API Reference (HTML template)
│   └── StaticSection.jsx    # Renders HTML template strings
├── diagrams/                # Interactive XY Flow diagrams
│   ├── OverviewDiagram.jsx
│   ├── ArchitectureDiagram.jsx
│   ├── CatalogSyncDiagram.jsx
│   ├── SearchAuctionDiagram.jsx
│   └── EventTrackingDiagram.jsx
├── components/              # Shared diagram components
│   ├── nodes/               # ServiceNode, DataStoreNode, ExternalNode, ZoneNode
│   ├── edges/               # LabeledEdge
│   ├── EditToolbar.jsx
│   └── CurvatureSlider.jsx
├── configs/                 # Diagram layout configs
└── hooks/                   # useEditMode (drag-to-rearrange + persist)
```
