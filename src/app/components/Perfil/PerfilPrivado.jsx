import { useEffect, useState } from "react";
import { getEmail } from "@/app/services/getEmail";

export default function PPrivado() {
    const [email, setEmail] = useState(null);
    const [perfil, setPerfil] = useState(null);
    const url = process.env.NEXT_PUBLIC_URL;

    useEffect(() => {
        async function fetchEmail() {
            const result = await getEmail();
            setEmail(result);
        }
        fetchEmail();
    }, []);

    useEffect(() => {
        if (!email) return;
        const fetchPerfil = async () => {
            const db = await fetch(`${url}User/Perfil?email=${encodeURIComponent(email)}`, {
                method: "GET",
                headers: { "content-type": "application/json" }
            });
            const res = await db.json();
            setPerfil(res);
        };
        fetchPerfil();
    }, [email]);

    return (
        <div style={{
            maxWidth: 400,
            margin: "2rem auto",
            padding: "2rem",
            border: "1px solid #ccc",
            borderRadius: "10px",
            background: "#fafafa"
        }}>
            <h2 style={{ marginBottom: "1rem" }}>Perfil do Usuário</h2>
            {perfil ? (
                <>
                    <div><strong>Nome:</strong> {perfil.nome}</div>
                    <div><strong>Bio:</strong> {perfil.bio}</div>
                    <div><strong>Gostos:</strong> {perfil.gostos}</div>
                    <div><strong>Cidade:</strong> {perfil.cidade}</div>
                    <div><strong>Gênero:</strong> {perfil.genero}</div>
                    <div><strong>Sexualidade:</strong> {perfil.sexualidade}</div>
                    <div><strong>Procurando:</strong> {perfil.toProcurando}</div>
                    <div><strong>Cidades de Exibição:</strong> {perfil.cidadesExibicao}</div>
                    <div><strong>Ocupação:</strong> {perfil.ocupacao}</div>
                    <div><strong>Educação:</strong> {perfil.educacao}</div>
                </>
            ) : (
                <div>Carregando...</div>
            )}
        </div>
    );
}