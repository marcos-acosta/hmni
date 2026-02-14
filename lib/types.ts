export interface User {
  id: string;
  username: string;
  email: string;
  joinedAt: string; // ISO date
}

export interface Design {
  id: string;
  name: string;
  description: string;
  text: string;
  imageUrl: string; // placeholder URL
  creatorId: string;
  createdAt: string; // ISO date
}

export interface Sticker {
  id: string;
  designId: string;
  latitude: number;
  longitude: number;
  locationDescription: string;
  createdAt: string; // ISO date
}

export interface Sighting {
  id: string;
  stickerId: string;
  designId: string;
  userId: string;
  photoUri: string;
  note: string;
  loggedAt: string; // ISO date
}
