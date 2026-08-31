import { jwtVerify } from "jose";

/**
 * Verifies a session JWT. Kept dependency-light (only `jose`) so it can run
 * inside the Edge middleware without pulling in axios / redux.
 */
export async function verifyToken(token: string | undefined) {
    try {
        if (!token) return null;
        const { payload } = await jwtVerify(
            token,
            new TextEncoder().encode(process.env.JWT_SECRET)
        );
        return payload;
    } catch (error) {
        console.log(error);
        return null;
    }
}
