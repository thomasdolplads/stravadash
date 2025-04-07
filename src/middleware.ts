import {NextRequest, NextResponse} from "next/server";
import {cookies} from "next/headers";
import {decrypt} from "@/app/lib/session";

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
    const session = await decrypt(cookie)

    // 4. Redirect to /login if the user is not authenticated
    if (isProtectedRoute && !session?.userId) {
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