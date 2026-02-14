import * as SecureStore from 'expo-secure-store';

import type { Design, Sighting, Sticker, User } from './types';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8787';
const TOKEN_KEY = 'auth_token';

let authToken: string | null = null;

export async function setAuthToken(token: string) {
  authToken = token;
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function loadAuthToken(): Promise<string | null> {
  authToken = await SecureStore.getItemAsync(TOKEN_KEY);
  return authToken;
}

export async function clearAuthToken() {
  authToken = null;
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

function authHeaders(): Record<string, string> {
  if (!authToken) return {};
  return { Authorization: `Bearer ${authToken}` };
}

// ---------- Auth ----------

export async function apiLogin(username: string, password: string): Promise<{ token: string; user: User }> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Login failed');
  }
  const data = await res.json();
  return { token: data.token, user: toUser(data.user) };
}

export async function apiSignup(username: string, email: string, password: string): Promise<{ token: string; user: User }> {
  const res = await fetch(`${BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Signup failed');
  }
  const data = await res.json();
  return { token: data.token, user: toUser(data.user) };
}

export async function apiGetMe(): Promise<User> {
  const res = await fetch(`${BASE_URL}/auth/me`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Session expired');
  const row: UserRow = await res.json();
  return toUser(row);
}

// ---------- Photos ----------

export async function uploadPhoto(localUri: string): Promise<string> {
  const formData = new FormData();
  formData.append('photo', {
    uri: localUri,
    type: 'image/jpeg',
    name: 'photo.jpg',
  } as unknown as Blob);

  const res = await fetch(`${BASE_URL}/photos`, {
    method: 'POST',
    headers: authHeaders(),
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
  location_description: string;
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
  note: string;
  logged_at: string;
  username?: string;
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
    locationDescription: r.location_description,
    createdAt: r.created_at,
    photoUri: r.photo_uri,
    sightingCount: r.sighting_count,
    designName: r.design_name,
  };
}

function toSighting(r: SightingRow): Sighting & {
  username?: string;
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
    note: r.note,
    loggedAt: r.logged_at,
    username: r.username,
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
}) {
  const res = await fetch(`${BASE_URL}/designs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
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
  locationDescription?: string;
}) {
  const res = await fetch(`${BASE_URL}/stickers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(body),
  });
  const row: StickerRow = await res.json();
  return toSticker(row);
}

// ---------- Sightings ----------

export async function createSighting(body: {
  stickerId: string;
  designId: string;
  photoUri?: string;
  note?: string;
}) {
  const res = await fetch(`${BASE_URL}/sightings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(body),
  });
  const row: SightingRow = await res.json();
  return toSighting(row);
}
