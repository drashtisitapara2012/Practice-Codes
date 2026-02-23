import { NextRequest, NextResponse } from 'next/server';

/**
 * Next.js 16+ Proxy Function
 * Handles all HTTP methods and forwards requests to external APIs
 * 
 * Usage:
 * GET /proxy?url=https://api.example.com/data
 * POST /proxy?url=https://api.example.com/submit (with body)
 */

export async function proxy(request: NextRequest) {
  // Only allow proxy requests to /proxy path
  if (!request.nextUrl.pathname.startsWith('/proxy')) {
    return NextResponse.next();
  }

  const searchParams = request.nextUrl.searchParams;
  const targetUrl = searchParams.get('url');

  // Validate target URL
  if (!targetUrl) {
    return NextResponse.json(
      { 
        error: 'Missing "url" parameter',
        usage: 'Example: /proxy?url=https://api.example.com/data'
      }, 
      { status: 400 }
    );
  }

  // Basic URL validation
  try {
    new URL(targetUrl);
  } catch {
    return NextResponse.json(
      { error: 'Invalid URL format' }, 
      { status: 400 }
    );
  }

  try {
    // Prepare request headers
    const headers: Record<string, string> = {
      'User-Agent': 'Next.js-Proxy/1.0',
    };

    // Forward content-type if present
    const contentType = request.headers.get('content-type');
    if (contentType) {
      headers['Content-Type'] = contentType;
    }

    // Forward authorization if present (optional - uncomment if needed)
    // const authHeader = request.headers.get('authorization');
    // if (authHeader) {
    //   headers['Authorization'] = authHeader;
    // }

    // Prepare request body for non-GET requests
    let body: string | undefined;
    if (!['GET', 'HEAD'].includes(request.method)) {
      body = await request.text();
    }

    // Make the proxy request
    const response = await fetch(targetUrl, {
      method: request.method,
      headers,
      body,
    });

    // Prepare response headers
    const responseHeaders: Record<string, string> = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    };

    // Forward content-type from response
    const responseContentType = response.headers.get('content-type');
    if (responseContentType) {
      responseHeaders['Content-Type'] = responseContentType;
    }

    // Forward cache control
    const cacheControl = response.headers.get('cache-control');
    if (cacheControl) {
      responseHeaders['Cache-Control'] = cacheControl;
    }

    // Get response data
    const data = await response.text();

    return new Response(data, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });

  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { 
        error: 'Proxy request failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}

// Handle CORS preflight requests
export async function OPTIONS(request: NextRequest) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    },
  });
}
