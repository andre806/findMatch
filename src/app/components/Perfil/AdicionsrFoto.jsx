import { useState } from "react";

export default function AdicionarFoto() {
    const [foto, setFoto] = useState(null);
    const [preview, setPreview] = useState(null);
    const url = process.env.NEXT_PUBLIC_URL;

    async function adicionar() {
        if (!foto) return;
        const formData = new FormData();
        formData.append("file", foto);

        await fetch(`${url}User/adiconarFoto`, {
            method: "POST",
            credentials: "include",
            body: formData
        });
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
            <button onClick={adicionar}>adicionar</button>
        </div>
    );
}