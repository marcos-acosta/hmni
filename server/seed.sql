INSERT INTO users (id, username, email, joined_at) VALUES
  ('u1', 'stickerqueen', 'queen@example.com', '2024-01-15T00:00:00Z'),
  ('u2', 'pasteupper',   'paste@example.com', '2024-02-20T00:00:00Z'),
  ('u3', 'nycwalls',     'walls@example.com', '2024-03-10T00:00:00Z'),
  ('u4', 'vinylhunter',  'vinyl@example.com', '2024-04-05T00:00:00Z'),
  ('u5', 'bombfirst',    'bomb@example.com',  '2024-05-18T00:00:00Z'),
  ('u6', 'slaptag',      'slap@example.com',  '2024-06-01T00:00:00Z');

INSERT INTO designs (id, name, description, image_url, creator_id, created_at) VALUES
  ('d1',  'Pigeon Party',       'A flock of NYC pigeons wearing tiny party hats.',          'https://picsum.photos/seed/d1/400/400',  'u1', '2024-06-01T00:00:00Z'),
  ('d2',  'Subway Rat',         'The iconic subway rat carrying a slice of pizza.',          'https://picsum.photos/seed/d2/400/400',  'u2', '2024-06-10T00:00:00Z'),
  ('d3',  'Bodega Cat',         'A regal cat lounging on a deli counter.',                   'https://picsum.photos/seed/d3/400/400',  'u3', '2024-07-01T00:00:00Z'),
  ('d4',  'Fire Hydrant Bloom', 'Flowers bursting out of a fire hydrant.',                   'https://picsum.photos/seed/d4/400/400',  'u1', '2024-07-15T00:00:00Z'),
  ('d5',  'Water Tower',        'Classic NYC rooftop water tower silhouette.',                'https://picsum.photos/seed/d5/400/400',  'u4', '2024-08-01T00:00:00Z'),
  ('d6',  'Taxi Ghost',         'A ghostly yellow cab fading into the night.',                'https://picsum.photos/seed/d6/400/400',  'u5', '2024-08-20T00:00:00Z'),
  ('d7',  'Bridge Lines',       'Abstract lines inspired by the Brooklyn Bridge cables.',    'https://picsum.photos/seed/d7/400/400',  'u3', '2024-09-05T00:00:00Z'),
  ('d8',  'Manhole Mandala',    'A mandala pattern based on NYC manhole covers.',             'https://picsum.photos/seed/d8/400/400',  'u6', '2024-09-20T00:00:00Z'),
  ('d9',  'Corner Store',       'A lovingly detailed corner bodega storefront.',              'https://picsum.photos/seed/d9/400/400',  'u2', '2024-10-01T00:00:00Z'),
  ('d10', 'Steam Vent',         'Mysterious steam rising from a street vent.',                'https://picsum.photos/seed/d10/400/400', 'u4', '2024-10-15T00:00:00Z');

INSERT INTO stickers (id, design_id, latitude, longitude, location_name, created_at) VALUES
  ('s1',  'd1',  40.7081, -73.9571, 'Bedford Ave, Williamsburg',       '2025-01-10T14:30:00Z'),
  ('s2',  'd2',  40.7143, -73.9614, 'Metropolitan Ave, Williamsburg',  '2025-01-12T10:15:00Z'),
  ('s3',  'd3',  40.7185, -73.9868, 'Orchard St, Lower East Side',     '2025-01-15T16:45:00Z'),
  ('s4',  'd1',  40.7203, -73.9880, 'Rivington St, Lower East Side',   '2025-01-18T09:00:00Z'),
  ('s5',  'd4',  40.7265, -73.9815, 'St Marks Pl, East Village',       '2025-01-20T11:30:00Z'),
  ('s6',  'd5',  40.7282, -73.9845, 'Tompkins Square Park',            '2025-01-22T15:00:00Z'),
  ('s7',  'd6',  40.7234, -73.9985, 'Broadway, SoHo',                  '2025-01-25T08:45:00Z'),
  ('s8',  'd7',  40.7245, -73.9988, 'Prince St, SoHo',                 '2025-01-28T13:20:00Z'),
  ('s9',  'd8',  40.6944, -73.9213, 'Troutman St, Bushwick',           '2025-02-01T10:00:00Z'),
  ('s10', 'd2',  40.6958, -73.9225, 'Jefferson St, Bushwick',          '2025-02-03T17:30:00Z'),
  ('s11', 'd7',  40.7033, -73.9894, 'Water St, DUMBO',                 '2025-02-05T12:00:00Z'),
  ('s12', 'd9',  40.7025, -73.9888, 'Front St, DUMBO',                 '2025-02-06T14:15:00Z'),
  ('s13', 'd10', 40.7465, -74.0014, 'High Line, Chelsea',              '2025-02-08T09:30:00Z'),
  ('s14', 'd3',  40.7472, -74.0005, '8th Ave, Chelsea',                '2025-02-09T11:00:00Z'),
  ('s15', 'd4',  40.7158, -73.9970, 'Canal St, Chinatown',             '2025-02-10T16:00:00Z'),
  ('s16', 'd5',  40.7274, -73.9515, 'Manhattan Ave, Greenpoint',       '2025-02-11T10:30:00Z'),
  ('s17', 'd6',  40.7285, -73.9508, 'Nassau Ave, Greenpoint',          '2025-02-11T14:00:00Z'),
  ('s18', 'd8',  40.7592, -73.9208, 'Steinway St, Astoria',            '2025-02-12T08:00:00Z'),
  ('s19', 'd9',  40.6775, -73.9692, 'Vanderbilt Ave, Prospect Heights','2025-02-12T12:45:00Z'),
  ('s20', 'd1',  40.8116, -73.9465, '125th St, Harlem',                '2025-02-13T09:00:00Z'),
  ('s21', 'd10', 40.6734, -74.0083, 'Van Brunt St, Red Hook',          '2025-02-13T11:30:00Z'),
  ('s22', 'd2',  40.7425, -73.9565, 'Jackson Ave, LIC',                '2025-02-13T13:00:00Z'),
  ('s23', 'd3',  40.6892, -73.9762, 'DeKalb Ave, Fort Greene',         '2025-02-13T14:30:00Z'),
  ('s24', 'd4',  40.6694, -73.9422, 'Franklin Ave, Crown Heights',     '2025-02-13T15:00:00Z'),
  ('s25', 'd5',  40.6712, -73.9777, '5th Ave, Park Slope',             '2025-02-13T16:00:00Z');

-- One sighting per sticker (original spotter)
INSERT INTO sightings (id, sticker_id, design_id, user_id, photo_uri, note, logged_at) VALUES
  ('si1',  's1',  'd1',  'u1', 'https://picsum.photos/seed/s1/600/600',  'Spotted on a mailbox near the L train.',      '2025-01-10T14:30:00Z'),
  ('si2',  's2',  'd2',  'u2', 'https://picsum.photos/seed/s2/600/600',  'Classic pizza rat energy.',                    '2025-01-12T10:15:00Z'),
  ('si3',  's3',  'd3',  'u3', 'https://picsum.photos/seed/s3/600/600',  'On the side of a bodega, of course.',          '2025-01-15T16:45:00Z'),
  ('si4',  's4',  'd1',  'u4', 'https://picsum.photos/seed/s4/600/600',  'Party pigeons taking over the LES.',           '2025-01-18T09:00:00Z'),
  ('si5',  's5',  'd4',  'u1', 'https://picsum.photos/seed/s5/600/600',  'Perfect placement next to an actual hydrant.', '2025-01-20T11:30:00Z'),
  ('si6',  's6',  'd5',  'u5', 'https://picsum.photos/seed/s6/600/600',  'On a lamp post by the park.',                  '2025-01-22T15:00:00Z'),
  ('si7',  's7',  'd6',  'u2', 'https://picsum.photos/seed/s7/600/600',  'Ghost taxi vibes on a rainy day.',             '2025-01-25T08:45:00Z'),
  ('si8',  's8',  'd7',  'u3', 'https://picsum.photos/seed/s8/600/600',  'Bridge lines on a construction wall.',         '2025-01-28T13:20:00Z'),
  ('si9',  's9',  'd8',  'u6', 'https://picsum.photos/seed/s9/600/600',  'Fits right in with the murals here.',          '2025-02-01T10:00:00Z'),
  ('si10', 's10', 'd2',  'u1', 'https://picsum.photos/seed/s10/600/600', 'Subway rat spotted above ground.',             '2025-02-03T17:30:00Z'),
  ('si11', 's11', 'd7',  'u4', 'https://picsum.photos/seed/s11/600/600', 'Bridge design under the actual bridge.',       '2025-02-05T12:00:00Z'),
  ('si12', 's12', 'd9',  'u5', 'https://picsum.photos/seed/s12/600/600', 'Corner store love.',                           '2025-02-06T14:15:00Z'),
  ('si13', 's13', 'd10', 'u6', 'https://picsum.photos/seed/s13/600/600', 'Steam vent sticker near an actual steam vent.','2025-02-08T09:30:00Z'),
  ('si14', 's14', 'd3',  'u2', 'https://picsum.photos/seed/s14/600/600', 'Bodega cat on a phone booth.',                 '2025-02-09T11:00:00Z'),
  ('si15', 's15', 'd4',  'u3', 'https://picsum.photos/seed/s15/600/600', 'Hydrant bloom among the hustle.',              '2025-02-10T16:00:00Z'),
  ('si16', 's16', 'd5',  'u1', 'https://picsum.photos/seed/s16/600/600', 'Water tower on a water tower wall.',           '2025-02-11T10:30:00Z'),
  ('si17', 's17', 'd6',  'u4', 'https://picsum.photos/seed/s17/600/600', 'Ghostly cab on a quiet street.',               '2025-02-11T14:00:00Z'),
  ('si18', 's18', 'd8',  'u5', 'https://picsum.photos/seed/s18/600/600', 'Mandala manhole on a busy sidewalk.',          '2025-02-12T08:00:00Z'),
  ('si19', 's19', 'd9',  'u6', 'https://picsum.photos/seed/s19/600/600', 'Fits the neighborhood perfectly.',             '2025-02-12T12:45:00Z'),
  ('si20', 's20', 'd1',  'u2', 'https://picsum.photos/seed/s20/600/600', 'Pigeon party uptown!',                         '2025-02-13T09:00:00Z'),
  ('si21', 's21', 'd10', 'u3', 'https://picsum.photos/seed/s21/600/600', 'Steam vent by the waterfront.',                '2025-02-13T11:30:00Z'),
  ('si22', 's22', 'd2',  'u4', 'https://picsum.photos/seed/s22/600/600', 'Pizza rat goes to Queens.',                    '2025-02-13T13:00:00Z'),
  ('si23', 's23', 'd3',  'u1', 'https://picsum.photos/seed/s23/600/600', 'Another bodega cat sighting.',                 '2025-02-13T14:30:00Z'),
  ('si24', 's24', 'd4',  'u5', 'https://picsum.photos/seed/s24/600/600', 'Bloom on the block.',                          '2025-02-13T15:00:00Z'),
  ('si25', 's25', 'd5',  'u6', 'https://picsum.photos/seed/s25/600/600', 'Water tower watching over the slope.',          '2025-02-13T16:00:00Z');

-- Extra sightings on existing stickers (multi-sighting demo)
INSERT INTO sightings (id, sticker_id, design_id, user_id, photo_uri, note, logged_at) VALUES
  ('si26', 's1', 'd1', 'u3', 'https://picsum.photos/seed/si26/600/600', 'Still there months later!',           '2025-02-14T10:00:00Z'),
  ('si27', 's4', 'd1', 'u5', 'https://picsum.photos/seed/si27/600/600', 'Walked past this one on my way home.','2025-02-14T12:00:00Z'),
  ('si28', 's7', 'd6', 'u6', 'https://picsum.photos/seed/si28/600/600', 'Caught the ghost cab at sunset.',     '2025-02-14T15:00:00Z');
