import { StateCreator } from 'zustand';
import { Bookmark, BookmarkFolder } from '@/types/quran';
import { triggerHapticFeedback } from '@/lib/utils';

export interface BookmarkSlice {
  bookmarks: Bookmark[];
  folders: BookmarkFolder[];
  addBookmark: (bookmark: Omit<Bookmark, 'id' | 'createdAt'>) => Bookmark;
  removeBookmark: (bookmarkId: string) => void;
  updateBookmark: (bookmarkId: string, updates: Partial<Bookmark>) => void;
  isBookmarked: (surahNumber: number, verseNumber: number) => boolean;
  getBookmark: (surahNumber: number, verseNumber: number) => Bookmark | undefined;
  createFolder: (name: string, color?: string) => BookmarkFolder;
  deleteFolder: (folderId: string) => void;
  addBookmarkToFolder: (bookmarkId: string, folderId: string) => void;
  removeBookmarkFromFolder: (bookmarkId: string, folderId: string) => void;
}

export const createBookmarkSlice: StateCreator<BookmarkSlice, [], [], BookmarkSlice> = (set, get) => ({
  bookmarks: [],
  folders: [],

  addBookmark: (bookmark) => {
    const newBookmark: Bookmark = {
      ...bookmark,
      id: `bookmark_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ bookmarks: [...state.bookmarks, newBookmark] }));
    triggerHapticFeedback();
    return newBookmark;
  },

  removeBookmark: (bookmarkId) => {
    set((state) => ({
      bookmarks: state.bookmarks.filter((b) => b.id !== bookmarkId),
      folders: state.folders.map(folder => ({
        ...folder,
        bookmarkIds: folder.bookmarkIds.filter(id => id !== bookmarkId),
      })),
    }));
    triggerHapticFeedback();
  },

  updateBookmark: (bookmarkId, updates) => {
    set((state) => ({
      bookmarks: state.bookmarks.map(b =>
        b.id === bookmarkId ? { ...b, ...updates } : b
      ),
    }));
  },

  isBookmarked: (surahNumber, verseNumber) => {
    return get().bookmarks.some(b => b.surahNumber === surahNumber && b.verseNumber === verseNumber);
  },

  getBookmark: (surahNumber, verseNumber) => {
    return get().bookmarks.find(b => b.surahNumber === surahNumber && b.verseNumber === verseNumber);
  },

  createFolder: (name, color = '#22C55E') => {
    const newFolder: BookmarkFolder = {
      id: `folder_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      color,
      bookmarkIds: [],
      createdAt: new Date().toISOString(),
    };
    set(state => ({ folders: [...state.folders, newFolder] }));
    return newFolder;
  },

  deleteFolder: (folderId) => {
    set(state => ({ folders: state.folders.filter(f => f.id !== folderId) }));
  },

  addBookmarkToFolder: (bookmarkId, folderId) => {
    set(state => ({
      folders: state.folders.map(folder =>
        folder.id === folderId && !folder.bookmarkIds.includes(bookmarkId)
          ? { ...folder, bookmarkIds: [...folder.bookmarkIds, bookmarkId] }
          : folder
      ),
    }));
  },

  removeBookmarkFromFolder: (bookmarkId, folderId) => {
    set(state => ({
      folders: state.folders.map(folder =>
        folder.id === folderId
          ? { ...folder, bookmarkIds: folder.bookmarkIds.filter(id => id !== bookmarkId) }
          : folder
      ),
    }));
  },
});
