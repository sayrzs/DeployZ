# DeployZ Configuration

This guide shows you how to set up DeployZ for your environment.

## Config File

DeployZ uses a JSON config file at `config/config.json`.

### Default Settings

```json
{
    "port": 3000, // here's the port so you can change it
    "webroot": "webroot", // the main root file will includes HTMLs, CSS, JS and whatever you put in it
    "routes": {
        "/": "index.html", // landing/main page route
        "/test-api": "test-api/test-api.html" // test-api route
    },
    "domains": {
        "sayrz.com": "index.html", // that's thing that do that thing (ITS JUST PER DOMAIN FEATURES READ IT IN README.md lazy to explain)
        "sayrz.wispbyte.org": "index.html", // that's thing that do that thing 
        "pixel-zone.sayrz.com": "pixel-zone/index.html" // that's thing that do that thing 
    },
    "liveReload": true, // when you update a html, css, js, file it will be automatically synced to the latest update you did to the file
    "blockFeature": true, // that's thing that do that thing 
    "blockedFiles": ["api/hello.js"], // that's thing that do that thing 
    "logsEnabled": true, // if you won't the logs enabled change that to false :) then no more logs 
    "requestLogsEnabled": true, // logs for request logs 
    "debugLogsEnabled": true, // debug logs for advanced console logs 
    "debugLogLevel": "info", // you 4 levels error, info, warn, debug 
    "redirects": {
        "old-domain.com": "https://new-domain.com", // no need to explain
        "www.example.com": "https://example.com"
    }
}
```

## Settings Explained

### port (number)

The port number for the server.

- Default: 3000
- Example: 8080

### logLevel (string)

Logging level: "error", "warn", "info", "debug".

- Default: "info"

## Next Steps

- See [Installation Guide](#installation) for setup
- Check [API Documentation](#api) for endpoints

For more examples, visit [GitHub](https://github.com/sayrzs/deployz).