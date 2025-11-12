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
import Chip from "@mui/material/Chip";

export default function MiniaturaPerfil({ id, size = 180, square = false }) {
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
    useEffect(() => {
        async function visualizar() {
            // Usa o id exatamente como recebido
            // eslint-disable-next-line no-console
            console.log("visualizar perfilId:", id);
            await fetch(`${url}User/visualizarPerfil?perfilId=${encodeURIComponent(id)}`, {
                method: "POST",
                credentials: "include"
            })
        }
        if (id) visualizar();
    }, [id, url])
    // Interação dos botões
    function handleSkip() {
        setData(null);
        setSnackbar({ open: true, message: "Perfil pulado!", severity: "info" });
    }
    async function handleCurtir() {
        setSnackbar({ open: true, message: "Você curtiu!", severity: "success" });
        // Você pode adicionar lógica extra aqui se quiser
    }

    // Adicione interesses mock para visual
    const interests = data?.interesses || ["Música", "Viagem", "Cinema"];

    if (!data) return null;

    return (
        <Card
            sx={{
                width: "100%",
                maxWidth: 480,
                minHeight: 580,
                borderRadius: 8,
                overflow: "hidden",
                boxShadow: 8,
                bgcolor: "#18181b",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
            }}
        >
            {/* Carrossel de fotos */}
            <Box
                sx={{
                    width: "100%",
                    height: 570,
                    bgcolor: "#222",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    position: "relative"
                }}
            >
                {fotos && fotos.length > 0 ? (
                    <img
                        src={fotos[0].url || fotos[0]}
                        alt="foto-principal"
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover"
                        }}
                    />
                ) : (
                    <Box
                        sx={{
                            width: "100%",
                            height: "100%",
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
                {/* Faixa gradiente sobreposta */}
                <Box sx={{
                    position: "absolute",
                    left: "50%",
                    bottom: 0,
                    transform: "translateX(-50%)",
                    width: "90%",
                    borderRadius: "16px",
                    background: "linear-gradient(90deg,#ff66cc,#9933ff)",
                    boxShadow: "0 2px 8px #9933ff22",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    py: 1.5,
                    px: 2,
                    zIndex: 2
                }}>
                    <Typography
                        variant="h6"
                        sx={{
                            color: "#fff",
                            fontWeight: 900,
                            fontSize: { xs: 22, sm: 28 }, // aumentada
                            textAlign: "center",
                            lineHeight: 1.2,
                            letterSpacing: 0.5,
                            fontFamily: "'Montserrat', 'Roboto', sans-serif"
                        }}
                    >
                        {data.nome}{data.idade ? `, ${data.idade}` : ""}{data.cidade ? `, ${data.cidade}` : ""}
                    </Typography>
                </Box>
            </Box>
            {/* Informações do perfil
            <CardContent
                sx={{
                    width: "100%",
                    bgcolor: "#fff",
                    color: "#333",
                    borderBottomLeftRadius: 8,
                    borderBottomRightRadius: 8,
                    boxShadow: "0 4px 32px #9933ff22",
                    p: { xs: 3, sm: 4 }, // mais espaçamento
                    minHeight: 210, // maior altura
                    display: "flex",
                    flexDirection: "column",
                    gap: 2.5, // mais espaçamento entre linhas
                    alignItems: "flex-start",
                    fontSize: { xs: 32, sm: 36 }, // fonte maior
                    fontFamily: "'Montserrat', 'Roboto', sans-serif"
                }}
            >
                <Typography variant="body1" fontWeight={700} sx={{ color: "#9933ff", fontSize: 24, fontFamily: "'Montserrat', 'Roboto', sans-serif" }}>
                    {data.ocupacao || "Ocupação não informada"}
                </Typography>
                <Typography variant="body1" sx={{ fontSize: 22, fontWeight: 500, mb: 0.5 }}>
                    <b>Educação:</b> <span style={{ color: "#333" }}>{data.educacao || "Não informado"}</span>
                </Typography>
                <Typography variant="body1" sx={{ fontSize: 22, fontWeight: 500, mb: 0.5 }}>
                    <b>Sexualidade:</b> <span style={{ color: "#333" }}>{data.sexualidade || "Não informado"}</span>
                </Typography>
                <Typography variant="body1" sx={{ color: "#a3a3a3", fontSize: 20, fontWeight: 500, mb: 0.5 }}>
                    <b>Gosto musical:</b> {data.gostoMusical || "Não informado"}
                </Typography>
                <Typography variant="body1" sx={{ color: "#d4d4d4", fontSize: 20, fontWeight: 500, mb: 0.5 }}>
                    <b>Bio:</b> {data.bio || "Não informado"}
                </Typography> */}
            {/* Chips de interesses
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mt: 1 }}>
                    {interests.map((interest, idx) => (
                        <Chip
                            key={interest}
                            label={interest}
                            sx={{
                                bgcolor: idx % 2 === 0 ? "#9933ff" : "#ff66cc",
                                color: "#fff",
                                fontWeight: 700,
                                fontSize: 18,
                                px: 2.5,
                                py: 1.2,
                                borderRadius: 2,
                                boxShadow: "0 2px 8px #9933ff22",
                                fontFamily: "'Montserrat', 'Roboto', sans-serif"
                            }}
                        />
                    ))}
                </Box>
            </CardContent> */}
            {/* Nome, idade */}
            {/* <Box
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
            </Box> */}
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
                timeout={0} // sem fade, instantâneo
                unmountOnExit
            >
                <CardContent
                    sx={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        bottom: 0,
                        bgcolor: "#fff",
                        color: "#333",
                        borderTopLeftRadius: 24,
                        borderTopRightRadius: 24,
                        boxShadow: "0 4px 32px #9933ff55",
                        p: { xs: 3, sm: 4 },
                        zIndex: 3,
                        minHeight: 210,
                        display: "flex",
                        flexDirection: "column",
                        gap: 2.5,
                        alignItems: "flex-start",
                        fontSize: { xs: 32, sm: 36 },
                        fontFamily: "'Montserrat', 'Roboto', sans-serif"
                    }}
                >
                    <Typography variant="subtitle1" fontWeight={900} sx={{ color: "#ff66cc", fontSize: 28, fontFamily: "'Montserrat', 'Roboto', sans-serif" }}>
                        {data.nome}{data.idade ? `, ${data.idade}` : ""}
                    </Typography>
                    <Typography variant="body1" fontWeight={700} sx={{ color: "#9933ff", fontSize: 24, fontFamily: "'Montserrat', 'Roboto', sans-serif" }}>
                        {data.cidade}
                    </Typography>
                    <Typography variant="body1" sx={{ fontSize: 22, fontWeight: 500, mb: 0.5 }}>
                        <b>Ocupação:</b> <span style={{ color: "#333" }}>{data.ocupacao || "Não informado"}</span>
                    </Typography>
                    <Typography variant="body1" sx={{ fontSize: 22, fontWeight: 500, mb: 0.5 }}>
                        <b>Educação:</b> <span style={{ color: "#333" }}>{data.educacao || "Não informado"}</span>
                    </Typography>
                    <Typography variant="body1" sx={{ fontSize: 22, fontWeight: 500, mb: 0.5 }}>
                        <b>Sexualidade:</b> <span style={{ color: "#333" }}>{data.sexualidade || "Não informado"}</span>
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#333", fontSize: 20, fontWeight: 500, mb: 0.5 }}>
                        <b>Gosto musical:</b> {data.gostoMusical || "Não informado"}
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#333", fontSize: 20, fontWeight: 500, mb: 0.5 }}>
                        <b>Bio:</b> {data.bio || "Não informado"}
                    </Typography>
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