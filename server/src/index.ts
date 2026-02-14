import { Hono, type MiddlewareHandler } from 'hono';
import { cors } from 'hono/cors';
import { sign, verify } from 'hono/jwt';
import { hashPassword, verifyPassword } from './password';

type Bindings = {
  hmni_db: D1Database;
  hmni_photos: R2Bucket;
  JWT_SECRET: string;
};

type Variables = {
  userId: string;
  username: string;
};

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

app.use('*', cors());
app.use('*', async (c, next) => {
  await next();
  c.header('Cache-Control', 'no-store');
});

// ---------- Auth middleware ----------

const authMiddleware: MiddlewareHandler<{ Bindings: Bindings; Variables: Variables }> = async (c, next) => {
  const header = c.req.header('Authorization');
  if (!header?.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  try {
    const payload = await verify(header.slice(7), c.env.JWT_SECRET, 'HS256');
    c.set('userId', payload.sub as string);
    c.set('username', payload.username as string);
    await next();
  } catch {
    return c.json({ error: 'Invalid token' }, 401);
  }
};

function makeToken(c: { env: Bindings }, user: { id: string; username: string }) {
  return sign({ sub: user.id, username: user.username, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30 }, c.env.JWT_SECRET, 'HS256');
}

// ---------- Auth routes ----------

app.post('/auth/signup', async (c) => {
  const body = await c.req.json<{ username: string; email: string; password: string }>();
  if (!body.username || !body.email || !body.password) {
    return c.json({ error: 'username, email, and password are required' }, 400);
  }
  const existing = await c.env.hmni_db.prepare('SELECT id FROM users WHERE username = ?').bind(body.username).first();
  if (existing) {
    return c.json({ error: 'Username already taken' }, 409);
  }
  const id = `u${Date.now()}`;
  const passwordHash = await hashPassword(body.password);
  await c.env.hmni_db.prepare(
    'INSERT INTO users (id, username, email, password_hash) VALUES (?, ?, ?, ?)'
  ).bind(id, body.username, body.email, passwordHash).run();
  const user = await c.env.hmni_db.prepare('SELECT id, username, email, joined_at FROM users WHERE id = ?').bind(id).first();
  const token = await makeToken(c, { id, username: body.username });
  return c.json({ token, user }, 201);
});

app.post('/auth/login', async (c) => {
  const body = await c.req.json<{ username: string; password: string }>();
  if (!body.username || !body.password) {
    return c.json({ error: 'username and password are required' }, 400);
  }
  const row = await c.env.hmni_db.prepare(
    'SELECT id, username, email, password_hash, joined_at FROM users WHERE username = ?'
  ).bind(body.username).first<{ id: string; username: string; email: string; password_hash: string; joined_at: string }>();
  if (!row) {
    return c.json({ error: 'Invalid username or password' }, 401);
  }
  const valid = await verifyPassword(body.password, row.password_hash);
  if (!valid) {
    return c.json({ error: 'Invalid username or password' }, 401);
  }
  const token = await makeToken(c, row);
  const { password_hash: _, ...user } = row;
  return c.json({ token, user });
});

app.get('/auth/me', async (c) => {
  const header = c.req.header('Authorization');
  if (!header?.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  try {
    const payload = await verify(header.slice(7), c.env.JWT_SECRET, 'HS256');
    const user = await c.env.hmni_db.prepare(
      'SELECT id, username, email, joined_at FROM users WHERE id = ?'
    ).bind(payload.sub).first();
    if (!user) return c.json({ error: 'User not found' }, 404);
    return c.json(user);
  } catch {
    return c.json({ error: 'Invalid token' }, 401);
  }
});

// ---------- Photos ----------

app.post('/photos', authMiddleware, async (c) => {
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
    'SELECT * FROM designs WHERE name LIKE ?1 OR description LIKE ?1 OR text LIKE ?1 ORDER BY created_at DESC'
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
    `SELECT s.*,
       (SELECT si.photo_uri FROM sightings si WHERE si.sticker_id = s.id ORDER BY si.logged_at ASC LIMIT 1) AS photo_uri,
       (SELECT COUNT(*) FROM sightings si WHERE si.sticker_id = s.id) AS sighting_count
     FROM stickers s WHERE s.design_id = ? ORDER BY s.created_at DESC`
  ).bind(c.req.param('id')).all();
  return c.json(results);
});

app.get('/designs/:id/sightings', async (c) => {
  const { results } = await c.env.hmni_db.prepare(
    `SELECT si.*, u.username, s.latitude, s.longitude, d.name AS design_name
     FROM sightings si
     LEFT JOIN users u ON si.user_id = u.id
     LEFT JOIN stickers s ON si.sticker_id = s.id
     LEFT JOIN designs d ON si.design_id = d.id
     WHERE si.design_id = ? ORDER BY si.logged_at DESC`
  ).bind(c.req.param('id')).all();
  return c.json(results);
});

app.post('/designs', authMiddleware, async (c) => {
  const body = await c.req.json<{
    name: string;
    description?: string;
    text?: string;
    imageUrl?: string;
  }>();
  const id = `d${Date.now()}`;
  const creatorId = c.get('userId');
  await c.env.hmni_db.prepare(
    'INSERT INTO designs (id, name, description, text, image_url, creator_id) VALUES (?, ?, ?, ?, ?, ?)'
  ).bind(id, body.name, body.description ?? '', body.text ?? '', body.imageUrl ?? '', creatorId).run();
  const row = await c.env.hmni_db.prepare('SELECT * FROM designs WHERE id = ?').bind(id).first();
  return c.json(row, 201);
});

// ---------- Users ----------

app.get('/users/search', async (c) => {
  const q = c.req.query('q') ?? '';
  if (!q) return c.json([]);
  const like = `%${q}%`;
  const { results } = await c.env.hmni_db.prepare(
    `SELECT u.*, (SELECT COUNT(*) FROM sightings WHERE user_id = u.id) AS sighting_count
     FROM users u WHERE u.username LIKE ? ORDER BY u.username`
  ).bind(like).all();
  return c.json(results);
});

app.get('/users/:id', async (c) => {
  const row = await c.env.hmni_db.prepare(
    'SELECT id, username, email, joined_at FROM users WHERE id = ?'
  ).bind(c.req.param('id')).first();
  if (!row) return c.json({ error: 'Not found' }, 404);
  return c.json(row);
});

app.get('/users/:id/sightings', async (c) => {
  const { results } = await c.env.hmni_db.prepare(
    `SELECT si.*, s.latitude, s.longitude, d.name AS design_name
     FROM sightings si
     LEFT JOIN stickers s ON si.sticker_id = s.id
     LEFT JOIN designs d ON si.design_id = d.id
     WHERE si.user_id = ? ORDER BY si.logged_at DESC`
  ).bind(c.req.param('id')).all();
  return c.json(results);
});

app.get('/users/:id/designs', async (c) => {
  const { results } = await c.env.hmni_db.prepare(
    'SELECT * FROM designs WHERE creator_id = ? ORDER BY created_at DESC'
  ).bind(c.req.param('id')).all();
  return c.json(results);
});

// ---------- Stickers ----------

app.get('/stickers', async (c) => {
  const { results } = await c.env.hmni_db.prepare(
    `SELECT s.*,
       (SELECT si.photo_uri FROM sightings si WHERE si.sticker_id = s.id ORDER BY si.logged_at ASC LIMIT 1) AS photo_uri
     FROM stickers s ORDER BY s.created_at DESC`
  ).all();
  return c.json(results);
});

app.get('/stickers/:id', async (c) => {
  const sticker = await c.env.hmni_db.prepare(
    `SELECT s.*, d.name AS design_name
     FROM stickers s
     LEFT JOIN designs d ON s.design_id = d.id
     WHERE s.id = ?`
  ).bind(c.req.param('id')).first();
  if (!sticker) return c.json({ error: 'Not found' }, 404);

  const { results: sightings } = await c.env.hmni_db.prepare(
    `SELECT si.*, u.username
     FROM sightings si
     LEFT JOIN users u ON si.user_id = u.id
     WHERE si.sticker_id = ? ORDER BY si.logged_at DESC`
  ).bind(c.req.param('id')).all();

  return c.json({ ...sticker, sightings });
});

app.post('/stickers', authMiddleware, async (c) => {
  const body = await c.req.json<{
    designId: string;
    latitude: number;
    longitude: number;
    locationDescription?: string;
  }>();
  const id = `s${Date.now()}`;
  await c.env.hmni_db.prepare(
    `INSERT INTO stickers (id, design_id, latitude, longitude, location_description)
     VALUES (?, ?, ?, ?, ?)`
  ).bind(id, body.designId, body.latitude, body.longitude, body.locationDescription ?? '').run();
  const row = await c.env.hmni_db.prepare('SELECT * FROM stickers WHERE id = ?').bind(id).first();
  return c.json(row, 201);
});

// ---------- Sightings ----------

app.post('/sightings', authMiddleware, async (c) => {
  const body = await c.req.json<{
    stickerId: string;
    designId: string;
    photoUri?: string;
    note?: string;
  }>();
  const id = `si${Date.now()}`;
  const userId = c.get('userId');
  await c.env.hmni_db.prepare(
    `INSERT INTO sightings (id, sticker_id, design_id, user_id, photo_uri, note)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).bind(id, body.stickerId, body.designId, userId, body.photoUri ?? '', body.note ?? '').run();
  const row = await c.env.hmni_db.prepare('SELECT * FROM sightings WHERE id = ?').bind(id).first();
  return c.json(row, 201);
});

export default app;
