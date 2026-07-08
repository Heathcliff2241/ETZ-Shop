import app, { initServer } from './_lib/server.js';

export default async function handler(req, res) {
  await initServer();
  return app(req, res);
}
