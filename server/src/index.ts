import { Hono } from 'hono';
import { cors } from 'hono/cors';

type Bindings = {
  hmni_db: D1Database;
  hmni_photos: R2Bucket;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use('*', cors());
app.use('*', async (c, next) => {
  await next();
  c.header('Cache-Control', 'no-store');
});

// ---------- Photos ----------

app.post('/photos', async (c) => {
  const formData = await c.req.formData();
  const file = formData.get('photo');
  const blob = file as unknown as File;
  if (!blob || !blob.arrayBuffer) {
    return c.json({ error: 'No photo provided' }, 400);
  }
  const key = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
  await c.env.hmni_photos.put(key, await blob.arrayBuffer(), {
    httpMetadata: { contentType: blob.type || 'image/jpeg' },
  });
  const url = new URL(c.req.url);
  return c.json({ key, url: `${url.origin}/photos/${key}` }, 201);
});

app.get('/photos/:key', async (c) => {
  const object = await c.env.hmni_photos.get(c.req.param('key'));
  if (!object) return c.json({ error: 'Not found' }, 404);
  const headers = new Headers();
  headers.set('Content-Type', object.httpMetadata?.contentType ?? 'image/jpeg');
  headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  return new Response(object.body, { headers });
});

// ---------- Designs ----------

app.get('/designs', async (c) => {
  const { results } = await c.env.hmni_db.prepare(
    'SELECT * FROM designs ORDER BY created_at DESC'
  ).all();
  return c.json(results);
});

app.get('/designs/search', async (c) => {
  const q = c.req.query('q') ?? '';
  if (!q) return c.json([]);
  const like = `%${q}%`;
  const { results } = await c.env.hmni_db.prepare(
    'SELECT * FROM designs WHERE name LIKE ?1 OR description LIKE ?1 ORDER BY created_at DESC'
  ).bind(like).all();
  return c.json(results);
});

app.get('/designs/:id', async (c) => {
  const row = await c.env.hmni_db.prepare(
    `SELECT d.*, u.username AS creator_username
     FROM designs d LEFT JOIN users u ON d.creator_id = u.id
     WHERE d.id = ?`
  ).bind(c.req.param('id')).first();
  if (!row) return c.json({ error: 'Not found' }, 404);
  return c.json(row);
});

app.get('/designs/:id/stickers', async (c) => {
  const { results } = await c.env.hmni_db.prepare(
    'SELECT * FROM stickers WHERE design_id = ? ORDER BY logged_at DESC'
  ).bind(c.req.param('id')).all();
  return c.json(results);
});

app.post('/designs', async (c) => {
  const body = await c.req.json<{
    name: string;
    description?: string;
    imageUrl?: string;
    creatorId: string;
  }>();
  const id = `d${Date.now()}`;
  await c.env.hmni_db.prepare(
    'INSERT INTO designs (id, name, description, image_url, creator_id) VALUES (?, ?, ?, ?, ?)'
  ).bind(id, body.name, body.description ?? '', body.imageUrl ?? '', body.creatorId).run();
  const row = await c.env.hmni_db.prepare('SELECT * FROM designs WHERE id = ?').bind(id).first();
  return c.json(row, 201);
});

// ---------- Users ----------

app.get('/users/search', async (c) => {
  const q = c.req.query('q') ?? '';
  if (!q) return c.json([]);
  const like = `%${q}%`;
  const { results } = await c.env.hmni_db.prepare(
    `SELECT u.*, (SELECT COUNT(*) FROM stickers WHERE user_id = u.id) AS sticker_count
     FROM users u WHERE u.username LIKE ? ORDER BY u.username`
  ).bind(like).all();
  return c.json(results);
});

app.get('/users/:id', async (c) => {
  const row = await c.env.hmni_db.prepare(
    'SELECT * FROM users WHERE id = ?'
  ).bind(c.req.param('id')).first();
  if (!row) return c.json({ error: 'Not found' }, 404);
  return c.json(row);
});

app.get('/users/:id/stickers', async (c) => {
  const { results } = await c.env.hmni_db.prepare(
    'SELECT * FROM stickers WHERE user_id = ? ORDER BY logged_at DESC'
  ).bind(c.req.param('id')).all();
  return c.json(results);
});

app.get('/users/:id/designs', async (c) => {
  const { results } = await c.env.hmni_db.prepare(
    'SELECT * FROM designs WHERE creator_id = ? ORDER BY created_at DESC'
  ).bind(c.req.param('id')).all();
  return c.json(results);
});

app.post('/users', async (c) => {
  const body = await c.req.json<{
    username: string;
    email: string;
  }>();
  const id = `u${Date.now()}`;
  await c.env.hmni_db.prepare(
    'INSERT INTO users (id, username, email) VALUES (?, ?, ?)'
  ).bind(id, body.username, body.email).run();
  const row = await c.env.hmni_db.prepare('SELECT * FROM users WHERE id = ?').bind(id).first();
  return c.json(row, 201);
});

// ---------- Stickers ----------

app.get('/stickers', async (c) => {
  const { results } = await c.env.hmni_db.prepare(
    'SELECT * FROM stickers ORDER BY logged_at DESC'
  ).all();
  return c.json(results);
});

app.get('/stickers/:id', async (c) => {
  const row = await c.env.hmni_db.prepare(
    `SELECT s.*, d.name AS design_name, u.username
     FROM stickers s
     LEFT JOIN designs d ON s.design_id = d.id
     LEFT JOIN users u ON s.user_id = u.id
     WHERE s.id = ?`
  ).bind(c.req.param('id')).first();
  if (!row) return c.json({ error: 'Not found' }, 404);
  return c.json(row);
});

app.post('/stickers', async (c) => {
  const body = await c.req.json<{
    designId: string;
    userId: string;
    photoUri?: string;
    latitude: number;
    longitude: number;
    locationName?: string;
    note?: string;
  }>();
  const id = `s${Date.now()}`;
  await c.env.hmni_db.prepare(
    `INSERT INTO stickers (id, design_id, user_id, photo_uri, latitude, longitude, location_name, note)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    id, body.designId, body.userId, body.photoUri ?? '',
    body.latitude, body.longitude, body.locationName ?? '', body.note ?? ''
  ).run();
  const row = await c.env.hmni_db.prepare('SELECT * FROM stickers WHERE id = ?').bind(id).first();
  return c.json(row, 201);
});

export default app;
