import { useEffect, useState } from "react";
import CurtirBtn from "./CurtirBtn";
import SkipBtn from "./SkipBtn";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

export default function MiniaturaPerfil({ id }) {
    const [data, setData] = useState(null);
    const [showInfo, setShowInfo] = useState(false);
    const [fotos, setFotos] = useState([]);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    const url = process.env.NEXT_PUBLIC_URL;

    // Log para depuração do id recebido
    useEffect(() => {
        // eslint-disable-next-line no-console
        console.log("MiniaturaPerfil id recebido:", id, typeof id);
    }, [id]);

    useEffect(() => {
        const fetchFotos = async () => {
            // Usa o id exatamente como recebido
            // eslint-disable-next-line no-console
            console.log("fetchFotos userId:", id);
            const db = await fetch(`${url}User/listarFotosByUser?userId=${encodeURIComponent(id)}`, {
                method: "GET",
                credentials: "include",
            });
            const res = await db.json();
            setFotos(res);
        };
        if (id) fetchFotos();
    }, [id, url]);
    useEffect(() => {
        async function FetchData() {
            // Usa o id exatamente como recebido
            // eslint-disable-next-line no-console
            console.log("FetchData userId:", id);
            const db = await fetch(`${url}User/Miniatura?userId=${encodeURIComponent(id)}`, {
                method: "GET"
            })
            const res = await db.json();
            setData(res);
        }
        if (id) FetchData();
    }, [id, url])
    // useEffect(() => {
    //     async function visualizar() {
    //         // Usa o id exatamente como recebido
    //         // eslint-disable-next-line no-console
    //         console.log("visualizar perfilId:", id);
    //         await fetch(`${url}User/visualizarPerfil?perfilId=${encodeURIComponent(id)}`, {
    //             method: "POST",
    //             credentials: "include"
    //         })
    //     }
    //     if (id) visualizar();
    // }, [id, url])
    // Interação dos botões
    function handleSkip() {
        setData(null);
        setSnackbar({ open: true, message: "Perfil pulado!", severity: "info" });
    }
    async function handleCurtir() {
        setSnackbar({ open: true, message: "Você curtiu!", severity: "success" });
        // Você pode adicionar lógica extra aqui se quiser
    }

    if (!data) return null;

    return (
        <Card
            sx={{
                width: 340,
                height: 440,
                borderRadius: 3,
                overflow: "hidden",
                boxShadow: 6,
                bgcolor: "#18181b",
                position: "relative",
                display: "flex",
                flexDirection: "column"
            }}
        >
            {/* Carrossel de fotos */}
            <Box
                sx={{
                    display: "flex",
                    overflowX: "auto",
                    width: "100%",
                    height: 320,
                    scrollSnapType: "x mandatory",
                    bgcolor: "#222",
                }}
            >
                {fotos && fotos.length > 0 ? (
                    fotos.map((foto, idx) => (
                        <img
                            key={idx}
                            src={foto.url || foto}
                            alt={`foto-${idx}`}
                            style={{
                                width: 340,
                                height: 320,
                                objectFit: "cover",
                                flex: "0 0 100%",
                                scrollSnapAlign: "start",
                            }}
                        />
                    ))
                ) : (
                    <Box
                        sx={{
                            width: 340,
                            height: 320,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#a3a3a3",
                            bgcolor: "#222",
                        }}
                    >
                        Sem fotos
                    </Box>
                )}
            </Box>
            {/* Nome, idade */}
            <Box
                sx={{
                    position: "absolute",
                    left: 20,
                    bottom: 110,
                    color: "#fff",
                    textShadow: "0 1px 4px #000",
                }}
            >
                <Typography variant="h6" fontWeight={700}>
                    {data.nome}{data.idade ? `, ${data.idade}` : ""}
                </Typography>
            </Box>
            {/* Botões Curtir e Skip */}
            <Stack
                direction="row"
                spacing={4}
                sx={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 60,
                    justifyContent: "center",
                    zIndex: 2,
                }}
            >
                {/* <SkipBtn onSkip={handleSkip} />
                <CurtirBtn onCurtir={handleCurtir} /> */}
            </Stack>
            {/* Botão seta para cima/baixo */}
            <IconButton
                onClick={() => setShowInfo((v) => !v)}
                sx={{
                    position: "absolute",
                    right: 16,
                    bottom: showInfo ? 140 : 16, // sobrepõe o painel de informações quando aberto
                    bgcolor: "#222",
                    color: "#fff",
                    borderRadius: "50%",
                    width: 40,
                    height: 40,
                    boxShadow: 3,
                    zIndex: 4, // maior que o painel de informações
                    "&:hover": { bgcolor: "#333" }
                }}
                aria-label={showInfo ? "Esconder informações" : "Mostrar informações"}
            >
                {showInfo ? (
                    <ExpandMoreIcon
                        sx={{
                            transition: "transform 5.15s"
                        }}
                    />
                ) : (
                    <ExpandLessIcon
                        sx={{
                            transition: "transform 0.15s"
                        }}
                    />
                )}
            </IconButton>
            {/* Painel de informações */}
            <Collapse
                in={showInfo}
                timeout={{ enter: 5.15, exit: 0.15 }} // subida lenta, descida rápida
                unmountOnExit
            >
                <CardContent
                    sx={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        bottom: 0,
                        bgcolor: "rgba(24,24,27,0.98)",
                        color: "#fff",
                        borderTopLeftRadius: 3,
                        borderTopRightRadius: 3,
                        boxShadow: 6,
                        p: 2,
                        zIndex: 3,
                    }}
                >
                    <Typography variant="subtitle1" fontWeight={700}>
                        {data.nome}{data.idade ? `, ${data.idade}` : ""}
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                        {data.cidade}
                    </Typography>
                    <Typography variant="body2">
                        <b>Ocupação:</b> {data.ocupação || "Não informado"}
                    </Typography>
                    <Typography variant="body2">
                        <b>Educação:</b> {data.educacao || "Não informado"}
                    </Typography>
                    <Typography variant="body2">
                        <b>Sexualidade:</b> {data.sexualidade || "Não informado"}
                    </Typography>
                    <Typography variant="body2" color="#a3a3a3">
                        <b>Gosto musical:</b> {data.gostoMusical || "Não informado"}
                    </Typography>
                    <Typography variant="body2" color="#d4d4d4">
                        <b>Bio:</b> {data.bio || "Não informado"}
                    </Typography>
                    {data.urlFotoPerfil && (
                        <Box sx={{ mt: 1, display: "flex", justifyContent: "center" }}>
                            <img
                                src={data.urlFotoPerfil}
                                alt="Foto de perfil"
                                style={{
                                    width: 60,
                                    height: 60,
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                    border: "2px solid #444",
                                }}
                            />
                        </Box>
                    )}
                </CardContent>
            </Collapse>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={2000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: "100%" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Card>
    );
}