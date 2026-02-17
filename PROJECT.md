# KURA Workspace Web — Project Instructions

## Role
Lab Backoffice & B2B Marketplace portal. For lab admins, staff, and support.

## Architecture
- **Angular 20** / Tailwind CSS / Standalone components
- **Port:** 4201
- **API:** `kura-enterprise-api` at `http://localhost:8080/api/v1`

## Pages
| Route | Description |
|-------|-------------|
| `/` | Dashboard — stats, recent orders, quick actions |
| `/catalog` | Service catalog list (search, filter by type) |
| `/catalog/create` | Create SINGLE/BUNDLE service (composite pattern) |
| `/orders` | Order management (search, status, walk-in tickets) |
| `/results` | Result processing (sample taken, complete, audio, share) |
| `/import` | CSV patient import (papaparse, visual column mapping) |
| `/inventory` | Warehouse inventory by PoS (stock levels, thresholds) |

## Design Language
- **Layout:** Fixed sidebar (w-64) + header + content area
- **Primary:** Trust Medical Blue `#0ea5e9`
- **Accent:** Emerald Green `#10b981`
- **Background:** gray-50 content area, white sidebar
- **Active nav:** sky-50 bg, sky-500 left border

## Key Behaviors
- Catalog: SINGLE vs BUNDLE composite pattern, "Not Recommended" warning for custom services
- Results: mark sample taken → triggers backend BOM stock deduction
- Audio: WebRTC placeholder (MVP: file upload to mock S3)
- Import: CSV upload → preview → column mapping → upsert
- Share links: 48h expiring UUID links with copy button

## Standards
- All components standalone
- Lazy-loaded routes
- Sidebar navigation with emoji icons (MVP)
- Responsive: collapsible sidebar on mobile
