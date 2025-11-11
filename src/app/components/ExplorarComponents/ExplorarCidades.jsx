import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import MiniaturaPerfil from "../Fy/Miniatura";
import CurtirBtn from "../Fy/CurtirBtn";
import SkipBtn from "../Fy/SkipBtn";
import SuperLikeBtn from "../Fy/SuperLikeBtn";
import RewindBtn from "../Fy/rewindBtn";
import IniciarChatBtn from "../Fy/IniciarChatBtn";
import cidadesJson from "@/app/json/Cidades.json";

export default function ExplorarCidades() {
    const [ids, setIds] = useState([]);
    const [cidade, setCidade] = useState("");
    const [search, setSearch] = useState("");
    const [currentIdx, setCurrentIdx] = useState(0);
    const [noMoreProfiles, setNoMoreProfiles] = useState(false);
    const [animDirection, setAnimDirection] = useState("");
    const url = process.env.NEXT_PUBLIC_URL;
    const CIDADES_BRASIL = Object.values(cidadesJson)
        .flatMap(regiao => Object.values(regiao).flat());

    useEffect(() => {
        async function fetchCidades() {
            if (!cidade) {
                setIds([]);
                setCurrentIdx(0);
                setNoMoreProfiles(false);
                return;
            }
            const db = await fetch(`${url}explorar/explorarcidades?cidade=${encodeURIComponent(cidade)}`, {
                method: "GET",
                credentials: "include"
            });
            const res = await db.json();
            setIds(res);
            setCurrentIdx(0);
            if (!res || res.filter(p => p != null).length === 0) {
                setNoMoreProfiles(true);
            } else {
                setNoMoreProfiles(false);
            }
        }
        fetchCidades();
    }, [cidade, url]);

    function getNextValidIdx(startIdx) {
        for (let i = startIdx + 1; i < ids.length; i++) {
            if (ids[i] != null) return i;
        }
        return -1;
    }

    // Função para curtir (usada no drag e no botão)
    // async function curtirPerfil(userId) {
    //     await fetch(`${url}Relacionamento/curtir?perfilId=${userId}`, {
    //         method: "POST",
    //         credentials: "include",
    //         headers: {
    //             "Content-Type": "application/json"
    //         }
    //     });
    // }

    // Função para superlike
    async function superLikePerfil(userId) {
        await fetch(`${url}Relacionamento/superlike?perfilId=${userId}`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        });
    }

    const [previousProfile, setPreviousProfile] = useState(null);

    function handleNext(direction = "", doLike = false, doSuperLike = false) {
        setAnimDirection(direction);
        setTimeout(async () => {
            setPreviousProfile(ids[currentIdx]);
            if (doSuperLike && ids[currentIdx]) {
                await superLikePerfil(ids[currentIdx]);
            } else if (doLike && ids[currentIdx]) {
                await curtirPerfil(ids[currentIdx]);
            }
            const nextIdx = getNextValidIdx(currentIdx);
            if (nextIdx === -1) {
                // Buscar mais perfis automaticamente
                await buscarMaisPerfis();
            } else {
                setCurrentIdx(nextIdx);
            }
            setAnimDirection("");
        }, 350);
    }

    function handleRewind() {
        if (previousProfile) {
            const prevIdx = ids.findIndex(id => id === previousProfile);
            if (prevIdx !== -1) {
                setCurrentIdx(prevIdx);
            }
        }
    }

    async function buscarMaisPerfis() {
        // Rebusca perfis na cidade selecionada
        const db = await fetch(`${url}explorar/explorarcidades?cidade=${encodeURIComponent(cidade)}`, {
            method: "GET",
            credentials: "include"
        });
        const res = await db.json();
        setIds(res);
        setCurrentIdx(0);
        if (!res || res.filter(p => p != null).length === 0) {
            setNoMoreProfiles(true);
        } else {
            setNoMoreProfiles(false);
        }
    }

    const currentUser = ids[currentIdx];

    const animStyles = {
        transition: animDirection
            ? "transform 0.35s cubic-bezier(.4,2,.6,1), opacity 0.35s"
            : "transform 0.2s",
        transform:
            animDirection === "right"
                ? "translateX(120vw) rotate(20deg)"
                : animDirection === "left"
                    ? "translateX(-120vw) rotate(-20deg)"
                    : "translateX(0)",
        opacity: animDirection ? 0 : 1,
        cursor: "grab",
        touchAction: "pan-y"
    };

    // Filtro de cidades pelo campo de busca
    const cidadesFiltradas = search
        ? CIDADES_BRASIL.filter(c =>
            c.toLowerCase().includes(search.toLowerCase())
        )
        : CIDADES_BRASIL;

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                maxWidth: 1300,
                mx: "auto",
                mt: 4,
                gap: 4,
                alignItems: "flex-start",
                justifyContent: "flex-start",
                position: "relative"
            }}
        >
            {/* Barra de cidades fixa no canto esquerdo */}
            <Box
                sx={{
                    position: { xs: "static", sm: "fixed" },
                    left: 10,
                    top: 20,
                    minWidth: 220,
                    maxHeight: "90vh",
                    overflowY: "auto",
                    bgcolor: "#222",
                    borderRadius: 2,
                    p: 2,
                    boxShadow: 3,
                    mb: { xs: 2, sm: 0 },
                    alignSelf: "flex-start",
                    ml: 0,
                    zIndex: 10
                }}
            >
                <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    placeholder="Pesquisar cidade"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    sx={{
                        mb: 2,
                        bgcolor: "#18181b",
                        borderRadius: 1,
                        input: { color: "#fff" }
                    }}
                    InputProps={{
                        style: { color: "#fff" }
                    }}
                />
                <List dense sx={{ p: 0 }}>
                    {cidadesFiltradas.map((c, idx) => (
                        <ListItem key={idx} disablePadding sx={{ mb: 1 }}>
                            <Box
                                sx={{
                                    width: "100%",
                                    borderRadius: 2,
                                    bgcolor: cidade === c ? "#444" : "#18181b",
                                    border: cidade === c ? "2px solid #a855f7" : "2px solid transparent",
                                    boxShadow: cidade === c ? 4 : 0,
                                    transition: "all 0.2s",
                                }}
                            >
                                <ListItemButton
                                    selected={cidade === c}
                                    onClick={() => setCidade(c)}
                                    sx={{
                                        color: "#fff",
                                        borderRadius: 2,
                                        "&:hover": { bgcolor: "#333" },
                                        minHeight: 36
                                    }}
                                >
                                    <ListItemText primary={c} />
                                </ListItemButton>
                            </Box>
                        </ListItem>
                    ))}
                </List>
            </Box>
            {/* Box do perfil */}
            <Box
                sx={{
                    flex: 1,
                    position: "relative",
                    minHeight: 400,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    pl: { xs: 0, sm: 30 }, // espaço para a barra fixa
                    ml: { xs: 0, sm: 28 }  // espaço para a barra fixa
                }}
            >
                {currentUser && !noMoreProfiles ? (
                    <div
                        style={{
                            ...animStyles,
                            position: "relative",
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            top: "-32px"
                        }}
                    >
                        {/* Miniatura mais acima e à esquerda */}
                        <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 0, mb: 1, width: "100%" }}>
                            <MiniaturaPerfil id={currentUser} />
                        </Box>
                        {/* Botões abaixo da miniatura, alinhados à esquerda */}
                        <Box
                            sx={{
                                display: "flex",
                                gap: 3,
                                justifyContent: "flex-start",
                                mt: 1.5,
                                width: "100%",
                                left: 100
                            }}
                        >
                            <SkipBtn onSkip={() => handleNext("left", false)} />
                            <SuperLikeBtn perfilId={currentUser} onSuperLike={() => handleNext("up", false, true)} />
                            <CurtirBtn userId={currentUser} onLike={() => handleNext("right", true)} />
                            <RewindBtn onRewind={handleRewind} />
                            <IniciarChatBtn pessoa2={currentUser} />
                        </Box>
                    </div>
                ) : noMoreProfiles && cidade ? (
                    <Box sx={{ mt: 6, textAlign: "center" }}>Já acabaram os perfis nessa cidade</Box>
                ) : null}
            </Box>
        </Box>
    );
}