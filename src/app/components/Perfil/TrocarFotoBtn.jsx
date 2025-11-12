import { useState } from "react";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

export default function TrocarFotoBtn({ urlAntiga }) {
    const [showModal, setShowModal] = useState(false);
    const [novaFoto, setNovaFoto] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fotoAtual, setFotoAtual] = useState(urlAntiga);
    const url = process.env.NEXT_PUBLIC_URL;

    async function trocar() {
        if (!novaFoto) return;
        setLoading(true);
        const formData = new FormData();
        formData.append("novaFoto", novaFoto);

        await fetch(`${url}User/trocarFoto?antigaFileKey=${encodeURIComponent(urlAntiga)}`, {
            method: "POST",
            credentials: "include",
            body: formData
        });
        setShowModal(false);
        setNovaFoto(null);
        setPreview(null);
        setFotoAtual(`${urlAntiga.split("?")[0]}?${Date.now()}`);
        setLoading(false);
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
        <Box>
            <Button
                variant="contained"
                color="secondary"
                size="small"
                sx={{ mt: 1, mb: 1, borderRadius: 2, textTransform: "none" }}
                onClick={() => setShowModal(true)}
            >
                Trocar foto
            </Button>
            <Modal open={showModal} onClose={() => setShowModal(false)}>
                <Box sx={{
                    bgcolor: "#fff",
                    p: 3,
                    borderRadius: 2,
                    minWidth: 280,
                    mx: "auto",
                    my: "20vh",
                    boxShadow: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                }}>
                    {loading ? (
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                            <CircularProgress color="secondary" />
                            <span>Enviando...</span>
                        </Box>
                    ) : (
                        <>
                            <input type="file" onChange={handleChange} style={{ marginBottom: 12 }} />
                            {preview && (
                                <Box sx={{ mb: 2 }}>
                                    <img src={preview} alt="Preview" style={{ maxWidth: 200, maxHeight: 200, borderRadius: 8 }} />
                                </Box>
                            )}
                            <Box sx={{ display: "flex", gap: 2 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    onClick={trocar}
                                    disabled={!novaFoto}
                                >
                                    Confirmar troca
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="inherit"
                                    size="small"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancelar
                                </Button>
                            </Box>
                        </>
                    )}
                </Box>
            </Modal>
        </Box>
    );
}