import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { initDb } from './db.js';
import { adminRouter } from './routes/admin.js';
import { productsRouter } from './routes/products.js';
import { ordersRouter } from './routes/orders.js';
import { usersRouter } from './routes/users.js';
import { cartRouter } from './routes/cart.js';
import { wishlistRouter } from './routes/wishlist.js';
import { contactRouter } from './routes/contact.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';


dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors({ origin: true, credentials: true, methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'] }));
  app.use(express.json({ limit: '16mb' }));

  // Serve SEO/AI static files from public/ (robots, sitemap, llms)
  app.use(express.static(path.join(process.cwd(), 'public'), {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('robots.txt')) res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      if (filePath.endsWith('sitemap.xml')) res.setHeader('Content-Type', 'application/xml; charset=utf-8');
      if (filePath.endsWith('llms.txt')) res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    }
  }));
  app.use('/images', express.static(path.join(process.cwd(), 'public', 'images')));

  app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.sendStatus(204);
  });

  // Routes
  app.use('/api/admin', adminRouter);
  app.use('/api/products', productsRouter);
  app.use('/api/orders', ordersRouter);
  app.use('/api/users', usersRouter);
  app.use('/api/cart', cartRouter);
  app.use('/api/wishlist', wishlistRouter);
  app.use('/api/contact', contactRouter);

  // Health check
  app.get('/api/health', (_req, res) => res.json({ ok: true }));

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    console.log('[server] Loading Vite dev server middleware...');
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    console.log('[server] Serving static production build from dist/');
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.use(notFoundHandler);
  app.use(errorHandler);

  // Start DB and listen
  try {
    await initDb();
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`[server] ETZ Shop app running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('[server] Failed to initialize DB or server startup:', err);
    process.exit(1);
  }
}

startServer();

