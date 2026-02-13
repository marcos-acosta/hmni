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
  imageUrl: string; // placeholder URL
  creatorId: string;
  createdAt: string; // ISO date
}

export interface Sticker {
  id: string;
  designId: string;
  userId: string;
  photoUri: string; // placeholder URL
  latitude: number;
  longitude: number;
  locationName: string;
  note: string;
  loggedAt: string; // ISO date
}
