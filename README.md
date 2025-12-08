# Sneaker Store — Frontend (React + Vite)

A modern React single‑page application (SPA) e-commerce website for browsing sneakers, managing a cart, and (for admins) creating/updating/deleting sneaker inventory. It integrates **AWS Cognito** (via Amplify v6) for authentication and talks to a serverless backend API.

---

## Live URLs & Demo Video
- Live Site (Cloudfront): https://dxfbbjnnl2x5b.cloudfront.net/
- API (dev): https://b5gwibc2nd.execute-api.us-east-1.amazonaws.com/dev
- Demo: https://github.com/rudybarua23/sneaker-store/releases/tag/Demo

---

## Features
- React + Vite + React Router for a fast SPA
- Authentication with **Amazon Cognito Hosted UI** using **AWS Amplify v6**
- Admin panel to **add/edit/delete** sneakers and update **inventory** (size/quantity)
- Product filtering (by category and price), cart, and a clean componentized UI
- Disclaimer: Category filter is still in progress     
- Auth-aware API calls with automatic token injection
- Production-ready build and CloudFront/S3 static hosting

## Checkout & Payments (In Progress)
The site currently supports browsing products, cart, and admin inventory.  
The **checkout flow** (shipping/billing forms, payment authorization/capture, and
order confirmation) is not connected to a live payment processor yet.

Planned (frontend):
- Checkout pages for shipping/billing
- Payment UI (e.g., Stripe Elements or equivalent hosted fields)
- Clear success/failure states and order confirmation view

---

## Tech Stack
- **React 18**, **Vite**
- **react-router-dom**
- **aws-amplify v6** (Auth only)
- Optional **react-oidc-context** / **oidc-client-ts** (if used for experiments)
- CSS modules/simple CSS

---

## Project Structure (high level)
```
src/
  amplify-config.jsx          # Amplify v6 Auth + Hosted UI configuration
  lib/authFetch.jsx           # Helper to add Cognito ID token to requests
  components/                 # UI components (Navbar, ProductGrid, SneakerForm, ...)
  pages/                      # Home, Shop, Cart, AdminPage
  styles/                     # CSS
vite.config.js                # base:'/' for SPA hosting
```

---

## Authentication/Configuration
`src/amplify-config.jsx` configures Amplify v6 with your **Cognito User Pool**, **App Client**, and **Hosted UI** domain, and sets **redirect URIs** for **Dev** (http://localhost:5173/) and **Prod** (https://dxfbbjnnl2x5b.cloudfront.net/).

> **Update these values** to match your environment:
- `region`  
- `userPoolId` 
- `userPoolClientId` 
- `domain` 
- `loginWith.oauth.redirectSignIn/redirectSignOut` 

The Navbar includes a `LoginComp` which handles `signInWithRedirect`/`signOut` and reflects login state. Admin privileges are derived from the Cognito ID token’s `cognito:groups` (requires **admin** group membership).

---

## API Base URL
Admin and inventory operations call backend API using:
```
VITE_API_BASE=https://b5gwibc2nd.execute-api.us-east-1.amazonaws.com/dev
```
Set this in a **`.env`** file at the project root (Vite loads it automatically):
```
# .env (for local dev)
VITE_API_BASE=https://b5gwibc2nd.execute-api.us-east-1.amazonaws.com/dev
```

For production, set **`VITE_API_BASE`** at build time or in a `.env.production` file and redeploy the built assets.

---

## Local Development
**Prereqs**: Node 18+

```bash
npm install
npm run dev
# app is available at http://localhost:5173
```

If you use Cognito Hosted UI locally, ensure your **Hosted UI App Client** allows `http://localhost:5173/` in **redirectSignIn** and **redirectSignOut**.

---

## Build & Preview
```bash
npm run build     # outputs to dist/
npm run preview   # local static preview
```

---

## Deploy (S3 + CloudFront)
1. Upload the `dist/` folder to your S3 static website bucket (or origin bucket behind CloudFront).
2. **Important (SPA routing)**: configure **S3** and/or **CloudFront** to serve **`index.html` for 404s**, so client‑side routes work.
   - S3 static website hosting: set **Index document** = `index.html` and **Error document** = `index.html`.
   - CloudFront: add a custom error response **404 → 200** with **/index.html** or use a Function/Lambda@Edge to rewrite.
3. **Invalidate CloudFront** after each deploy so updated assets load:
   - e.g., create an invalidation for `/*`.

> **Troubleshooting:** If you see `Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html"` it usually means your SPA route returned **index.html** instead of the requested JS file due to mis‑routing or a stale cache. Fix SPA routing as above and **create a CloudFront invalidation**.

---

## 🔧 Environment Variables (Frontend)
`VITE_API_BASE=https://b5gwibc2nd.execute-api.us-east-1.amazonaws.com/dev` 

Amplify config values live in `src/amplify-config.jsx`. For stronger separation, you can externalize these to `import.meta.env.*` variables (e.g., `VITE_COGNITO_DOMAIN`, etc.) and reference them in the file.

---

## Admin & Inventory
- Admin actions are available when the Cognito ID token has `cognito:groups` including **admin**.
- **AdminPage** uses:
  - `POST   ${VITE_API_BASE}/shoes` — create
  - `PUT    ${VITE_API_BASE}/shoes/:id` — update fields
  - `PATCH  ${VITE_API_BASE}/shoes/:id/inventory` — update inventory rows
  - `DELETE ${VITE_API_BASE}/shoes/:id` — delete
- Browse actions:
  - `GET ${VITE_API_BASE}/shoes` — list (usually public)
  - `GET ${VITE_API_BASE}/shoes/:id` — detail
  - `GET ${VITE_API_BASE}/images` — list image keys/URLs from S3

---

## Scripts
- `npm run dev` — start Vite dev server
- `npm run build` — production build
- `npm run preview` — preview built app
- `npm run lint` — lint (if configured)

---

## Checklist for Production
- [ ] Cognito Hosted UI URLs point to your **CloudFront** domain
- [ ] `VITE_API_BASE` points to your **API Gateway** URL (right stage)
- [ ] SPA routing configured (404 → `/index.html`)
- [ ] CORS allowed on backend for your domain
- [ ] CloudFront invalidation created after each deployment

---

## License
MIT 
