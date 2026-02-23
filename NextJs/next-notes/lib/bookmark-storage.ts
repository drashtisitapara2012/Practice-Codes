// Shared bookmark storage - used by both API routes and server actions
// This ensures all parts of the app use the same data

import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

type Bookmark = {
  id: number;
  userEmail: string;
  noteId: number;
};

// File path for persistent storage
const BOOKMARKS_FILE = join(process.cwd(), 'data', 'bookmarks.json');

// Ensure data directory exists
import { mkdirSync } from 'fs';
const dataDir = join(process.cwd(), 'data');
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

// Load bookmarks from file or initialize empty array
let bookmarks: Bookmark[] = [];
let bookmarkIdCounter = 1;

function loadBookmarks() {
  try {
    if (existsSync(BOOKMARKS_FILE)) {
      const data = readFileSync(BOOKMARKS_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      bookmarks = parsed.bookmarks || [];
      bookmarkIdCounter = parsed.nextId || 1;
      console.log(` Loaded ${bookmarks.length} bookmarks from storage`);
    } else {
      bookmarks = [];
      bookmarkIdCounter = 1;
      console.log('No bookmarks file found, starting fresh');
    }
  } catch (error) {
    console.error('Error loading bookmarks:', error);
    bookmarks = [];
    bookmarkIdCounter = 1;
  }
}

function saveBookmarks() {
  try {
    const data = {
      bookmarks,
      nextId: bookmarkIdCounter
    };
    writeFileSync(BOOKMARKS_FILE, JSON.stringify(data, null, 2));
    console.log(` Saved ${bookmarks.length} bookmarks to storage`);
  } catch (error) {
    console.error('Error saving bookmarks:', error);
  }
}

// Load bookmarks on module initialization
loadBookmarks();

export function getBookmarksByUser(userEmail: string): number[] {
  const userBookmarks = bookmarks
    .filter((b) => b.userEmail === userEmail)
    .map((b) => b.noteId);
  
  console.log(`getBookmarksByUser called for ${userEmail}:`, userBookmarks);
  console.log('All bookmarks in storage:', bookmarks);
  
  return userBookmarks;
}

export function addBookmark(userEmail: string, noteId: number): boolean {
  const existing = bookmarks.find(
    (b) => b.userEmail === userEmail && b.noteId === noteId
  );

  if (existing) {
    return false;
  }

  bookmarks.push({
    id: bookmarkIdCounter++,
    userEmail,
    noteId,
  });

  console.log(` Bookmark added: ${userEmail} -> note ${noteId}`);
  console.log(`Total bookmarks: ${bookmarks.length}`);
  
  // Save to persistent storage
  saveBookmarks();
  
  return true;
}

export function removeBookmark(userEmail: string, noteId: number): boolean {
  const index = bookmarks.findIndex(
    (b) => b.userEmail === userEmail && b.noteId === noteId
  );

  if (index === -1) {
    return false;
  }

  bookmarks.splice(index, 1);
  
  console.log(`Bookmark removed: ${userEmail} -> note ${noteId}`);
  console.log(`Total bookmarks: ${bookmarks.length}`);
  
  // Save to persistent storage
  saveBookmarks();
  
  return true;
}

export function hasBookmark(userEmail: string, noteId: number): boolean {
  return bookmarks.some(
    (b) => b.userEmail === userEmail && b.noteId === noteId
  );
}

// For debugging
export function getAllBookmarks() {
  return bookmarks;
}