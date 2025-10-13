# Changelog

## Version 1.1.0 - Enhanced Security Features (2025-10-13)

### New Features
- **File Blocking**: Block specific files with wildcards. CSS files never blocked.
- **API Routing**: `/api/<script>` executes backend scripts securely.
- **Logging**: Logs blocked access and all requests to files, configurable.

### Config Changes
- `blockFeature`: Enable/disable blocking (default: true)
- `blockedFiles`: Array of patterns to block (default: [])
- `logsEnabled`: Enable blocked access logs (default: true)
- `requestLogsEnabled`: Enable all request logs (default: true)

### Files Added
- `scripts/` directory
- `logs/` directory
- `logs/requests.log`

### Files Modified
- `config/config.json`
- `src/index.js`
- `package.json`