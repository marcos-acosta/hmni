import type { Design, Sticker, User } from './types';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8787';

// ---------- Photos ----------

export async function uploadPhoto(localUri: string): Promise<string> {
  const formData = new FormData();
  // React Native's FormData accepts this shape for file uploads
  formData.append('photo', {
    uri: localUri,
    type: 'image/jpeg',
    name: 'photo.jpg',
  } as unknown as Blob);

  const res = await fetch(`${BASE_URL}/photos`, {
    method: 'POST',
    body: formData,
  });
  const data: { url: string } = await res.json();
  return data.url;
}

// ---------- Row types (snake_case from D1) ----------

interface DesignRow {
  id: string;
  name: string;
  description: string;
  image_url: string;
  creator_id: string;
  created_at: string;
  creator_username?: string;
}

interface StickerRow {
  id: string;
  design_id: string;
  user_id: string;
  photo_uri: string;
  latitude: number;
  longitude: number;
  location_name: string;
  note: string;
  logged_at: string;
  design_name?: string;
  username?: string;
}

interface UserRow {
  id: string;
  username: string;
  email: string;
  joined_at: string;
  sticker_count?: number;
}

// ---------- Mappers ----------

function toDesign(r: DesignRow): Design & { creatorUsername?: string } {
  return {
    id: r.id,
    name: r.name,
    description: r.description,
    imageUrl: r.image_url,
    creatorId: r.creator_id,
    createdAt: r.created_at,
    creatorUsername: r.creator_username,
  };
}

function toSticker(r: StickerRow): Sticker & { designName?: string; username?: string } {
  return {
    id: r.id,
    designId: r.design_id,
    userId: r.user_id,
    photoUri: r.photo_uri,
    latitude: r.latitude,
    longitude: r.longitude,
    locationName: r.location_name,
    note: r.note,
    loggedAt: r.logged_at,
    designName: r.design_name,
    username: r.username,
  };
}

function toUser(r: UserRow): User & { stickerCount?: number } {
  return {
    id: r.id,
    username: r.username,
    email: r.email,
    joinedAt: r.joined_at,
    stickerCount: r.sticker_count,
  };
}

// ---------- Designs ----------

export async function fetchDesigns() {
  const res = await fetch(`${BASE_URL}/designs`);
  const rows: DesignRow[] = await res.json();
  return rows.map(toDesign);
}

export async function fetchDesign(id: string) {
  const res = await fetch(`${BASE_URL}/designs/${id}`);
  if (!res.ok) return null;
  const row: DesignRow = await res.json();
  return toDesign(row);
}

export async function fetchDesignStickers(designId: string) {
  const res = await fetch(`${BASE_URL}/designs/${designId}/stickers`);
  const rows: StickerRow[] = await res.json();
  return rows.map(toSticker);
}

export async function searchDesignsApi(query: string) {
  const res = await fetch(`${BASE_URL}/designs/search?q=${encodeURIComponent(query)}`);
  const rows: DesignRow[] = await res.json();
  return rows.map(toDesign);
}

export async function createDesign(body: {
  name: string;
  description?: string;
  imageUrl?: string;
  creatorId: string;
}) {
  const res = await fetch(`${BASE_URL}/designs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const row: DesignRow = await res.json();
  return toDesign(row);
}

// ---------- Users ----------

export async function fetchUser(id: string) {
  const res = await fetch(`${BASE_URL}/users/${id}`);
  if (!res.ok) return null;
  const row: UserRow = await res.json();
  return toUser(row);
}

export async function fetchUserStickers(userId: string) {
  const res = await fetch(`${BASE_URL}/users/${userId}/stickers`);
  const rows: StickerRow[] = await res.json();
  return rows.map(toSticker);
}

export async function fetchUserDesigns(userId: string) {
  const res = await fetch(`${BASE_URL}/users/${userId}/designs`);
  const rows: DesignRow[] = await res.json();
  return rows.map(toDesign);
}

export async function searchUsersApi(query: string) {
  const res = await fetch(`${BASE_URL}/users/search?q=${encodeURIComponent(query)}`);
  const rows: UserRow[] = await res.json();
  return rows.map(toUser);
}

export async function createUser(body: { username: string; email: string }) {
  const res = await fetch(`${BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const row: UserRow = await res.json();
  return toUser(row);
}

// ---------- Stickers ----------

export async function fetchStickers() {
  const res = await fetch(`${BASE_URL}/stickers`);
  const rows: StickerRow[] = await res.json();
  return rows.map(toSticker);
}

export async function fetchSticker(id: string) {
  const res = await fetch(`${BASE_URL}/stickers/${id}`);
  if (!res.ok) return null;
  const row: StickerRow = await res.json();
  return toSticker(row);
}

export async function createSticker(body: {
  designId: string;
  userId: string;
  photoUri?: string;
  latitude: number;
  longitude: number;
  locationName?: string;
  note?: string;
}) {
  const res = await fetch(`${BASE_URL}/stickers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const row: StickerRow = await res.json();
  return toSticker(row);
}
