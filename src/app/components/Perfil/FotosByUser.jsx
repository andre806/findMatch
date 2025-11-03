import { useState, useEffect } from "react";
import ExcluirFotoBtn from "./ExcluirFotoBtn";
import TrocarFotoBtn from "./TrocarFotoBtn";
export default function FotosByUser() {
    const [fotos, setFotos] = useState([]);
    const url = process.env.NEXT_PUBLIC_URL;
    const [idCodificado, setIdCodificado] = useState("");
    useEffect(() => {
        async function fetchId() {
            const db = await fetch(`${url}User/getIdCodificado`, {
                method: "GET",
                credentials: "include"
            })
            const res = await db.text();
            setIdCodificado(res)
        }
        fetchId()
    }, [url])

    async function fetchFotos() {
        if (!idCodificado) return; // só busca se idCodificado estiver definido
        const response = await fetch(`${url}User/listarFotosByUser?userId=${idCodificado}`, {
            method: "GET",
            headers: { "content-type": "application/json" },
            credentials: "include"
        });
        const res = await response.json();
        setFotos(Array.isArray(res) ? res : []);
    }

    useEffect(() => {
        if (idCodificado) {
            fetchFotos();
        }
    }, [idCodificado]); // só chama quando idCodificado mudar

    return (
        <div>
            {fotos.map((f) => (
                <div key={f} style={{ marginBottom: 16 }}>
                    <img src={f} alt="foto" style={{ maxWidth: 200, display: "block" }} />
                    <ExcluirFotoBtn FotoUrl={f} onFotoAlterada={fetchFotos} />
                    <TrocarFotoBtn urlAntiga={f} onFotoAlterada={fetchFotos} />
                </div>
            ))}
        </div>
    );
}