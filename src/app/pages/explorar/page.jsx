'use client'
import { useRouter } from "next/navigation";

export default function Explorar() {
    const router = useRouter();
    return (
        <div>
            <button
                onClick={() => router.push("/pages/explorarCidades")}
                style={{
                    padding: "10px 20px",
                    borderRadius: 6,
                    background: "#222",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                    marginTop: 16,
                    marginRight: 12
                }}
            >
                Explorar cidades
            </button>
            <button
                onClick={() => router.push("/pages/explorarGostos")}
                style={{
                    padding: "10px 20px",
                    borderRadius: 6,
                    background: "#222",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                    marginTop: 16,
                    marginRight: 12
                }}
            >
                Explorar gostos
            </button>
            <button
                onClick={() => router.push("/pages/explorarProfissoes")}
                style={{
                    padding: "10px 20px",
                    borderRadius: 6,
                    background: "#222",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                    marginTop: 16
                }}
            >
                Explorar profissões
            </button>
        </div>
    )
}