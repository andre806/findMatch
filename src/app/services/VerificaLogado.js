"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";

function getTokenFromCookies() {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(/(?:^|; )token=([^;]*)/);
    return match ? match[1] : null;
}

export default function RequireAuth({ children }) {
    const router = useRouter();

    useEffect(() => {
        async function checkAuth() {
            const session = await getSession();
            const token = getTokenFromCookies();
            if (!session && !token) {
                router.replace("/");
            }
        }
        checkAuth();
    }, [router]);

    return children;
}