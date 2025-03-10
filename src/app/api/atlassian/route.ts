import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, email, apiToken, token, method = 'GET', body: requestBody, isBitbucket = false } = body;
    
    // Check if we have either token or email+apiToken
    if (!url || (!token && (!email || !apiToken))) {
      return NextResponse.json(
        { error: 'URL and either token or email+apiToken are required' },
        { status: 400 }
      );
    }
    
    console.log(`Proxying request to: ${url}`);
    
    // Create headers based on authentication method
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'DevTracker/1.0'
    };
    
    // Add authentication header based on provided credentials
    if (token) {
      // Bearer token authentication
      headers['Authorization'] = `Bearer ${token}`;
      console.log('Using Bearer token authentication');
    } else if (isBitbucket || (url.includes('bitbucket.org') && email === 'x-token-auth')) {
      // Bitbucket app password authentication
      // For Bitbucket, we use Basic auth with username 'x-token-auth' and the app password as the password
      const credentials = `${email}:${apiToken}`;
      const encodedCredentials = Buffer.from(credentials).toString('base64');
      headers['Authorization'] = `Basic ${encodedCredentials}`;
      console.log('Using Bitbucket app password authentication');
    } else {
      // Standard Basic authentication
      const credentials = `${email}:${apiToken}`;
      const encodedCredentials = Buffer.from(credentials).toString('base64');
      headers['Authorization'] = `Basic ${encodedCredentials}`;
      console.log('Using Basic authentication');
    }
    
    console.log('Request headers:', {
      ...headers,
      'Authorization': headers['Authorization'] ? 
        headers['Authorization'].substring(0, 15) + '...' : 
        'none'
    });
    
    const fetchOptions: RequestInit = {
      method,
      headers,
      ...(requestBody && { body: JSON.stringify(requestBody) })
    };
    
    try {
      console.log(`Sending request to ${url} with method ${method}`);
      const response = await fetch(url, fetchOptions);
      
      // Log response status for debugging
      console.log(`Response status: ${response.status} ${response.statusText}`);
      
      // Get response text first
      const responseText = await response.text();
      console.log('Response text (first 200 chars):', responseText.substring(0, 200));
      
      // Try to parse as JSON
      let data;
      try {
        data = JSON.parse(responseText);
        console.log('Successfully parsed response as JSON');
      } catch (e) {
        console.log('Response is not valid JSON, keeping as text');
        data = responseText;
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