import {NextRequest, NextResponse} from 'next/server';
import {createSession} from "@/app/lib/session";
import {neon} from '@neondatabase/serverless';
import {TokenData} from "@/app/lib/definitions";

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

    const tokenData: TokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
        console.error('Failed to fetch token:', tokenResponse.statusText);
        return NextResponse.json({message: 'Failed to fetch token'}, {status: tokenResponse.status});
    }

    console.log('tokendata:: ', tokenData)

    try {
        const sql = neon(`${process.env.DATABASE_URL}`);

        const athletes = await sql`SELECT *
                                   FROM athlete
                                   where id = ${tokenData.athlete.id}`
        console.log('NEON select:: ', athletes)
        if (athletes.length == 0) {

            const athlete = tokenData.athlete
            const insertion = await sql`INSERT INTO athlete
                                        values (${athlete.id}, ${athlete.firstname}, 'todo', ${athlete.profile_medium})`

            console.log('NEON insertion:: ', insertion)
        }

        // console.log('athlete from NEON:: ', athlete)
    } catch (error) {
        console.log('error:: ', error)
    }


    await createSession(tokenData.athlete.id);

    const response = NextResponse.redirect(new URL('/dashboard', req.url));
    response.cookies.set('access_token', tokenData.access_token, {
        httpOnly: true,
        path: '/',
        secure: false,
        sameSite: 'lax',
    });

    return response;
}