# DeployZ
## Live Preview

You can view the live preview of this site at:

[https://sayrz.wispbyte.org/](https://sayrz.wispbyte.org/)

_Hosted on [wispbyte.com](https://wispbyte.com)_

## Project Structure

```
config.json
index.js
package.json
README.md
webroot/
		index.html
		docs.html
```

## What is Live Reload?

**LIVE RELOAD** automatically __refreshes__ your browser when you make __changes__ to files in the `webroot` directory. This helps you see updates instantly without manually reloading the page. (YOU CAN DISABLE/ENABLE THIS FEATURE VIA `config.json`)

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