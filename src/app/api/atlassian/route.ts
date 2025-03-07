import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, email, apiToken, method = 'GET', body: requestBody } = body;
    
    if (!url || !email || !apiToken) {
      return NextResponse.json(
        { error: 'URL, email, and API token are required' },
        { status: 400 }
      );
    }
    
    console.log(`Proxying request to: ${url}`);
    
    // Create Basic Auth header
    const credentials = `${email}:${apiToken}`;
    const encodedCredentials = Buffer.from(credentials).toString('base64');
    
    const headers: HeadersInit = {
      'Authorization': `Basic ${encodedCredentials}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'DevTracker/1.0'
    };
    
    const fetchOptions: RequestInit = {
      method,
      headers,
      ...(requestBody && { body: JSON.stringify(requestBody) })
    };
    
    try {
      const response = await fetch(url, fetchOptions);
      
      // Log response status for debugging
      console.log(`Response status: ${response.status} ${response.statusText}`);
      
      // Handle different response types
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        try {
          data = await response.json();
        } catch (e) {
          console.error('Error parsing JSON response:', e);
          data = await response.text();
        }
      } else {
        data = await response.text();
        console.log('Non-JSON response:', data.substring(0, 200) + '...');
      }
      
      if (!response.ok) {
        console.error('API error response:', typeof data === 'string' ? data.substring(0, 200) : data);
        return NextResponse.json(
          { 
            error: `API error: ${response.status} ${response.statusText}`,
            details: data
          },
          { status: response.status }
        );
      }
      
      return NextResponse.json(data);
    } catch (fetchError) {
      console.error('Fetch error:', fetchError);
      return NextResponse.json(
        { error: 'Error fetching from external API', details: (fetchError as Error).message },
        { status: 502 }
      );
    }
  } catch (error) {
    console.error('Proxy API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: (error as Error).message },
      { status: 500 }
    );
  }
}

// Configure CORS
export const config = {
  api: {
    bodyParser: true,
  },
} 