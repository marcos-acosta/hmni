import { createContext, useContext, useState, type ReactNode } from 'react';

import { createDesign, createSticker } from './api';
import type { Sticker } from './types';

interface LogStickerState {
  photoUri: string | null;
  latitude: number | null;
  longitude: number | null;
  designId: string | null;
  newDesignName: string | null;
  newDesignDescription: string | null;
  note: string;
}

interface LogStickerContextValue extends LogStickerState {
  setPhoto: (uri: string, lat: number, lng: number) => void;
  setDesignId: (id: string) => void;
  setNewDesign: (name: string, description: string) => void;
  setNote: (note: string) => void;
  submit: (userId: string) => Promise<Sticker>;
  reset: () => void;
}

const initial: LogStickerState = {
  photoUri: null,
  latitude: null,
  longitude: null,
  designId: null,
  newDesignName: null,
  newDesignDescription: null,
  note: '',
};

const LogStickerContext = createContext<LogStickerContextValue | null>(null);

export function LogStickerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LogStickerState>(initial);

  function setPhoto(uri: string, lat: number, lng: number) {
    setState((s) => ({ ...s, photoUri: uri, latitude: lat, longitude: lng }));
  }

  function setDesignId(id: string) {
    setState((s) => ({ ...s, designId: id, newDesignName: null, newDesignDescription: null }));
  }

  function setNewDesign(name: string, description: string) {
    setState((s) => ({ ...s, designId: null, newDesignName: name, newDesignDescription: description }));
  }

  function setNote(note: string) {
    setState((s) => ({ ...s, note }));
  }

  async function submit(userId: string): Promise<Sticker> {
    let designId = state.designId;

    if (!designId && state.newDesignName) {
      const design = await createDesign({
        name: state.newDesignName,
        description: state.newDesignDescription || '',
        imageUrl: state.photoUri || 'https://picsum.photos/seed/new/400/400',
        creatorId: userId,
      });
      designId = design.id;
    }

    const sticker = await createSticker({
      designId: designId!,
      userId,
      photoUri: state.photoUri || '',
      latitude: state.latitude || 0,
      longitude: state.longitude || 0,
      locationName: 'Logged location',
      note: state.note,
    });

    setState(initial);
    return sticker;
  }

  function reset() {
    setState(initial);
  }

  return (
    <LogStickerContext.Provider
      value={{ ...state, setPhoto, setDesignId, setNewDesign, setNote, submit, reset }}>
      {children}
    </LogStickerContext.Provider>
  );
}

export function useLogSticker(): LogStickerContextValue {
  const ctx = useContext(LogStickerContext);
  if (!ctx) throw new Error('useLogSticker must be used within LogStickerProvider');
  return ctx;
}
