# DeployZ
## Live Preview

You can view the live preview of this site at:

[Preview](https://deployz.wispbyte.org/)

_Hosted on [WispByte](https://wispbyte.com)_

## What is Live Reload?

**LIVE RELOAD** automatically __refreshes__ your browser when you make __changes__ to files in the `webroot` directory. This helps you see updates instantly without manually reloading the page. (YOU CAN DISABLE/ENABLE THIS FEATURE VIA `config.json` KEEP IN MIND THIS WONT WORK ON THE PORT)

## Per-Domain Pages

You can show a different HTML file for each domain using the `domains` section in `config.json`.

## How to add domains
To add or remove domains, edit the `domains` section in `config.json`.

## File Blocking and Logging

Block specific files from public access and log requests.

- **Block Files**: Set `blockFeature: true` and add patterns to `blockedFiles` array in `config.json`. CSS files cannot be blocked.
- **Logs**: Enable `logsEnabled` for blocked access logs, `requestLogsEnabled` for all request logs. Logs saved to `logs/` directory.

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
