import { useState } from "react";

export default function AdicionarFoto() {
    const [foto, setFoto] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const url = process.env.NEXT_PUBLIC_URL;

    async function adicionar() {
        if (!foto) return;
        setLoading(true);
        const formData = new FormData();
        formData.append("file", foto);

        const resp = await fetch(`${url}User/adiconarFoto`, {
            method: "POST",
            credentials: "include",
            body: formData
        });
        const text = await resp.text();
        setLoading(false);

        if (text.includes("Limite máximo de 4 fotos atingido")) {
            alert("Limite máximo de 4 fotos atingido");
        } else {
            window.location.reload();
        }
    }

    function handleChange(e) {
        const file = e.target.files[0];
        setFoto(file);
        setPreview(file ? URL.createObjectURL(file) : null);
    }

    return (
        <div>
            <input type="file" onChange={handleChange} />
            {preview && <img src={preview} alt="preview" />}
            <button onClick={adicionar} disabled={loading}>adicionar</button>
            {loading && (
                <div style={{ marginTop: 8 }}>
                    <span className="loading-anim">Carregando...</span>
                </div>
            )}
        </div>
    );
}