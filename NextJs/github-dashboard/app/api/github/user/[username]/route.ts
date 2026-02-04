import { NextRequest, NextResponse } from 'next/server';
import { getUserDetails as getGitHubUserDetails } from '@/app/lib/api/github';

interface FilteredUser {
  name: string | null;
  bio: string | null;
  followers: number;
  following: number;
  public_repos: number;
  login: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    if (!username) {
      return NextResponse.json(
        { success: false, error: 'Username is required' },
        { status: 400 }
      );
    }

    const userData = await getGitHubUserDetails(username);

    if (!userData) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Filter the response to only include the required fields
    const filteredData: FilteredUser = {
      name: userData.name || null,
      bio: userData.bio || null,
      followers: userData.followers,
      following: userData.following,
      public_repos: userData.public_repos,
      login: userData.login,
    };

    return NextResponse.json({
      success: true,
      data: filteredData,
    });
  } catch (error) {
    console.error('Error fetching user details:', error);
    
    // Handle GitHub API 404 errors
    if (error instanceof Error && error.message === 'User not found') {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
