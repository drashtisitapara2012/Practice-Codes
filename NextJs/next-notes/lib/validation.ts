// Email validation
export function validateEmail(email: string): { isValid: boolean; error?: string } {
  if (!email || email.trim().length === 0) {
    return { isValid: false, error: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Invalid email format' };
  }

  if (email.length > 255) {
    return { isValid: false, error: 'Email is too long' };
  }

  return { isValid: true };
}

// Note validation
export function validateNote(title: string, content: string): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!title || title.trim().length === 0) {
    errors.title = 'Title is required';
  } else if (title.length < 3) {
    errors.title = 'Title must be at least 3 characters';
  } else if (title.length > 200) {
    errors.title = 'Title must be less than 200 characters';
  }

  if (!content || content.trim().length === 0) {
    errors.content = 'Content is required';
  } else if (content.length < 10) {
    errors.content = 'Content must be at least 10 characters';
  } else if (content.length > 10000) {
    errors.content = 'Content must be less than 10000 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

// Search query validation
export function validateSearchQuery(query: string): { isValid: boolean; sanitized: string } {
  if (!query) {
    return { isValid: true, sanitized: '' };
  }

  const sanitized = query.trim().substring(0, 100);

  if (sanitized.length < 1) {
    return { isValid: false, sanitized: '' };
  }

  return { isValid: true, sanitized };
}

// Pagination validation
export function validatePageNumber(page: unknown): { isValid: boolean; page: number } {
  const pageNum = Number(page);

  if (isNaN(pageNum) || pageNum < 1) {
    return { isValid: false, page: 1 };
  }

  return { isValid: true, page: pageNum };
}

// Note ID validation
export function validateNoteId(id: unknown): { isValid: boolean; id?: number } {
  const noteId = Number(id);

  if (isNaN(noteId) || noteId < 1) {
    return { isValid: false };
  }

  return { isValid: true, id: noteId };
}
