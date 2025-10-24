# DeployZ API Guide

This page explains how to use the DeployZ API endpoints.

## About the API

The DeployZ API is built with Node.js and Express. It provides simple endpoints for testing and demo purposes.

## Base URL

All API endpoints start with `/api/`.

## Authentication

The API doesn't require authentication right now, but you can add an API key in `config/config.json` if needed.

## Available Endpoints

### GET /api/hello

Returns a simple message.

**Request:**

```http
GET /api/hello
```

**Response:**

```json
{
  "message": "Hello, World!"
}
```

**Status Codes:**
- 200: Success

**Example:**

```bash
curl http://localhost:3000/api/hello
```

### POST /api/hello

Sends JSON data and gets a response back.

**Request:**

```http
POST /api/hello
Content-Type: application/json

{
  "name": "World",
  "message": "Hello from frontend!"
}
```

**Response:**

```json
{
  "message": "Hello, World! Hello from frontend!"
}
```

**Status Codes:**
- 200: Success
- 400: Bad Request (Invalid JSON)

**Example:**

```bash
curl -X POST http://localhost:3000/api/hello \
  -H "Content-Type: application/json" \
  -d '{"name": "World", "message": "Hello from frontend!"}'
```

## Testing the API

Use the test page at `/test-api/` to try these endpoints in your browser.

## Error Handling

The API returns proper HTTP status codes and error messages in JSON format.

**Example Error:**

```json
{
  "error": "Invalid JSON format"
}
```

## Rate Limiting

You can set rate limits in `config/config.json`. It's disabled by default.

## Security

- Private files are protected
- Use HTTPS in production
- Add authentication for live use

## Development

To add new endpoints, edit `api/hello.js` or add files in the `api/` folder.

## Next Steps

- Check [Configuration Guide](#config) for API settings
- See [Installation Guide](#installation) for setup

For more features, contribute on [GitHub](https://github.com/sayrzs/deployz).