// smart-expense/backend/src/http/server.js
const http = require('http');
const router = require('./router');

const PORT = process.env.PORT || 3001;

/**
 * Global CORS + preflight handler so the frontend on :3000
 * can always call the API on :3001 (PUT/DELETE/PATCH included).
 */
function withCors(req, res, next) {
  // Allow everything from any origin during dev
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Vary', 'Origin');

  // Methods your frontend uses
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');

  // Headers your frontend sends (JSON, auth, etc.)
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Cache the preflight for some time
  res.setHeader('Access-Control-Max-Age', '86400');

  if (req.method === 'OPTIONS') {
    // Preflight request — no body
    res.writeHead(204);
    res.end();
    return;
  }

  next();
}

const server = http.createServer((req, res) => {
  withCors(req, res, () => {
    // Delegate to your existing router (all endpoints live there)
    router(req, res);
  });
});

server.listen(PORT, () => {
  console.log(`→ [backend] API running on http://localhost:${PORT}`);
});

// Make bad socket requests not crash the server
server.on('clientError', (err, socket) => {
  try {
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
  } catch (_) {}
});
