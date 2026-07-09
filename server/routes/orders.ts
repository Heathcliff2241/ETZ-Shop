import { Router, Request, Response } from 'express';
import { sql } from '../db.js';
import { requireAdmin } from './admin.js';
import { assertRequiredFields, asyncHandler, validateEmail } from '../utils/validation.js';
import { sendOrderNotification } from '../mailer.js';

export const ordersRouter = Router();

function toOrder(row: Record<string, unknown>) {
  return {
    id: row.id,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    customerEmail: row.customer_email,
    deliveryMethod: row.delivery_method,
    deliveryAddress: row.delivery_address,
    contactMethod: row.contact_method,
    note: row.note,
    items: row.items,
    subtotal: Number(row.subtotal),
    status: row.status,
    dateCreated: row.date_created,
  };
}

// ── GET /api/orders/lookup (public — customer order tracking) ──────────────────────────
ordersRouter.get('/lookup', asyncHandler(async (req: Request, res: Response) => {
  const query = req.query.query ? String(req.query.query).trim() : '';
  if (!query) {
    return res.status(400).json({ error: 'Please enter an email or phone number to look up your orders.' });
  }

  // Find orders matching either customer_email or customer_phone
  const rows = await sql`
    SELECT * FROM etz_orders 
    WHERE LOWER(customer_email) = LOWER(${query}) 
       OR customer_phone = ${query}
       OR REPLACE(customer_phone, ' ', '') = REPLACE(${query}, ' ', '')
    ORDER BY date_created DESC
  ` as Array<Record<string, unknown>>;

  return res.json(rows.map(toOrder));
}));

// ── POST /api/orders  (public — place order) ─────────────────────────────────
ordersRouter.post('/', asyncHandler(async (req: Request, res: Response) => {
  const o = req.body as Record<string, unknown>;
  assertRequiredFields(o, ['customerName', 'customerPhone', 'customerEmail', 'deliveryMethod', 'items', 'subtotal']);
  validateEmail(String(o.customerEmail));

  const id = `ETZ-${Math.floor(100000 + Math.random() * 900000)}`;
  const dateCreated = new Date().toLocaleString('en-PH', { timeZone: 'Asia/Manila' });
  const items = Array.isArray(o.items) ? o.items : [];

  await sql`
    INSERT INTO etz_orders
      (id, customer_name, customer_phone, customer_email, delivery_method,
       delivery_address, contact_method, note, items, subtotal, status, date_created)
    VALUES
      (${id}, ${String(o.customerName)}, ${String(o.customerPhone)}, ${String(o.customerEmail)},
       ${String(o.deliveryMethod)}, ${o.deliveryAddress ? String(o.deliveryAddress) : null}, ${o.contactMethod ? String(o.contactMethod) : null},
       ${o.note ? String(o.note) : null}, ${JSON.stringify(items)}, ${Number(o.subtotal)},
       'pending', ${dateCreated})
  `;

  for (const item of items as Array<{ productId?: string }> ) {
    if (item.productId) {
      await sql`UPDATE etz_products SET is_sold = true WHERE id = ${item.productId}`;
    }
  }

  const rows = await sql`SELECT * FROM etz_orders WHERE id = ${id}`;
  const order = rows[0] as Record<string, unknown>;

  try {
    await sendOrderNotification({
      id,
      customerName: String(o.customerName),
      customerEmail: String(o.customerEmail),
      status: 'pending',
      subtotal: Number(o.subtotal),
      items: Array.isArray(items) ? items.map((item) => ({ productName: typeof item.productName === 'string' ? item.productName : undefined, productId: typeof item.productId === 'string' ? item.productId : undefined })) : [],
    });
  } catch (error) {
    console.warn('[orders] Failed to send order notification.', error);
  }

  return res.status(201).json(toOrder(order));
}));

// ── GET /api/orders  (admin only) ────────────────────────────────────────────
ordersRouter.get('/', requireAdmin, asyncHandler(async (_req: Request, res: Response) => {
  const rows = await sql`SELECT * FROM etz_orders ORDER BY date_created DESC` as Array<Record<string, unknown>>;
  return res.json(rows.map(toOrder));
}));

// ── PUT /api/orders/:id/status  (admin only) ──────────────────────────────────
ordersRouter.put('/:id/status', requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.body as { status?: string };
  const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status.' });
  }

  await sql`UPDATE etz_orders SET status = ${status} WHERE id = ${req.params.id}`;

  if (status === 'cancelled') {
    const rows = await sql`SELECT items FROM etz_orders WHERE id = ${req.params.id}` as Array<Record<string, unknown>>;
    if (rows.length > 0) {
      const items = rows[0].items as { productId?: string }[];
      for (const item of items) {
        if (item.productId) {
          await sql`UPDATE etz_products SET is_sold = false WHERE id = ${item.productId}`;
        }
      }
    }
  }

  const rows = await sql`SELECT * FROM etz_orders WHERE id = ${req.params.id}` as Array<Record<string, unknown>>;
  if (rows.length === 0) return res.status(404).json({ error: 'Not found.' });

  try {
    const order = rows[0] as Record<string, unknown>;
    await sendOrderNotification({
      id: String(order.id),
      customerName: String(order.customer_name || ''),
      customerEmail: String(order.customer_email || ''),
      status,
      subtotal: Number(order.subtotal || 0),
      items: Array.isArray(order.items) ? order.items as Array<{ productName?: string; productId?: string }> : [],
    });
  } catch (error) {
    console.warn('[orders] Failed to send order status notification.', error);
  }

  return res.json(toOrder(rows[0]));
}));
