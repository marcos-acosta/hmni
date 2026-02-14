import type { Design, Sighting, Sticker, User } from './types';

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
  text: string;
  image_url: string;
  creator_id: string;
  created_at: string;
  creator_username?: string;
}

interface StickerRow {
  id: string;
  design_id: string;
  latitude: number;
  longitude: number;
  location_name: string;
  created_at: string;
  photo_uri?: string;
  sighting_count?: number;
  design_name?: string;
}

interface SightingRow {
  id: string;
  sticker_id: string;
  design_id: string;
  user_id: string;
  photo_uri: string;
  location_description: string;
  note: string;
  logged_at: string;
  username?: string;
  location_name?: string;
  latitude?: number;
  longitude?: number;
  design_name?: string;
}

interface UserRow {
  id: string;
  username: string;
  email: string;
  joined_at: string;
  sighting_count?: number;
}

// ---------- Mappers ----------

function toDesign(r: DesignRow): Design & { creatorUsername?: string } {
  return {
    id: r.id,
    name: r.name,
    description: r.description,
    text: r.text,
    imageUrl: r.image_url,
    creatorId: r.creator_id,
    createdAt: r.created_at,
    creatorUsername: r.creator_username,
  };
}

function toSticker(r: StickerRow): Sticker & { photoUri?: string; sightingCount?: number; designName?: string } {
  return {
    id: r.id,
    designId: r.design_id,
    latitude: r.latitude,
    longitude: r.longitude,
    locationName: r.location_name,
    createdAt: r.created_at,
    photoUri: r.photo_uri,
    sightingCount: r.sighting_count,
    designName: r.design_name,
  };
}

function toSighting(r: SightingRow): Sighting & {
  username?: string;
  locationName?: string;
  latitude?: number;
  longitude?: number;
  designName?: string;
} {
  return {
    id: r.id,
    stickerId: r.sticker_id,
    designId: r.design_id,
    userId: r.user_id,
    photoUri: r.photo_uri,
    locationDescription: r.location_description,
    note: r.note,
    loggedAt: r.logged_at,
    username: r.username,
    locationName: r.location_name,
    latitude: r.latitude,
    longitude: r.longitude,
    designName: r.design_name,
  };
}

function toUser(r: UserRow): User & { sightingCount?: number } {
  return {
    id: r.id,
    username: r.username,
    email: r.email,
    joinedAt: r.joined_at,
    sightingCount: r.sighting_count,
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

export async function fetchDesignSightings(designId: string) {
  const res = await fetch(`${BASE_URL}/designs/${designId}/sightings`);
  const rows: SightingRow[] = await res.json();
  return rows.map(toSighting);
}

export async function searchDesignsApi(query: string) {
  const res = await fetch(`${BASE_URL}/designs/search?q=${encodeURIComponent(query)}`);
  const rows: DesignRow[] = await res.json();
  return rows.map(toDesign);
}

export async function createDesign(body: {
  name: string;
  description?: string;
  text?: string;
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

export async function fetchUserSightings(userId: string) {
  const res = await fetch(`${BASE_URL}/users/${userId}/sightings`);
  const rows: SightingRow[] = await res.json();
  return rows.map(toSighting);
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
  const data: StickerRow & { sightings: SightingRow[] } = await res.json();
  const { sightings: sightingRows, ...stickerRow } = data;
  return {
    ...toSticker(stickerRow),
    sightings: sightingRows.map(toSighting),
  };
}

export async function createSticker(body: {
  designId: string;
  latitude: number;
  longitude: number;
  locationName?: string;
}) {
  const res = await fetch(`${BASE_URL}/stickers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const row: StickerRow = await res.json();
  return toSticker(row);
}

// ---------- Sightings ----------

export async function createSighting(body: {
  stickerId: string;
  designId: string;
  userId: string;
  photoUri?: string;
  locationDescription?: string;
  note?: string;
}) {
  const res = await fetch(`${BASE_URL}/sightings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const row: SightingRow = await res.json();
  return toSighting(row);
}
