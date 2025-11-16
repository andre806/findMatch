'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RequireAuth({ children }) {
    const url = process.env.NEXT_PUBLIC_URL;
    const [logado, setLogado] = useState(null);
    const router = useRouter();

    useEffect(() => {
        async function Verifica() {
            const db = await fetch(`${url}User/VerificaLogado`, {
                method: "GET",
                credentials: "include"
            });
            const res = await db.json();
            setLogado(res);
        }
        Verifica();
    }, [url]);

    useEffect(() => {
        if (logado === null) return; // ainda carregando
        // Só redireciona se não estiver na rota correta
        if (logado === true && window.location.pathname !== "/pages/perfil") {
            router.replace("/pages/perfil");
        } else if (logado === false && window.location.pathname !== "/") {
            router.replace("/");
        }
    }, [logado, router]);

    if (logado === null) return null; // aguarda verificação

    // Renderiza children se estiver na / e não logado
    if (window.location.pathname === "/" && logado === false) {
        return children;
    }
    // Renderiza children se estiver na /pages/perfil e logado
    if (window.location.pathname === "/pages/perfil" && logado === true) {
        return children;
    }

    return null;
}