import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { verifyToken } from "./lib/verifyToken";

export async function middleware(request: NextRequest) {
    // Auth can be disabled for local development by setting ENABLE_AUTH=false
    if (process.env.ENABLE_AUTH !== "false") {
        const token = request.cookies.get(process.env.NEXT_JWT_TOKEN_NAME!)?.value;
        if (!token || !(await verifyToken(token))) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }
    return NextResponse.next();
}

export const config = {
    matcher: [
        `/((?!login|signup|signup/success|api|_next/static|_next/image|favicon.ico|assets).*)`
    ]
};
