import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-config';
import { 
  getBookmarksByUser, 
  addBookmark, 
  removeBookmark,
  getAllBookmarks
} from '@/lib/bookmark-storage';

export async function GET(request: NextRequest) {
  try {
    console.log(' GET /api/bookmarks - Checking session...');
    
    const session = await getServerSession(authOptions);
    
    console.log(' Session data:', JSON.stringify(session, null, 2));
    
    if (!session?.user?.email) {
      console.error(' No session or email found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userEmail = session.user.email;
    const bookmarks = getBookmarksByUser(userEmail);

    console.log(` GET bookmarks for ${userEmail}:`, bookmarks);
    console.log(` Available bookmarks in storage:`, getAllBookmarks());

    return NextResponse.json(
      { bookmarks },
      { 
        headers: { 
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        } 
      }
    );
  } catch (error) {
    console.error(' GET /api/bookmarks error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookmarks' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/bookmarks - Checking session...');
    
    const session = await getServerSession(authOptions);
    
    console.log('Session data:', JSON.stringify(session, null, 2));
    
    if (!session?.user?.email) {
      console.error('No session or email found - User not logged in');
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' }, 
        { status: 401 }
      );
    }

    const userEmail = session.user.email;
    const body = await request.json();
    const noteId = Number(body.noteId);

    console.log(`POST bookmark: user=${userEmail}, noteId=${noteId}`);

    if (!noteId || isNaN(noteId)) {
      console.error('Invalid note ID:', body.noteId);
      return NextResponse.json(
        { error: 'Valid note ID is required' },
        { status: 400 }
      );
    }

    const success = addBookmark(userEmail, noteId);
    
    if (!success) {
      console.log('Already bookmarked');
      return NextResponse.json(
        { error: 'Already bookmarked' },
        { status: 409 }
      );
    }

    console.log('Bookmark added successfully');
    
    return NextResponse.json(
      { success: true, noteId },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/bookmarks error:', error);
    return NextResponse.json(
      { error: 'Failed to add bookmark' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    console.log('DELETE /api/bookmarks - Checking session...');
    
    const session = await getServerSession(authOptions);
    
    console.log('Session data:', JSON.stringify(session, null, 2));
    
    if (!session?.user?.email) {
      console.error('No session or email found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userEmail = session.user.email;
    const { searchParams } = new URL(request.url);
    const noteId = Number(searchParams.get('noteId'));

    console.log(`DELETE bookmark: user=${userEmail}, noteId=${noteId}`);

    if (!noteId || isNaN(noteId)) {
      console.error('Invalid note ID');
      return NextResponse.json(
        { error: 'Valid note ID is required' },
        { status: 400 }
      );
    }

    const success = removeBookmark(userEmail, noteId);
    
    if (!success) {
      console.log('Bookmark not found');
      return NextResponse.json(
        { error: 'Bookmark not found' },
        { status: 404 }
      );
    }

    console.log('Bookmark removed successfully');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/bookmarks error:', error);
    return NextResponse.json(
      { error: 'Failed to delete bookmark' },
      { status: 500 }
    );
  }
}