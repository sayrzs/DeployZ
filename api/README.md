# Backend Scripts Directory

This directory contains secure backend scripts that are not accessible via public URLs. These scripts handle API requests through the `/api/` endpoint.

## How It Works

1. **Security**: Scripts in this directory are never served directly to browsers
2. **API Routing**: Frontend communicates via `fetch('/api/scriptname')`
3. **Execution**: Server executes the corresponding `scripts/scriptname.js` file
4. **Isolation**: Each script runs in its own module context

## Creating a New API Endpoint

1. Create a new file in this directory (e.g., `myscript.js`)
2. Export a `handleRequest` function:

```javascript
module.exports.handleRequest = function(req, res, callback) {
    // Handle the request
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Hello!' }));

    // Always call callback() to log the request
    callback();
};
```

3. Access it from frontend: `fetch('/api/myscript')`

## Example Script: hello.js

The `hello.js` script demonstrates:
- Handling GET and POST requests
- CORS headers for frontend communication
- JSON responses
- Error handling
- Request body parsing

## Frontend Usage

```javascript
// GET request
fetch('/api/hello')
    .then(response => response.json())
    .then(data => console.log(data));

// POST request
fetch('/api/hello', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'World' })
})
.then(response => response.json())
.then(data => console.log(data));
```

## Security Notes

- Scripts have access to Node.js modules and server resources
- Be careful with sensitive operations (API keys, database access, etc.)
- Validate all input data
- Use HTTPS in production
- Scripts are cached by Node.js require() - restart server after changes