import { getBackendJwtToken } from "./auth";
import axios from 'axios';

async function fetchOnClient(url: string, init?: RequestInit) {
    return await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
        credentials: "include",
        ...init
    });
}

async function fetchOnServer(url: string, init?: RequestInit) {
    return await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
        ...init,
        credentials: 'include',
        headers: {
            ...init?.headers,
            "Cookie": await getBackendJwtToken()
        },
    });
}

export const apiAgent = {
    fetchOnClient,
    fetchOnServer
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;