"use client";

import { useEffect } from "react"; 
import { useRouter, usePathname } from "next/navigation";
import api from "@/lib/api-agent";
import axios from "axios";
import { useAppSelector } from "@/redux/hooks";
import { selectSeller } from "@/redux/slices/sellerSlice";

export default function AuthChecker() {
  const router = useRouter();
  const pathname = usePathname();
  const seller = useAppSelector(selectSeller);

  const checkAuth = async () => {
      try {
            if(!seller) {
                window.location.href = '/login';
            }

            await api.get(`/sellers/me`);
      } catch (error) {
          if(axios.isAxiosError(error) && error.response?.status === 401) {
              window.location.href = '/login';
          }
      }
  }

  useEffect(() => {
    checkAuth();
  }, [pathname, router]);

  return null; // ⭐ important
}