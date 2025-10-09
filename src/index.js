const http = require('http');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
const chokidar = require('chokidar');
const WebSocket = require('ws');

// Load configuration and set up variables
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
const webroot = path.resolve(config.webroot);
const clients = new Set(); // Store connected WebSocket clients
const liveReloadPort = 35729; // Port for live reload server

// Serve static files from webroot
function sendFile(res, filePath) {
    const fullPath = path.join(webroot, filePath);
  
    fs.stat(fullPath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404);
            return res.end('File not found');
        }
    
        const mimeType = mime.lookup(fullPath) || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': mimeType });
    
        const readStream = fs.createReadStream(fullPath);
        readStream.pipe(res);
    });
}

// Set up live reload server and WebSocket for auto-refresh
function setupLiveReload() {
    const livereloadServer = http.createServer((req, res) => {
        if (req.url === '/livereload.js') {
            res.writeHead(200, { 'Content-Type': 'application/javascript' });
            res.end(`
                (function() {
                    let socket = new WebSocket('ws://localhost:${liveReloadPort}');
                    socket.onmessage = function(event) {
                        if (event.data === 'reload') {
                            window.location.reload();
                        }
                    };
                    socket.onclose = function() {
                        setTimeout(function() {
                            window.location.reload();
                        }, 1000);
                    };
                })();
            `);
        } else {
            res.writeHead(404);
            res.end();
        }
    });
  
    livereloadServer.listen(liveReloadPort);
  
    const wss = new WebSocket.Server({ port: liveReloadPort + 1 });
  
    wss.on('connection', ws => {
        clients.add(ws);
        ws.on('close', () => clients.delete(ws));
    });
  
    // Watch for file changes and notify clients
    const watcher = chokidar.watch(webroot, { ignored: /node_modules/ });
    watcher.on('change', () => {
        clients.forEach(ws => {
            if (ws.readyState === 1) {
                ws.send('reload');
            }
        });
    });
}

// Inject live reload script into HTML
function injectLiveReload(content) {
    if (!config.liveReload) return content;
    const script = `<script src="http://localhost:${liveReloadPort}/livereload.js"></script>`;
    return content.replace('</body>', script + '</body>');
}

// Log HTTP requests to the console
function logRequest(req, res, startTime) {
    const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress;
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.url;
    const statusCode = res.statusCode;
    const userAgent = req.headers['user-agent'] || '-';
    const referer = req.headers['referer'] || '-';
    const responseTime = Date.now() - startTime;
    
    console.log(`${clientIP} - - [${timestamp}] "${method} ${url} HTTP/1.1" ${statusCode} - "${referer}" "${userAgent}" ${responseTime}ms`);
}

// Create HTTP server to serve files and handle live reload
const server = http.createServer((req, res) => {
    const startTime = Date.now();

    // Get the hostname from the request headers
    const host = req.headers.host ? req.headers.host.split(':')[0] : '';

    let filePath = req.url === '/' ? '' : req.url;
    filePath = filePath.split('?')[0];

    // Log the actual Host header for every request
    console.log(`[DEBUG] Host header: ${req.headers.host}`);

    let domainMatched = false;
    // Per-domain HTML mapping: if config.domains exists and matches host, use that file
    if (config.domains && config.domains[host]) {
        filePath = config.domains[host];
        domainMatched = true;
    } else if (config.routes[req.url]) {
        // Support custom routes from config
        filePath = config.routes[req.url];
    } else if (req.url === '/') {
        // Fallback to index.html for root if nothing matches
        filePath = 'index.html';
    }

    const fullPath = path.join(webroot, filePath);
    const ext = path.extname(fullPath).toLowerCase();

    // Log host and selected file for debugging
    console.log(`[DEBUG] Host: ${host} | Domain matched: ${domainMatched} | Serving file: ${filePath}`);

    // Inject live reload script for HTML files
    if (ext === '.html' && config.liveReload) {
        fs.readFile(fullPath, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end('File not found');
                logRequest(req, res, startTime);
                return;
            }
            const modifiedContent = injectLiveReload(data);
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(modifiedContent);
            logRequest(req, res, startTime);
        });
    } else {
        sendFile(res, filePath);
        res.on('finish', () => {
            logRequest(req, res, startTime);
        });
    }
});

// Start live reload server if enabled
if (config.liveReload) {
    setupLiveReload();
}

// Start the HTTP server
server.listen(config.port, () => {
    console.log(`Server running at http://localhost:${config.port}`);
});