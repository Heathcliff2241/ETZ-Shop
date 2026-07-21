import { Request, Response } from 'express';
import app, { initServer } from './_lib/server.js';

export default async function handler(req: Request, res: Response) {
  await initServer();
  return app(req, res);
}
