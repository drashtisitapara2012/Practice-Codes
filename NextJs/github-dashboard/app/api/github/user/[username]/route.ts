import { NextRequest, NextResponse } from 'next/server';
import { getUserDetails as getGitHubUserDetails } from '@/app/lib/api/github';
import { GitHubUser } from '@/app/types/github';

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

    // Returning enriched data for caching and sorting
    const filteredData: Partial<GitHubUser> = {
      id: userData.id,
      login: userData.login,
      avatar_url: userData.avatar_url,
      html_url: userData.html_url,
      type: userData.type,
      site_admin: userData.site_admin,
      name: userData.name || undefined,
      bio: userData.bio || undefined,
      followers: userData.followers,
      following: userData.following,
      public_repos: userData.public_repos,
      created_at: userData.created_at, // Essential for sorting
      location: userData.location || undefined,
      company: userData.company || undefined,
      blog: userData.blog || undefined,
    };

    return NextResponse.json({
      success: true,
      data: filteredData,
    });
  } catch (error) {
    console.error('Error fetching user details:', error);

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
