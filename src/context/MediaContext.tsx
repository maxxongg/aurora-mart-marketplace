import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export interface MediaItem {
  id: string;
  name: string;
  data: string; // base64
  width: number;
  height: number;
  fileSize: number;
  type: string;
  preset: string;
  createdAt: string;
}

interface MediaContextType {
  items: MediaItem[];
  addItem: (item: Omit<MediaItem, "id" | "createdAt">) => MediaItem;
  deleteItem: (id: string) => void;
  getItemUrl: (id: string) => string | undefined;
}

const MediaContext = createContext<MediaContextType | null>(null);

function genId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

function loadMedia(): MediaItem[] {
  try {
    const raw = localStorage.getItem("media_library");
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveMedia(items: MediaItem[]) {
  try {
    localStorage.setItem("media_library", JSON.stringify(items));
  } catch (e) {
    console.warn("Media library storage full:", e);
  }
}

export function MediaProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<MediaItem[]>(() => loadMedia());

  const addItem = useCallback((item: Omit<MediaItem, "id" | "createdAt">) => {
    const newItem: MediaItem = { ...item, id: genId(), createdAt: new Date().toISOString() };
    setItems((prev) => {
      const next = [newItem, ...prev];
      saveMedia(next);
      return next;
    });
    return newItem;
  }, []);

  const deleteItem = useCallback((id: string) => {
    setItems((prev) => {
      const next = prev.filter((x) => x.id !== id);
      saveMedia(next);
      return next;
    });
  }, []);

  const getItemUrl = useCallback((id: string) => {
    const item = items.find((x) => x.id === id);
    return item?.data;
  }, [items]);

  return (
    <MediaContext.Provider value={{ items, addItem, deleteItem, getItemUrl }}>
      {children}
    </MediaContext.Provider>
  );
}

export function useMedia() {
  const ctx = useContext(MediaContext);
  if (!ctx) throw new Error("useMedia must be used within MediaProvider");
  return ctx;
}
