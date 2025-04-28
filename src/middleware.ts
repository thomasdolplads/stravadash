import {NextRequest, NextResponse} from "next/server";
import {cookies} from "next/headers";
import {decrypt} from "@/app/lib/session";
import {JWTPayload} from "jose";

interface JWT extends JWTPayload {
    expiresAt: string
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}

const publicRoutes = ['/']
const protectedRoutes = ['/dashboard'];

const middleware = async (request: NextRequest) => {
    const path = request.nextUrl.pathname
    const isProtectedRoute = protectedRoutes.includes(path)
    const isPublicRoute = publicRoutes.includes(path)

    // 3. Decrypt the session from the cookie
    const cookie = (await cookies()).get('session')?.value
    console.log('cookie:: ', JSON.stringify(cookie))
    const session = await decrypt(cookie) as JWT
    console.log('session:: ', session?.expiresAt)
    const currentTime = new Date();

    const sessionExpiresAt = session?.expiresAt;
    const isValidSession = currentTime < new Date(sessionExpiresAt)

    // 4. Redirect to /login if the user is not authenticated
    if (isProtectedRoute && (!session?.userId || !isValidSession)) {
        return NextResponse.redirect(new URL('/', request.nextUrl))
    }

    // 5. Redirect to /dashboard if the user is authenticated
    if (
        isPublicRoute &&
        session?.userId &&
        !request.nextUrl.pathname.startsWith('/dashboard')
    ) {

        return NextResponse.redirect(new URL('/dashboard', request.nextUrl))
    }

    return NextResponse.next()
}

export default middleware;