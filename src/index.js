const http = require('http');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
const chokidar = require('chokidar');
const WebSocket = require('ws');
const { minimatch } = require('minimatch');

// Set up for variables
const configPath = path.resolve(__dirname, '../config/config.json');
let config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
let webroot = path.resolve(config.webroot);
// Debugging logs
console.log('[DEBUG] Webroot path:', webroot);
console.log('[DEBUG] Current directory:', __dirname);
// Watch config file and reload onto change (if valid JSON) - only in local development
if (!process.env.VERCEL) {
    chokidar.watch(configPath).on('change', () => {
        try {
            const newConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            config = newConfig;
            webroot = path.resolve(config.webroot);
            console.log('[INFO] Config reloaded');
        } catch (e) {
            console.error('[ERROR] Failed to reload config, keeping previous config:', e);
        }
    });
}
const clients = new Set(); // Store connected WebSocket clients
const liveReloadPort = 35729; // Port for live reload server

// Function to check if a file is blocked
function isFileBlocked(filePath, config, req) {
    if (!config.blockFeature || !config.blockedFiles) return false;
    const normalizedPath = filePath.replace(/^\/+/, ''); // Remove leading slashes

    // Never block .css files
    if (path.extname(normalizedPath) === '.css') return false;

    // Check if file matches any blocked pattern
    const isBlocked = config.blockedFiles.some(pattern => minimatch(normalizedPath, pattern));

    return isBlocked;
}

// Function to log blocked access attempts
function logBlockedAccess(req, filePath) {
    if (!config.logsEnabled) return;
    const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress;
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.url;
    const userAgent = req.headers['user-agent'] || '-';
    const logEntry = `${timestamp} [BLOCKED] ${clientIP} "${method} ${url}" "${userAgent}"\n`;
    const logFile = path.join(__dirname, '../logs/blocked_access.log');
    fs.appendFile(logFile, logEntry, (err) => {
        if (err) console.error('[ERROR] Failed to write to blocked access log:', err);
    });
}

// Function to log all requests (deprecated, now handled in logRequest)
function logAllRequests(req, res, startTime) {
    // This function is no longer used, logging is handled in logRequest
}

// Serve static files from webroot, but block config directory and blocked files
function sendFile(res, filePath, req, config, domainWebroot = null) {
    const rootDir = domainWebroot || webroot;

    // Handle "./" prefix to access files from main webroot
    let fullPath;
    if (filePath.startsWith('./')) {
        const relativePath = filePath.substring(2); // Remove "./" prefix
        fullPath = path.join(webroot, relativePath);

        // Security check: prevent access to config directory even with "./"
        if (fullPath.includes('/config/') || fullPath.includes('\\config\\')) {
            res.writeHead(403);
            return res.end('Forbidden');
        }
    } else {
        fullPath = path.join(rootDir, filePath);
    }
    // Prevent serving files from config directory
    if (fullPath.includes('/config/')) {
        res.writeHead(403);
        return res.end('Forbidden');
    }
    // Check if file is blocked
    if (isFileBlocked(filePath, config, req)) {
        logBlockedAccess(req, filePath);
        res.writeHead(403); // You can change this to 404 if preferred
        return res.end('Access Denied: File is blocked');
    }
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

// Inject live reload script into HTML - only in local development
function injectLiveReload(content, config) {
    if (!config.liveReload || process.env.VERCEL) return content;
    const script = `<script src="http://localhost:${liveReloadPort}/livereload.js"></script>`;
    return content.replace('</body>', script + '</body>');
}

// Log HTTP requests to the console and file
function logRequest(req, res, startTime) {
    const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress;
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.url;
    const statusCode = res.statusCode;
    const userAgent = req.headers['user-agent'] || '-';
    const referer = req.headers['referer'] || '-';
    const responseTime = Date.now() - startTime;
    const logEntry = `${timestamp} ${clientIP} "${method} ${url} HTTP/1.1" ${statusCode} - "${referer}" "${userAgent}" ${responseTime}ms\n`;

    console.log(`${clientIP} - - [${timestamp}] "${method} ${url} HTTP/1.1" ${statusCode} - "${referer}" "${userAgent}" ${responseTime}ms`);

    // Log to requests.log if enabled
    if (config.requestLogsEnabled) {
        const logDir = path.join(__dirname, '../logs');
        const logFile = path.join(logDir, 'requests.log');

        // Ensure logs directory exists
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }

        try {
            fs.appendFileSync(logFile, logEntry);
        } catch (err) {
            console.error('[ERROR] Failed to write to requests log:', err);
        }
    }
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
    let domainWebroot = webroot; // Default to main webroot
    // Per-domain HTML mapping: if config.domains exists and matches host, use that file
    if (config.domains && config.domains[host]) {
        const domainConfig = config.domains[host];
        if (typeof domainConfig === 'object' && domainConfig.webroot) {
            // Handle domain-specific webroot configuration
            domainWebroot = path.resolve(domainConfig.webroot);
            filePath = domainConfig.index || 'index.html';
            domainMatched = true;
        } else if (typeof domainConfig === 'string') {
            // Handle legacy string configuration
            filePath = domainConfig;
            domainMatched = true;
        }
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
    console.log(`[DEBUG] Full path: ${fullPath} | Webroot: ${domainWebroot}`);

    // Inject live reload script for HTML files - only in local development
    if (ext === '.html' && config.liveReload && !process.env.VERCEL) {
        const htmlRootDir = domainWebroot || webroot;
        const htmlFullPath = filePath.startsWith('./') ?
            path.join(webroot, filePath.substring(2)) :
            path.join(htmlRootDir, filePath);

        fs.readFile(htmlFullPath, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end('File not found');
                logRequest(req, res, startTime);
                return;
            }
            const modifiedContent = injectLiveReload(data, config);
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(modifiedContent);
            logRequest(req, res, startTime);
        });
    } else if (req.url.startsWith('/api/')) {
        // Handle API requests by executing scripts from /api/
        const scriptPath = req.url.replace('/api/', '');
        const fullScriptPath = path.join(__dirname, '../api', scriptPath + '.js');
        fs.access(fullScriptPath, fs.constants.F_OK, (err) => {
            if (err) {
                res.writeHead(404);
                res.end('API endpoint not found');
                logRequest(req, res, startTime);
                return;
            }
            try {
                const scriptModule = require(fullScriptPath);
                if (typeof scriptModule.handleRequest === 'function') {
                    scriptModule.handleRequest(req, res, () => {
                        logRequest(req, res, startTime);
                    });
                } else {
                    res.writeHead(500);
                    res.end('Script does not export handleRequest function');
                    logRequest(req, res, startTime);
                }
            } catch (error) {
                console.error('[ERROR] Failed to execute script:', error);
                res.writeHead(500);
                res.end('Internal server error');
                logRequest(req, res, startTime);
            }
        });
    } else {
        sendFile(res, filePath, req, config, domainWebroot);
        res.on('finish', () => {
            logRequest(req, res, startTime);
        });
    }
});

// Start live reload server if enabled - only in local development
if (config.liveReload && !process.env.VERCEL) {
    setupLiveReload();
}

// Export for Vercel
if (process.env.VERCEL) {
    module.exports = (req, res) => {
        server.emit('request', req, res);
    };
} else {
    // Local development
    server.listen(config.port, () => {
        console.log(`Server running at http://localhost:${config.port}`);
    });
}