const http = require('http');

const server = http.createServer((req, res) => {
  const targetUrl = `http://localhost:3000${req.url}`;
  res.writeHead(302, {
    Location: targetUrl,
    'Content-Type': 'text/html; charset=utf-8',
  });
  res.end(
    `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0;url=${targetUrl}"></head><body>Redirection vers <a href="${targetUrl}">${targetUrl}</a>...</body></html>`
  );
});

server.listen(3001, '0.0.0.0', () => {
  console.log('Serveur de redirection actif : http://localhost:3001 -> http://localhost:3000');
});
