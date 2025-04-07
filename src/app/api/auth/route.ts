import {NextRequest, NextResponse} from 'next/server';
import {createSession} from "@/app/lib/session";

export async function GET(req: NextRequest) {
    const {searchParams} = new URL(req.url);
    const code: string | null = searchParams.get('code');

    if (!code) {
        return NextResponse.json({error: 'Missing code'}, {status: 400});
    }

    const tokenResponse = await fetch('https://www.strava.com/oauth/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            client_id: '24125',
            client_secret: `${process.env.STRAVA_API_KEY}`,
            code,
            grant_type: 'authorization_code',
        }),
    });
    const tokenData: any = await tokenResponse.json();
    if (!tokenResponse.ok) {
        console.error('Failed to fetch token:', tokenResponse.statusText);
        return {message: 'Failed to fetch token', status: tokenResponse.status};
    }

    await createSession(tokenData.athlete.id)


    const response = NextResponse.redirect(new URL('/dashboard', req.url));
    response.cookies.set('access_token', tokenData.access_token, {
        httpOnly: true,
        path: '/',
        secure: false,
        sameSite: 'lax',
    });

    return response;
}