import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    
    if (error) {
      console.error('OAuth error:', error);
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/connect?error=${error}`);
    }
    
    if (!code) {
      console.error('No code received from OAuth');
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/connect?error=no_code`);
    }

    // Check if environment variables are set
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;
    
    if (!clientId || !clientSecret) {
      console.error('Missing GitHub OAuth credentials:', {
        clientId: !!clientId,
        clientSecret: !!clientSecret
      });
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/connect?error=missing_credentials`);
    }
    
    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });
    
    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token exchange failed:', {
        status: tokenResponse.status,
        statusText: tokenResponse.statusText,
        body: errorText
      });
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/connect?error=token_exchange_failed`);
    }
    
    const tokenData = await tokenResponse.json();
    
    if (!tokenData.access_token) {
      console.error('No access token in response:', tokenData);
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/connect?error=no_access_token`);
    }
    
    console.log('Successfully obtained access token');
    
    // Get user info and installations
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });
    
    if (!userResponse.ok) {
      const errorText = await userResponse.text();
      console.error('Failed to get user info:', {
        status: userResponse.status,
        statusText: userResponse.statusText,
        body: errorText
      });
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/connect?error=user_info_failed`);
    }
    
    const userData = await userResponse.json();
    console.log('Successfully got user info:', userData.login);
    
    // Get user installations
    const installationsResponse = await fetch('https://api.github.com/user/installations', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });
    
    if (!installationsResponse.ok) {
      const errorText = await installationsResponse.text();
      console.error('Failed to get installations:', {
        status: installationsResponse.status,
        statusText: installationsResponse.statusText,
        body: errorText
      });
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/connect?error=installations_failed`);
    }
    
    const installationsData = await installationsResponse.json();
    console.log('Successfully got installations:', installationsData.installations?.length || 0);
    
    // Redirect to the callback page with the data as query params
    // The page will handle the data via the context
    const callbackUrl = new URL(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/auth/callback`);
    callbackUrl.searchParams.set('token', tokenData.access_token);
    callbackUrl.searchParams.set('user', JSON.stringify(userData));
    callbackUrl.searchParams.set('installations', JSON.stringify(installationsData.installations || []));
    
    return NextResponse.redirect(callbackUrl.toString());
    
  } catch (error) {
    console.error('Auth callback error:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/connect?error=server_error`);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();
    
    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });
    
    const tokenData = await tokenResponse.json();
    
    if (!tokenData.access_token) {
      return NextResponse.json({ error: 'Failed to get access token' }, { status: 400 });
    }
    
    // Get user info and installations
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });
    
    const userData = await userResponse.json();
    
    // Get user installations
    const installationsResponse = await fetch('https://api.github.com/user/installations', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });
    
    const installationsData = await installationsResponse.json();
    
    return NextResponse.json({
      token: tokenData.access_token,
      user: userData,
      installations: installationsData.installations || [],
    });
    
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
