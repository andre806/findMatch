'use client'
import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

export default function EncaminhaUser({ children }) {

    const [verificado, setVerificado] = useState(null);
    const [logado, setLogado] = useState(null);
    const [redirecting, setRedirecting] = useState(false);
    const url = process.env.NEXT_PUBLIC_URL;
    const router = useRouter();



    useEffect(() => {

        const fetchVerifica = async () => {
            const res = await fetch(`${url}User/verificaPasso1`, {
                credentials: "include",
                method: "GET",
                headers: { "content-type": "application/json" }
            });
            const data = await res.json();
            setVerificado(data === true);
        };
        
        fetchVerifica();
        
    }, [url]);

    useEffect(() => {
        if (verificado === false && window.location.pathname !== "/pages/Passo1") {
            setRedirecting(true);
            router.push("/pages/Passo1");
        } else if (verificado === true  && window.location.pathname !== "/pages/perfil") {
            setRedirecting(true);
            router.push("/pages/perfil");
        }
    }, [verificado, logado, router]);

    if (redirecting) return null;
    return <>{children}</>;
}