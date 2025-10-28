# DeployZ Configuration Guide

## App Mode

DeployZ supports two modes for serving your application:

### 1. **webroot** (Default - Static HTML/CSS/JS)
Serves files from the `webroot/` directory - perfect for static websites.

```json
{
  "appMode": "webroot"
}
```

### 2. **react-app** (React + Vite)
Serves the built React app from `react-app/dist/` directory.

```json
{
  "appMode": "react-app"
}
```

**Note**: When using `react-app` mode, make sure to build your React app first:
```bash
cd react-app
npm run build
```

## Live Reload

Control the live reload feature (auto-refresh on file changes):

```json
{
  "liveReload": false
}
```

- `true`: Enable live reload (useful for development)
- `false`: Disable live reload (recommended for production, stops HEAD request spam)

**Why disable?** Live reload sends HEAD requests every second to check for changes, which creates log spam. Disable it when you don't need auto-refresh.

## Complete Example

```json
{
  "port": 3000,
  "webroot": "webroot",
  "appMode": "webroot",
  "liveReload": false,
  "routes": {
    "/": "index.html",
    "/docs/": "docs/index.html"
  },
  "requestLogsEnabled": true,
  "debugLogsEnabled": true
}
```

## Quick Start

### For Static Site (webroot):
1. Set `"appMode": "webroot"`
2. Place files in `webroot/` directory
3. Run `npm start`

### For React App:
1. Build React app: `cd react-app && npm run build`
2. Set `"appMode": "react-app"`  
3. Run `npm start`

### Stop Log Spam:
Set `"liveReload": false` in config.json

---

**Tip**: You can switch between modes anytime by changing `appMode` in `config/config.json`. The server will auto-reload the config!
