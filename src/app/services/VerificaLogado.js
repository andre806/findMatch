"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RequireAuth({ children }) {
    const url = process.env.NEXT_PUBLIC_URL;
    const [logado, setLogado] = useState(null);
    const router = useRouter();

    useEffect(() => {
        async function Verifica() {
            const db = await fetch(`${url}User/VerificaLogado`,{
                method:"GET",
                credentials:"include"
            });
            const res = await db.json();
            setLogado(res);
        }
        Verifica();
    }, [url]);

    useEffect(() => {
        if (logado === null) return; // ainda carregando
        if (logado === true && window.location.pathname !== "/pages/perfil") {
            router.replace("/pages/perfil");
        } else if (logado === false && window.location.pathname !== "/") {
            router.replace("/");
        }
    }, [logado, router]);

    if (logado === null) return null; // aguarda verificação

    // Só renderiza children se já estiver na rota correta
    if ((logado === true && window.location.pathname === "/pages/perfil") ||
        (logado === false && window.location.pathname === "/")) {
        return children;
    }

    return null;
}