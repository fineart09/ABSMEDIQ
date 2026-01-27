# ABSMEDIQ — Fresh Start

This project has been reset and initialized with Vite + React.

## Quick Start

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deploy to IIS

This app uses hash-based navigation (URLs like `#รายการสินค้า`) so IIS URL Rewrite is not required.

### Build + package (recommended)

```bash
npm run build:iis
```

Outputs:

- `dist/` (deploy this folder)
- `ABSMEDIQ-iis.zip` (upload/extract to your IIS site folder)

### IIS setup (quick)

1. Enable IIS **Static Content** role service.
2. Create a Site (or Virtual Directory) pointing to the extracted `dist/`.
3. Browse the site.

If you later switch to History API routing (non-hash URLs), you will need IIS URL Rewrite + a SPA fallback rule in `web.config`.
