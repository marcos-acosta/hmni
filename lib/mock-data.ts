import { Design, Sticker, User } from './types';

// --- Users ---

export const users: User[] = [
  {
    id: 'u1',
    username: 'stickerqueen',
    email: 'queen@example.com',
    joinedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 'u2',
    username: 'pasteupper',
    email: 'paste@example.com',
    joinedAt: '2024-02-20T00:00:00Z',
  },
  {
    id: 'u3',
    username: 'nycwalls',
    email: 'walls@example.com',
    joinedAt: '2024-03-10T00:00:00Z',
  },
  {
    id: 'u4',
    username: 'vinylhunter',
    email: 'vinyl@example.com',
    joinedAt: '2024-04-05T00:00:00Z',
  },
  {
    id: 'u5',
    username: 'bombfirst',
    email: 'bomb@example.com',
    joinedAt: '2024-05-18T00:00:00Z',
  },
  {
    id: 'u6',
    username: 'slaptag',
    email: 'slap@example.com',
    joinedAt: '2024-06-01T00:00:00Z',
  },
];

// The "current user" for the mocked auth
export const CURRENT_USER_ID = 'u1';

// --- Designs ---

export const designs: Design[] = [
  {
    id: 'd1',
    name: 'Pigeon Party',
    description: 'A flock of NYC pigeons wearing tiny party hats.',
    imageUrl: 'https://picsum.photos/seed/d1/400/400',
    creatorId: 'u1',
    createdAt: '2024-06-01T00:00:00Z',
  },
  {
    id: 'd2',
    name: 'Subway Rat',
    description: 'The iconic subway rat carrying a slice of pizza.',
    imageUrl: 'https://picsum.photos/seed/d2/400/400',
    creatorId: 'u2',
    createdAt: '2024-06-10T00:00:00Z',
  },
  {
    id: 'd3',
    name: 'Bodega Cat',
    description: 'A regal cat lounging on a deli counter.',
    imageUrl: 'https://picsum.photos/seed/d3/400/400',
    creatorId: 'u3',
    createdAt: '2024-07-01T00:00:00Z',
  },
  {
    id: 'd4',
    name: 'Fire Hydrant Bloom',
    description: 'Flowers bursting out of a fire hydrant.',
    imageUrl: 'https://picsum.photos/seed/d4/400/400',
    creatorId: 'u1',
    createdAt: '2024-07-15T00:00:00Z',
  },
  {
    id: 'd5',
    name: 'Water Tower',
    description: 'Classic NYC rooftop water tower silhouette.',
    imageUrl: 'https://picsum.photos/seed/d5/400/400',
    creatorId: 'u4',
    createdAt: '2024-08-01T00:00:00Z',
  },
  {
    id: 'd6',
    name: 'Taxi Ghost',
    description: 'A ghostly yellow cab fading into the night.',
    imageUrl: 'https://picsum.photos/seed/d6/400/400',
    creatorId: 'u5',
    createdAt: '2024-08-20T00:00:00Z',
  },
  {
    id: 'd7',
    name: 'Bridge Lines',
    description: 'Abstract lines inspired by the Brooklyn Bridge cables.',
    imageUrl: 'https://picsum.photos/seed/d7/400/400',
    creatorId: 'u3',
    createdAt: '2024-09-05T00:00:00Z',
  },
  {
    id: 'd8',
    name: 'Manhole Mandala',
    description: 'A mandala pattern based on NYC manhole covers.',
    imageUrl: 'https://picsum.photos/seed/d8/400/400',
    creatorId: 'u6',
    createdAt: '2024-09-20T00:00:00Z',
  },
  {
    id: 'd9',
    name: 'Corner Store',
    description: 'A lovingly detailed corner bodega storefront.',
    imageUrl: 'https://picsum.photos/seed/d9/400/400',
    creatorId: 'u2',
    createdAt: '2024-10-01T00:00:00Z',
  },
  {
    id: 'd10',
    name: 'Steam Vent',
    description: 'Mysterious steam rising from a street vent.',
    imageUrl: 'https://picsum.photos/seed/d10/400/400',
    creatorId: 'u4',
    createdAt: '2024-10-15T00:00:00Z',
  },
];

// --- Stickers ---

export const stickers: Sticker[] = [
  // Williamsburg
  {
    id: 's1',
    designId: 'd1',
    userId: 'u1',
    photoUri: 'https://picsum.photos/seed/s1/600/600',
    latitude: 40.7081,
    longitude: -73.9571,
    locationName: 'Bedford Ave, Williamsburg',
    note: 'Spotted on a mailbox near the L train.',
    loggedAt: '2025-01-10T14:30:00Z',
  },
  {
    id: 's2',
    designId: 'd2',
    userId: 'u2',
    photoUri: 'https://picsum.photos/seed/s2/600/600',
    latitude: 40.7143,
    longitude: -73.9614,
    locationName: 'Metropolitan Ave, Williamsburg',
    note: 'Classic pizza rat energy.',
    loggedAt: '2025-01-12T10:15:00Z',
  },
  // Lower East Side
  {
    id: 's3',
    designId: 'd3',
    userId: 'u3',
    photoUri: 'https://picsum.photos/seed/s3/600/600',
    latitude: 40.7185,
    longitude: -73.9868,
    locationName: 'Orchard St, Lower East Side',
    note: 'On the side of a bodega, of course.',
    loggedAt: '2025-01-15T16:45:00Z',
  },
  {
    id: 's4',
    designId: 'd1',
    userId: 'u4',
    photoUri: 'https://picsum.photos/seed/s4/600/600',
    latitude: 40.7203,
    longitude: -73.988,
    locationName: 'Rivington St, Lower East Side',
    note: 'Party pigeons taking over the LES.',
    loggedAt: '2025-01-18T09:00:00Z',
  },
  // East Village
  {
    id: 's5',
    designId: 'd4',
    userId: 'u1',
    photoUri: 'https://picsum.photos/seed/s5/600/600',
    latitude: 40.7265,
    longitude: -73.9815,
    locationName: 'St Marks Pl, East Village',
    note: 'Perfect placement next to an actual hydrant.',
    loggedAt: '2025-01-20T11:30:00Z',
  },
  {
    id: 's6',
    designId: 'd5',
    userId: 'u5',
    photoUri: 'https://picsum.photos/seed/s6/600/600',
    latitude: 40.7282,
    longitude: -73.9845,
    locationName: 'Tompkins Square Park',
    note: 'On a lamp post by the park.',
    loggedAt: '2025-01-22T15:00:00Z',
  },
  // SoHo
  {
    id: 's7',
    designId: 'd6',
    userId: 'u2',
    photoUri: 'https://picsum.photos/seed/s7/600/600',
    latitude: 40.7234,
    longitude: -73.9985,
    locationName: 'Broadway, SoHo',
    note: 'Ghost taxi vibes on a rainy day.',
    loggedAt: '2025-01-25T08:45:00Z',
  },
  {
    id: 's8',
    designId: 'd7',
    userId: 'u3',
    photoUri: 'https://picsum.photos/seed/s8/600/600',
    latitude: 40.7245,
    longitude: -73.9988,
    locationName: 'Prince St, SoHo',
    note: 'Bridge lines on a construction wall.',
    loggedAt: '2025-01-28T13:20:00Z',
  },
  // Bushwick
  {
    id: 's9',
    designId: 'd8',
    userId: 'u6',
    photoUri: 'https://picsum.photos/seed/s9/600/600',
    latitude: 40.6944,
    longitude: -73.9213,
    locationName: 'Troutman St, Bushwick',
    note: 'Fits right in with the murals here.',
    loggedAt: '2025-02-01T10:00:00Z',
  },
  {
    id: 's10',
    designId: 'd2',
    userId: 'u1',
    photoUri: 'https://picsum.photos/seed/s10/600/600',
    latitude: 40.6958,
    longitude: -73.9225,
    locationName: 'Jefferson St, Bushwick',
    note: 'Subway rat spotted above ground.',
    loggedAt: '2025-02-03T17:30:00Z',
  },
  // DUMBO
  {
    id: 's11',
    designId: 'd7',
    userId: 'u4',
    photoUri: 'https://picsum.photos/seed/s11/600/600',
    latitude: 40.7033,
    longitude: -73.9894,
    locationName: 'Water St, DUMBO',
    note: 'Bridge design under the actual bridge.',
    loggedAt: '2025-02-05T12:00:00Z',
  },
  {
    id: 's12',
    designId: 'd9',
    userId: 'u5',
    photoUri: 'https://picsum.photos/seed/s12/600/600',
    latitude: 40.7025,
    longitude: -73.9888,
    locationName: 'Front St, DUMBO',
    note: 'Corner store love.',
    loggedAt: '2025-02-06T14:15:00Z',
  },
  // Chelsea
  {
    id: 's13',
    designId: 'd10',
    userId: 'u6',
    photoUri: 'https://picsum.photos/seed/s13/600/600',
    latitude: 40.7465,
    longitude: -74.0014,
    locationName: 'High Line, Chelsea',
    note: 'Steam vent sticker near an actual steam vent.',
    loggedAt: '2025-02-08T09:30:00Z',
  },
  {
    id: 's14',
    designId: 'd3',
    userId: 'u2',
    photoUri: 'https://picsum.photos/seed/s14/600/600',
    latitude: 40.7472,
    longitude: -74.0005,
    locationName: '8th Ave, Chelsea',
    note: 'Bodega cat on a phone booth.',
    loggedAt: '2025-02-09T11:00:00Z',
  },
  // Chinatown
  {
    id: 's15',
    designId: 'd4',
    userId: 'u3',
    photoUri: 'https://picsum.photos/seed/s15/600/600',
    latitude: 40.7158,
    longitude: -73.997,
    locationName: 'Canal St, Chinatown',
    note: 'Hydrant bloom among the hustle.',
    loggedAt: '2025-02-10T16:00:00Z',
  },
  // Greenpoint
  {
    id: 's16',
    designId: 'd5',
    userId: 'u1',
    photoUri: 'https://picsum.photos/seed/s16/600/600',
    latitude: 40.7274,
    longitude: -73.9515,
    locationName: 'Manhattan Ave, Greenpoint',
    note: 'Water tower on a water tower wall.',
    loggedAt: '2025-02-11T10:30:00Z',
  },
  {
    id: 's17',
    designId: 'd6',
    userId: 'u4',
    photoUri: 'https://picsum.photos/seed/s17/600/600',
    latitude: 40.7285,
    longitude: -73.9508,
    locationName: 'Nassau Ave, Greenpoint',
    note: 'Ghostly cab on a quiet street.',
    loggedAt: '2025-02-11T14:00:00Z',
  },
  // Astoria
  {
    id: 's18',
    designId: 'd8',
    userId: 'u5',
    photoUri: 'https://picsum.photos/seed/s18/600/600',
    latitude: 40.7592,
    longitude: -73.9208,
    locationName: 'Steinway St, Astoria',
    note: 'Mandala manhole on a busy sidewalk.',
    loggedAt: '2025-02-12T08:00:00Z',
  },
  // Prospect Heights
  {
    id: 's19',
    designId: 'd9',
    userId: 'u6',
    photoUri: 'https://picsum.photos/seed/s19/600/600',
    latitude: 40.6775,
    longitude: -73.9692,
    locationName: 'Vanderbilt Ave, Prospect Heights',
    note: 'Fits the neighborhood perfectly.',
    loggedAt: '2025-02-12T12:45:00Z',
  },
  // Harlem
  {
    id: 's20',
    designId: 'd1',
    userId: 'u2',
    photoUri: 'https://picsum.photos/seed/s20/600/600',
    latitude: 40.8116,
    longitude: -73.9465,
    locationName: '125th St, Harlem',
    note: 'Pigeon party uptown!',
    loggedAt: '2025-02-13T09:00:00Z',
  },
  // Red Hook
  {
    id: 's21',
    designId: 'd10',
    userId: 'u3',
    photoUri: 'https://picsum.photos/seed/s21/600/600',
    latitude: 40.6734,
    longitude: -74.0083,
    locationName: 'Van Brunt St, Red Hook',
    note: 'Steam vent by the waterfront.',
    loggedAt: '2025-02-13T11:30:00Z',
  },
  // Long Island City
  {
    id: 's22',
    designId: 'd2',
    userId: 'u4',
    photoUri: 'https://picsum.photos/seed/s22/600/600',
    latitude: 40.7425,
    longitude: -73.9565,
    locationName: 'Jackson Ave, LIC',
    note: 'Pizza rat goes to Queens.',
    loggedAt: '2025-02-13T13:00:00Z',
  },
  // Fort Greene
  {
    id: 's23',
    designId: 'd3',
    userId: 'u1',
    photoUri: 'https://picsum.photos/seed/s23/600/600',
    latitude: 40.6892,
    longitude: -73.9762,
    locationName: 'DeKalb Ave, Fort Greene',
    note: 'Another bodega cat sighting.',
    loggedAt: '2025-02-13T14:30:00Z',
  },
  // Crown Heights
  {
    id: 's24',
    designId: 'd4',
    userId: 'u5',
    photoUri: 'https://picsum.photos/seed/s24/600/600',
    latitude: 40.6694,
    longitude: -73.9422,
    locationName: 'Franklin Ave, Crown Heights',
    note: 'Bloom on the block.',
    loggedAt: '2025-02-13T15:00:00Z',
  },
  // Park Slope
  {
    id: 's25',
    designId: 'd5',
    userId: 'u6',
    photoUri: 'https://picsum.photos/seed/s25/600/600',
    latitude: 40.6712,
    longitude: -73.9777,
    locationName: '5th Ave, Park Slope',
    note: 'Water tower watching over the slope.',
    loggedAt: '2025-02-13T16:00:00Z',
  },
];

// --- Helpers ---

export function getDesignById(id: string): Design | undefined {
  return designs.find((d) => d.id === id);
}

export function getStickerById(id: string): Sticker | undefined {
  return stickers.find((s) => s.id === id);
}

export function getUserById(id: string): User | undefined {
  return users.find((u) => u.id === id);
}

export function getStickersForDesign(designId: string): Sticker[] {
  return stickers.filter((s) => s.designId === designId);
}

export function getStickersForUser(userId: string): Sticker[] {
  return stickers.filter((s) => s.userId === userId);
}

export function getDesignsForUser(userId: string): Design[] {
  return designs.filter((d) => d.creatorId === userId);
}

export function searchDesigns(query: string): Design[] {
  const q = query.toLowerCase();
  return designs.filter(
    (d) => d.name.toLowerCase().includes(q) || d.description.toLowerCase().includes(q)
  );
}

export function searchUsers(query: string): User[] {
  const q = query.toLowerCase();
  return users.filter((u) => u.username.toLowerCase().includes(q));
}

let nextDesignNum = 11;
let nextStickerNum = 26;

export function addDesign(partial: Omit<Design, 'id' | 'createdAt'>): Design {
  const design: Design = {
    ...partial,
    id: `d${nextDesignNum++}`,
    createdAt: new Date().toISOString(),
  };
  designs.unshift(design);
  return design;
}

export function addSticker(partial: Omit<Sticker, 'id' | 'loggedAt'>): Sticker {
  const sticker: Sticker = {
    ...partial,
    id: `s${nextStickerNum++}`,
    loggedAt: new Date().toISOString(),
  };
  stickers.unshift(sticker);
  return sticker;
}
