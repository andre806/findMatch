import { useEffect, useState } from "react";
import { getEmail } from "./getEmail";
import { useRouter } from "next/navigation";

export default function EncaminhaUser({ children }) {
    const [email, setEmail] = useState(null);
    const [verificado, setVerificado] = useState(null);
    const [logado, setLogado] = useState(null);
    const [redirecting, setRedirecting] = useState(false);
    const url = process.env.NEXT_PUBLIC_URL;
    const router = useRouter();

    useEffect(() => {
        async function fetchEmail() {
            const result = await getEmail();
            setEmail(result);
        }
        fetchEmail();
    }, []);

    useEffect(() => {
        if (!email) return;
        // Verifica se o passo 1 foi concluído
        const fetchVerifica = async () => {
            const res = await fetch(`${url}User/VerificaPasso1?email=${email}`, {
                method: "GET",
                headers: { "content-type": "application/json" }
            });
            const data = await res.json();
            setVerificado(data === true);
        };
        // Verifica se o usuário já está logado
        const fetchLogado = async () => {
            const res = await fetch(`${url}User/VerificaLogado?email=${email}`, {
                method: "GET",
                headers: { "content-type": "application/json" }
            });
            const data = await res.json();
            setLogado(data === true);
        };
        fetchVerifica();
        fetchLogado();
    }, [email, url]);

    useEffect(() => {
        if (verificado || logado) {
            setRedirecting(true);
            router.push("/pages/perfil");
        }
    }, [verificado, logado, router]);

    if (redirecting) return null;
    return <>{children}</>;
}