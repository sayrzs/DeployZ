const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
const chokidar = require('chokidar');
const WebSocket = require('ws');
const { minimatch } = require('minimatch');
const selfsigned = require('selfsigned');

// Set up for variables
const configPath = path.resolve(__dirname, '../config/config.json');
let config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// Determine webroot based on appMode
let webrootPath = config.webroot || 'webroot'; // Default to 'webroot' if not specified
if (config.appMode === 'react-app') {
    webrootPath = 'react-app/dist'; // Vite builds to dist by default
}

let webroot = path.resolve(webrootPath);

// Function to generate self-signed certificates if they don't exist
function generateCertificatesIfNeeded() {
    const certDir = path.join(__dirname, '../certs');
    const keyPath = path.join(certDir, 'key.pem');
    const certPath = path.join(certDir, 'cert.pem');

    if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
        debugLog('info', 'SSL certificates not found, generating self-signed certificates...(BETA VERSION)');
        try {
            // Ensure certs directory exists
            if (!fs.existsSync(certDir)) {
                fs.mkdirSync(certDir, { recursive: true });
            }

            // Generate SELF-SIGNED "certificate"
            const attrs = [{ name: 'commonName', value: 'localhost' }];
            const pems = selfsigned.generate(attrs, { days: 365, keySize: 4096 });

            // write key.pem and cert.pem
            fs.writeFileSync(keyPath, pems.private);
            fs.writeFileSync(certPath, pems.cert);

            debugLog('info', 'SELF-SIGNED SSL certificates generated successfully');
        } catch (error) {
            debugLog('error', 'failed to generate SSL certificates:', { error: error.message });
        }
    }
}
// Watch config file and reload onto change (if valid JSON) - only in local development
if (!process.env.VERCEL) {
    debugLog('info', 'Setting up config file watcher for automatic reload');
    chokidar.watch(configPath).on('change', () => {
        debugLog('info', 'Config file change detected, attempting reload...');
        try {
            const oldWebroot = config.webroot;
            const oldPort = config.port;

            const newConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            const configChanges = {
                webroot: { from: oldWebroot, to: newConfig.webroot },
                port: { from: oldPort, to: newConfig.port },
                domains: { from: Object.keys(config.domains || {}).length, to: Object.keys(newConfig.domains || {}).length },
                routes: { from: Object.keys(config.routes || {}).length, to: Object.keys(newConfig.routes || {}).length }
            };

            config = newConfig;
            // Determine webroot based on appMode (same logic as initial setup)
            let webrootPath = config.webroot || 'webroot'; // Default to 'webroot' if not specified
            if (config.appMode === 'react-app') {
                webrootPath = 'react-app/dist'; // VITEE builds to dist by default
            }
            
            webroot = path.resolve(webrootPath);

            debugLog('info', 'Config successfully reloaded with changes:', configChanges);
        } catch (e) {
            debugLog('error', 'Failed to reload config, keeping previous config:', { error: e.message, configPath });
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

// Enhanced debug logging function with automatic file creation
function debugLog(level, message, data = null) {
    if (!config.debugLogsEnabled) return;

    const logLevels = ['error', 'warn', 'info', 'debug'];
    const currentLevelIndex = logLevels.indexOf(config.debugLogLevel);
    const messageLevelIndex = logLevels.indexOf(level);

    // Only log if the message level is <= current level (e.g., if level is 'info', show 'error', 'warn', 'info' but not 'debug')
    if (messageLevelIndex > currentLevelIndex) return;

    const timestamp = new Date().toISOString();
    const logEntry = data ?
        `${timestamp} [${level.toUpperCase()}] ${message} ${JSON.stringify(data)}\n` :
        `${timestamp} [${level.toUpperCase()}] ${message}\n`;

    // Console output with colors
    const colors = {
        error: '\x1b[31m', // Red
        warn: '\x1b[33m',  // Yellow
        info: '\x1b[36m',  // Cyan
        debug: '\x1b[35m'  // Magenta
    };
    const resetColor = '\x1b[0m';

    console.log(`${colors[level]}[${level.toUpperCase()}]${resetColor} ${message}${data ? ' ' + JSON.stringify(data) : ''}`);

    // File output
    const logDir = path.join(__dirname, '../logs');
    const logFile = path.join(logDir, 'debug.log');

    // Ensure logs directory exists
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
    }

    try {
        fs.appendFileSync(logFile, logEntry);
    } catch (err) {
        console.error('[ERROR] Failed to write to debug log:', err);
    }
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

// Inject live reload script into HTML - only in local development
function injectLiveReload(content, config) {
    if (!config.liveReload || process.env.VERCEL) return content;
    const protocol = config.autoHttps ? 'https' : 'http';
    const script = `<script src="${protocol}://localhost:${liveReloadPort}/livereload.js"></script>`;
    return content.replace('</body>', script + '</body>');
}

// Log HTTP requests to the console and file
function logRequest(req, res, startTime) {
    // Skip logging HEAD requests (live reload polling)
    if (req.method === 'HEAD') return;
    
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

// Create HTTP/HTTPS server to serve files and handle live reload
function createServer() {
    // Disable autoHttps in proxied environments
    const isProxied = config.proxiedEnvironment;
    const useHttps = config.autoHttps && !isProxied;

    if (useHttps) {
        // Generate SSL certificates if they don't exist
        generateCertificatesIfNeeded();

        // Use existing SSL certificates if available, otherwise fallback to HTTP
        const certDir = path.join(__dirname, '../certs');
        const keyPath = path.join(certDir, 'key.pem');
        const certPath = path.join(certDir, 'cert.pem');

        if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
            try {
                const options = {
                    key: fs.readFileSync(keyPath),
                    cert: fs.readFileSync(certPath)
                };
                return https.createServer(options, handleRequest);
            } catch (error) {
                debugLog('error', 'Failed to load SSL certificates:', { error: error.message });
                debugLog('warn', 'Falling back to HTTP server');
                return http.createServer(handleRequest);
            }
        } else {
            debugLog('warn', 'SSL certificates not found, falling back to HTTP server');
            return http.createServer(handleRequest);
        }
    } else {
        return http.createServer(handleRequest);
    }
}

const server = createServer();

// Request handler function
function handleRequest(req, res) {
    const startTime = Date.now();

    // Get the hostname from the request headers
    const host = req.headers.host ? req.headers.host.split(':')[0] : '';

    let filePath = req.url === '/' ? '' : req.url;
    filePath = filePath.split('?')[0];

    // Enhanced debug logging for host header
    debugLog('debug', 'Host header received:', { host: req.headers.host });

    // Check if the request is already HTTPS via proxy
    const isHttpsViaProxy = req.headers['x-forwarded-proto'] === 'https' || req.headers['x-forwarded-ssl'] === 'on';

    // Force HTTPS redirect only if autoHttps is enabled, not encrypted, and not via proxy
    if (config.autoHttps && !req.connection.encrypted && !isHttpsViaProxy) {
        const httpsUrl = `https://${host}${req.url}`;
        debugLog('info', `Redirecting HTTP to HTTPS: ${req.url} -> ${httpsUrl}`);

        res.writeHead(301, {
            'Location': httpsUrl,
            'Cache-Control': 'no-cache'
        });
        res.end(`Redirecting to ${httpsUrl}`);
        logRequest(req, res, startTime);
        return;
    }

    // Check for HTTP redirects first
    if (config.redirects && config.redirects[host]) {
        const redirectUrl = config.redirects[host];
        const fullRedirectUrl = redirectUrl.startsWith('http') ? redirectUrl : `https://${redirectUrl}`;

        debugLog('info', `Redirecting ${host} to ${fullRedirectUrl}`);

        res.writeHead(301, {
            'Location': fullRedirectUrl,
            'Cache-Control': 'no-cache'
        });
        res.end(`Redirecting to ${fullRedirectUrl}`);
        logRequest(req, res, startTime);
        return;
    }

    let domainMatched = false;
    let domainWebroot = webroot; // Default to main webroot
    // Per-domain HTML mapping: if config.domains exists and matches host, use that file
    if (config.domains && config.domains[host]) {
        const domainConfig = config.domains[host];
        debugLog('debug', `Domain config for ${host}:`, domainConfig);
        if (typeof domainConfig === 'object' && domainConfig.webroot) {
            // Handle domain-specific webroot configuration
            domainWebroot = path.resolve(domainConfig.webroot);
            filePath = domainConfig.index || 'index.html';
            domainMatched = true;
        } else if (typeof domainConfig === 'string') {
            // Handle legacy string configuration -extract directory from path
            if (domainConfig.includes('/')) {
                // Extract directory from path like "subdir/index.html"
                const pathParts = domainConfig.split('/');
                const domainDir = pathParts[0];
                const fileName = pathParts[1]; // Extract just the filename
                domainWebroot = path.resolve(webroot, domainDir);
                filePath = fileName; // Use only the filename part
                debugLog('debug', 'Set filePath and domainWebroot:', { filePath, domainWebroot });
                domainMatched = true;
            } else {
                // Simple filename like "index.html"
                filePath = domainConfig;
                domainMatched = true;
            }
        }
    // Only check routes if not in react-app mode or if it's not the root path
    } else if (config.routes[req.url] && !(config.appMode === 'react-app' && req.url === '/')) {
        // Support custom routes from config
        filePath = config.routes[req.url];
        debugLog('debug', 'Route matched, filePath set:', { filePath });
    } else if (req.url === '/' && !domainMatched) {
        // Fallback to index.html for root if nothing matches AND no domain was matched
        // But only if not in react-app mode (since that's handled by the webroot logic)
        if (config.appMode !== 'react-app') {
            filePath = 'index.html';
        }
        debugLog('debug', 'Fallback to index.html, filePath set:', { filePath });
    }

    debugLog('debug', 'Final filePath before fullPath calculation:', { filePath });
    const fullPath = path.join(webroot, filePath);
    const ext = path.extname(fullPath).toLowerCase();

    // Enhanced debug logging for host and file selection
    debugLog('debug', 'Request details:', {
        host,
        domainMatched,
        filePath,
        domainWebroot,
        mainWebroot: webroot
    });
    const actualFullPath = path.join(domainWebroot, filePath);
    debugLog('debug', 'Path resolution:', {
        actualFullPath,
        fullPath,
        domainWebroot
    });

    // Inject live reload script for HTML files - only in local development
    if (ext === '.html' && config.liveReload && !process.env.VERCEL) {
        const htmlRootDir = domainWebroot || webroot;
        const htmlFullPath = filePath.startsWith('./') ?
            path.join(webroot, filePath.substring(2)) :
            path.join(htmlRootDir, filePath);
        debugLog('debug', 'HTML branch processing:', {
            htmlRootDir,
            filePath,
            htmlFullPath
        });

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
}

// Start live reload server if enabled - only in local development
if (config.liveReload && !process.env.VERCEL) {
    // Simple live reload without WebSocket
    const protocol = config.autoHttps ? 'https' : 'http';
    const livereloadServer = (config.autoHttps ? https : http).createServer((req, res) => {
        if (req.url === '/livereload.js') {
            res.writeHead(200, { 'Content-Type': 'application/javascript' });
            res.end(`
                (function() {
                    console.log('Live reload enabled');
                    setInterval(function() {
                        fetch(window.location.href, { method: 'HEAD' })
                            .then(response => {
                                if (response.status === 200) {
                                    // Page is still accessible, do nothing
                                }
                            })
                            .catch(() => {
                                // If fetch fails, page might have changed, reload
                                window.location.reload();
                            });
                    }, 1000);
                })();
            `);
        } else {
            res.writeHead(404);
            res.end();
        }
    });

    livereloadServer.listen(liveReloadPort, (err) => {
        if (err) {
            debugLog('warn', 'Live reload server failed to start, continuing without live reload:', { error: err.message });
            return;
        }
        debugLog('info', 'Live reload server started on port', { port: liveReloadPort });
    });
}

// Export for Vercel
if (process.env.VERCEL) {
    module.exports = (req, res) => {
        server.emit('request', req, res);
    };
} else {
    // Local development
    const protocol = config.autoHttps ? 'https' : 'http';
    server.listen(config.port, () => {
        console.log(`Server running at ${protocol}://localhost:${config.port}`);
    });
}
