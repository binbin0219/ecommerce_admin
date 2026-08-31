import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { getCookie } from "./utils/server";
import api from "./api-agent";
import { setSeller } from "@/redux/slices/sellerSlice";
import { store } from "@/redux/store";

export { verifyToken } from "./verifyToken";

export async function getFrontEndJwtCookie() {
    return await getCookie(process.env.NEXT_JWT_TOKEN_NAME!) as RequestCookie;
}

export async function getBackendJwtToken() {
    const jwtCookie = await getFrontEndJwtCookie();
    return `${process.env.JWT_TOKEN_NAME}=${jwtCookie.value}`;
}

async function logoutOnFrontEnd() {
    const response = await api.get(`/sellers/logout`);
    if(!response) {
        throw new Error("Failed to log out on frontend");
    }
}

export async function logout() {
    await logoutOnFrontEnd();
    store.dispatch(setSeller(null))
    window.location.href = '/login';
}