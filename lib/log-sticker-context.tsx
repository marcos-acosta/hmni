import { createContext, useContext, useState, type ReactNode } from 'react';

import { createDesign, createSighting, createSticker, uploadPhoto } from './api';

interface LogStickerState {
  photoUri: string | null;
  latitude: number | null;
  longitude: number | null;
  designId: string | null;
  newDesignName: string | null;
  newDesignDescription: string | null;
  newDesignText: string | null;
  stickerId: string | null;
  locationDescription: string;
  note: string;
}

interface LogStickerContextValue extends LogStickerState {
  setPhoto: (uri: string, lat: number, lng: number) => void;
  setDesignId: (id: string) => void;
  setNewDesign: (name: string, description: string, text: string) => void;
  setStickerId: (id: string) => void;
  setLocationDescription: (locationDescription: string) => void;
  setNote: (note: string) => void;
  submit: () => Promise<{ stickerId: string }>;
  reset: () => void;
}

const initial: LogStickerState = {
  photoUri: null,
  latitude: null,
  longitude: null,
  designId: null,
  newDesignName: null,
  newDesignDescription: null,
  newDesignText: null,
  stickerId: null,
  locationDescription: '',
  note: '',
};

const LogStickerContext = createContext<LogStickerContextValue | null>(null);

export function LogStickerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LogStickerState>(initial);

  function setPhoto(uri: string, lat: number, lng: number) {
    setState((s) => ({ ...s, photoUri: uri, latitude: lat, longitude: lng }));
  }

  function setDesignId(id: string) {
    setState((s) => ({ ...s, designId: id, newDesignName: null, newDesignDescription: null, newDesignText: null }));
  }

  function setNewDesign(name: string, description: string, text: string) {
    setState((s) => ({ ...s, designId: null, newDesignName: name, newDesignDescription: description, newDesignText: text }));
  }

  function setStickerId(id: string) {
    setState((s) => ({ ...s, stickerId: id }));
  }

  function setLocationDescription(locationDescription: string) {
    setState((s) => ({ ...s, locationDescription }));
  }

  function setNote(note: string) {
    setState((s) => ({ ...s, note }));
  }

  async function submit(): Promise<{ stickerId: string }> {
    // Upload photo to R2
    let photoUrl = '';
    if (state.photoUri) {
      photoUrl = await uploadPhoto(state.photoUri);
    }

    let designId = state.designId;

    if (!designId && state.newDesignName) {
      const design = await createDesign({
        name: state.newDesignName,
        description: state.newDesignDescription || '',
        text: state.newDesignText || '',
        imageUrl: photoUrl || 'https://picsum.photos/seed/new/400/400',
      });
      designId = design.id;
    }

    let stickerId = state.stickerId;

    if (!stickerId) {
      const sticker = await createSticker({
        designId: designId!,
        latitude: state.latitude || 0,
        longitude: state.longitude || 0,
        locationName: 'Logged location',
      });
      stickerId = sticker.id;
    }

    await createSighting({
      stickerId,
      designId: designId!,
      photoUri: photoUrl,
      locationDescription: state.locationDescription,
      note: state.note,
    });

    setState(initial);
    return { stickerId };
  }

  function reset() {
    setState(initial);
  }

  return (
    <LogStickerContext.Provider
      value={{ ...state, setPhoto, setDesignId, setNewDesign, setStickerId, setLocationDescription, setNote, submit, reset }}>
      {children}
    </LogStickerContext.Provider>
  );
}

export function useLogSticker(): LogStickerContextValue {
  const ctx = useContext(LogStickerContext);
  if (!ctx) throw new Error('useLogSticker must be used within LogStickerProvider');
  return ctx;
}
