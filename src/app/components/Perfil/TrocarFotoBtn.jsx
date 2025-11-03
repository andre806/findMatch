import { useState } from "react";

export default function TrocarFotoBtn({ urlAntiga }) {
    const [showModal, setShowModal] = useState(false);
    const [novaFoto, setNovaFoto] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false); // novo estado
    const [fotoAtual, setFotoAtual] = useState(urlAntiga); // controla a foto exibida
    const url = process.env.NEXT_PUBLIC_URL;

    async function trocar() {
        if (!novaFoto) return;
        setLoading(true); // inicia loading
        const formData = new FormData();
        formData.append("novaFoto", novaFoto);

        await fetch(`${url}User/trocarFoto?antigaUrl=${encodeURIComponent(urlAntiga)}`, {
            method: "POST",
            credentials: "include",
            body: formData
        });
        setShowModal(false);
        setNovaFoto(null);
        setPreview(null);
        // Atualiza a foto exibida (força reload da imagem)
        setFotoAtual(`${urlAntiga.split("?")[0]}?${Date.now()}`);
        setLoading(false); // encerra loading
    }

    function handleChange(e) {
        const file = e.target.files[0];
        setNovaFoto(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }
    }

    return (
        <div>
            {/* Mostra a foto atual */}
            <button onClick={() => setShowModal(true)}>
                trocar
            </button>
            {showModal && (
                <div style={{
                    position: "fixed",
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: "rgba(0,0,0,0.5)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    zIndex: 9999 // garante sobreposição
                }}>
                    <div style={{ background: "#fff", padding: 20, borderRadius: 8, minWidth: 250 }}>
                        {loading ? (
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                {/* Rodinha de carregamento simples */}
                                <div style={{
                                    border: "4px solid #ccc",
                                    borderTop: "4px solid #333",
                                    borderRadius: "50%",
                                    width: 32,
                                    height: 32,
                                    animation: "spin 1s linear infinite",
                                    marginBottom: 10
                                }} />
                                <span>Enviando...</span>
                                {/* CSS para animação */}
                                <style>
                                    {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
                                </style>
                            </div>
                        ) : (
                            <>
                                <input type="file" onChange={handleChange} />
                                {preview && (
                                    <div style={{ margin: "10px 0" }}>
                                        <img src={preview} alt="Preview" style={{ maxWidth: 200, maxHeight: 200, borderRadius: 8 }} />
                                    </div>
                                )}
                                <button onClick={trocar}>Confirmar troca</button>
                                <button onClick={() => setShowModal(false)}>Cancelar</button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}