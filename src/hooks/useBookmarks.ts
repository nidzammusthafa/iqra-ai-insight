import { useState, useEffect } from 'react';
import { Bookmark, BookmarkFolder } from '@/types/quran';

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [folders, setFolders] = useState<BookmarkFolder[]>([]);

  useEffect(() => {
    loadBookmarks();
    loadFolders();
  }, []);

  const loadBookmarks = () => {
    const saved = localStorage.getItem('quran_bookmarks');
    if (saved) {
      try {
        setBookmarks(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load bookmarks:', error);
      }
    }
  };

  const loadFolders = () => {
    const saved = localStorage.getItem('quran_bookmark_folders');
    if (saved) {
      try {
        setFolders(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load bookmark folders:', error);
      }
    }
  };

  const saveBookmarks = (newBookmarks: Bookmark[]) => {
    setBookmarks(newBookmarks);
    localStorage.setItem('quran_bookmarks', JSON.stringify(newBookmarks));
  };

  const saveFolders = (newFolders: BookmarkFolder[]) => {
    setFolders(newFolders);
    localStorage.setItem('quran_bookmark_folders', JSON.stringify(newFolders));
  };

  const addBookmark = (bookmark: Omit<Bookmark, 'id' | 'createdAt'>) => {
    const newBookmark: Bookmark = {
      ...bookmark,
      id: `bookmark_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    };
    
    const newBookmarks = [...bookmarks, newBookmark];
    saveBookmarks(newBookmarks);
    return newBookmark;
  };

  const removeBookmark = (bookmarkId: string) => {
    const newBookmarks = bookmarks.filter(b => b.id !== bookmarkId);
    saveBookmarks(newBookmarks);
    
    // Also remove from folders
    const newFolders = folders.map(folder => ({
      ...folder,
      bookmarkIds: folder.bookmarkIds.filter(id => id !== bookmarkId)
    }));
    saveFolders(newFolders);
  };

  const updateBookmark = (bookmarkId: string, updates: Partial<Bookmark>) => {
    const newBookmarks = bookmarks.map(b => 
      b.id === bookmarkId ? { ...b, ...updates } : b
    );
    saveBookmarks(newBookmarks);
  };

  const isBookmarked = (surahNumber: number, verseNumber: number) => {
    return bookmarks.some(b => 
      b.surahNumber === surahNumber && b.verseNumber === verseNumber
    );
  };

  const getBookmark = (surahNumber: number, verseNumber: number) => {
    return bookmarks.find(b => 
      b.surahNumber === surahNumber && b.verseNumber === verseNumber
    );
  };

  const createFolder = (name: string, color: string = '#22C55E') => {
    const newFolder: BookmarkFolder = {
      id: `folder_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      color,
      bookmarkIds: [],
      createdAt: new Date().toISOString()
    };
    
    const newFolders = [...folders, newFolder];
    saveFolders(newFolders);
    return newFolder;
  };

  const deleteFolder = (folderId: string) => {
    const newFolders = folders.filter(f => f.id !== folderId);
    saveFolders(newFolders);
  };

  const addBookmarkToFolder = (bookmarkId: string, folderId: string) => {
    const newFolders = folders.map(folder => 
      folder.id === folderId && !folder.bookmarkIds.includes(bookmarkId)
        ? { ...folder, bookmarkIds: [...folder.bookmarkIds, bookmarkId] }
        : folder
    );
    saveFolders(newFolders);
  };

  const removeBookmarkFromFolder = (bookmarkId: string, folderId: string) => {
    const newFolders = folders.map(folder => 
      folder.id === folderId
        ? { ...folder, bookmarkIds: folder.bookmarkIds.filter(id => id !== bookmarkId) }
        : folder
    );
    saveFolders(newFolders);
  };

  const getBookmarksByFolder = (folderId: string) => {
    const folder = folders.find(f => f.id === folderId);
    if (!folder) return [];
    
    return bookmarks.filter(bookmark => folder.bookmarkIds.includes(bookmark.id));
  };

  const searchBookmarks = (query: string) => {
    const lowerQuery = query.toLowerCase();
    return bookmarks.filter(bookmark =>
      bookmark.verseText.toLowerCase().includes(lowerQuery) ||
      bookmark.verseTranslation.toLowerCase().includes(lowerQuery) ||
      bookmark.surahName.toLowerCase().includes(lowerQuery) ||
      bookmark.note?.toLowerCase().includes(lowerQuery) ||
      bookmark.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  };

  return {
    bookmarks,
    folders,
    addBookmark,
    removeBookmark,
    updateBookmark,
    isBookmarked,
    getBookmark,
    createFolder,
    deleteFolder,
    addBookmarkToFolder,
    removeBookmarkFromFolder,
    getBookmarksByFolder,
    searchBookmarks
  };
};