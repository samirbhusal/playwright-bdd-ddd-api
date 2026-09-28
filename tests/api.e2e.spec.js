const http = require('node:http');
const { test, expect } = require('@playwright/test');

test.describe('API end-to-end flow', () => {
  test('retrieves order details from an API endpoint', async ({ request }) => {
    const server = http.createServer((req, res) => {
      if (req.method === 'GET' && req.url === '/orders/1001') {
        res.writeHead(200, { 'content-type': 'application/json' });
        res.end(JSON.stringify({ id: 1001, status: 'confirmed', total: 49.99 }));
        return;
      }

      res.writeHead(404, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ message: 'Not found' }));
    });

    await new Promise((resolve) => server.listen(0, resolve));
    const address = server.address();
    if (!address || typeof address === 'string') {
      throw new Error('Unable to determine server address');
    }
    const baseUrl = `http://127.0.0.1:${address.port}`;

    try {
      const response = await request.get(`${baseUrl}/orders/1001`);
      await expect(response).toBeOK();
      await expect(response.status()).toBe(200);
      await expect(response.json()).resolves.toEqual({
        id: 1001,
        status: 'confirmed',
        total: 49.99,
      });
    } finally {
      await new Promise((resolve, reject) => {
        server.close((error) => {
          if (error) {
            reject(error);
            return;
          }

          resolve();
        });
      });
    }
  });
});
