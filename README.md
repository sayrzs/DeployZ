# DeployZ
## Live Preview of DeployZ

You can view the live preview of this site at:

[DOCS](https://www.sayrz.com/docs/)

_Hosted on [**WispByte**](https://billing.wispbyte.com/order/forms/a/MzAxNg==) or [**Vercel**](vercel.com) (fully supported) **still beta feature**_

## What is Live Reload?

**LIVE RELOAD** automatically __refreshes__ your browser when you make __changes__ to files in the `webroot` directory. This helps you see updates instantly without manually reloading the page. (YOU CAN DISABLE/ENABLE THIS FEATURE VIA `config.json` KEEP IN MIND THIS WONT WORK ON THE PORT)

## Per-Domain Pages (BETA, MIGHT INCLUDE SOME ISSUES WHILE USING IT)

You can show a different HTML file for each domain using the `domains` section in `config.json`.

## How to add domains (BETA, MIGHT INCLUDE SOME ISSUES WHILE USING IT)
To add or remove domains, edit the `domains` section in `config.json`.

## File Blocking and Logging

Block specific files from public access and log requests.

- **Block Files**: Set `blockFeature: true` and add patterns to `blockedFiles` array in `config.json`. CSS files cannot be blocked.
- **Logs**: Enable `logsEnabled` for blocked access logs, `requestLogsEnabled` for all request logs. Logs saved to `logs/` directory.

## Debug Logging (NEW)

Enhanced debug logging with automatic log file creation (NO NEED TO CREATE ONE).

- **Enable Debug Logs**: Set `debugLogsEnabled: true` in `config.json`
- **Log Levels**: Set `debugLogLevel` to `"error"`, `"warn"`, `"info"`, or `"debug"` (default: `"info"`)
- **Features**:
  - Automatic log file creation in `logs/debug.log`
  - Structured logging with JSON data for objects

## HTTP Redirects (NEW)

Redirect domains to other URLs(DOMAINS) with automatic HTTP 301 redirects.

- **CONFIGURE REDIRECTS**: Add entries to the `redirects` section in `config.json`:
  ```json
  {
    "redirects": {
      "old-domain.com": "https://new-domain.com",
      "legacy.example.com": "https://example.com"
    }
  }
  ```
- **Features**:
  - Automatic HTTP 301 (permanent redirect) responses
  - Supports both HTTP and HTTPS redirect URLs
  - Logged in `requests.logs` for **tracking**

## Usage

- Place HTML files in the `webroot` directory
- Run `index.js` from **Node.js** using console command --> `npm start` ^ `npm run dev`
- Add dependencies to `package.json`

## Commands

- Start server:
	```bash
	npm start
	```

- (Optional) "If" you "add" a `dev` script to `package.json`, run:
	```bash
	npm run dev
	```

## Support
[Our Discord](https://discord.gg/XmffUUgx)
