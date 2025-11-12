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
import profissoesJson from "@/app/json/profissoes.json";
import { motion, AnimatePresence } from "framer-motion";

export default function ExplorarProfissoes() {
    const [ids, setIds] = useState([]);
    const [profissao, setProfissao] = useState("");
    const [search, setSearch] = useState("");
    const [currentIdx, setCurrentIdx] = useState(0);
    const [noMoreProfiles, setNoMoreProfiles] = useState(false);
    const [animDirection, setAnimDirection] = useState("");
    const url = process.env.NEXT_PUBLIC_URL;
    const PROFISSOES_LIST = Array.isArray(profissoesJson)
        ? profissoesJson
        : Object.values(profissoesJson).flat();

    useEffect(() => {
        async function fetchProfissoes() {
            if (!profissao) {
                setIds([]);
                setCurrentIdx(0);
                setNoMoreProfiles(false);
                return;
            }
            const db = await fetch(`${url}explorar/explorarProfissoes?profissao=${encodeURIComponent(profissao)}`, {
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
        fetchProfissoes();
    }, [profissao, url]);

    function getNextValidIdx(startIdx) {
        for (let i = startIdx + 1; i < ids.length; i++) {
            if (ids[i] != null) return i;
        }
        return -1;
    }

    // Função para curtir (usada no drag e no botão)
    async function curtirPerfil(userId) {
        await fetch(`${url}Relacionamento/curtir?perfilId=${userId}`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        });
    }

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
        const db = await fetch(`${url}explorar/explorarprofissoes?profissao=${encodeURIComponent(profissao)}`, {
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

    const profissoesFiltradas = search
        ? PROFISSOES_LIST.filter(p =>
            p.toLowerCase().includes(search.toLowerCase())
        )
        : PROFISSOES_LIST;

    // Adicione esta definição antes do return:
    const cardVariants = {
        initial: { x: 0, y: 0, rotate: 0, opacity: 1 },
        skip: {
            x: -200,
            y: 400,
            rotate: -35,
            opacity: 0,
            transition: { duration: 0.5, ease: "easeIn" }
        },
        like: {
            x: 200,
            y: 400,
            rotate: 35,
            opacity: 0,
            transition: { duration: 0.5, ease: "easeIn" }
        },
        superlike: { y: -600, opacity: 0, transition: { duration: 0.4 } },
        rewind: {
            rotateY: [0, 90, 0],
            opacity: [1, 0, 1],
            transition: { duration: 0.5 }
        },
        reset: { x: 0, y: 0, rotate: 0, rotateY: 0, opacity: 1, transition: { duration: 0.2 } }
    };

    function getAnimKey() {
        if (animDirection === "left") return "skip";
        if (animDirection === "right") return "like";
        if (animDirection === "up") return "superlike";
        if (animDirection === "rewind") return "rewind";
        return "initial";
    }

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
            {/* Barra de profissões fixa no canto esquerdo */}
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
                    placeholder="Pesquisar profissão"
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
                    {profissoesFiltradas.map((p, idx) => (
                        <ListItem key={idx} disablePadding sx={{ mb: 1 }}>
                            <Box
                                sx={{
                                    width: "100%",
                                    borderRadius: 2,
                                    bgcolor: profissao === p ? "#444" : "#18181b",
                                    border: profissao === p ? "2px solid #a855f7" : "2px solid transparent",
                                    boxShadow: profissao === p ? 4 : 0,
                                    transition: "all 0.2s",
                                }}
                            >
                                <ListItemButton
                                    selected={profissao === p}
                                    onClick={() => setProfissao(p)}
                                    sx={{
                                        color: "#fff",
                                        borderRadius: 2,
                                        "&:hover": { bgcolor: "#333" },
                                        minHeight: 36
                                    }}
                                >
                                    <ListItemText primary={p} />
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
                    pl: { xs: 0, sm: 30 },
                    ml: { xs: 0, sm: 28 }
                }}
            >
                {/* Card central estilo Fy */}
                <Box sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    minHeight: 400,
                    maxWidth: 650
                }}>
                    <Box sx={{
                        transform: "scale(0.8)",
                        transformOrigin: "top center",
                        width: "100%"
                    }}>
                        <AnimatePresence mode="wait">
                            {currentUser && !noMoreProfiles && (
                                <motion.div
                                    key={currentUser}
                                    initial="initial"
                                    exit="reset"
                                    variants={cardVariants}
                                    style={{
                                        width: "100%",
                                        display: "center",
                                        gap: 6,
                                        flexDirection: "column",
                                        alignItems: "center",
                                        perspective: 1200
                                    }}
                                >
                                    <MiniaturaPerfil id={currentUser} sx={{ transform: "scale(0.7)", transformOrigin: "top center" }} />
                                    {/* Botões abaixo da miniatura, alinhados à direita */}
                                    <Box
                                        sx={{
                                            display: "flex",
                                            gap: 3,
                                            justifyContent: "space-around",
                                            mt: -1,
                                            width: "100%",
                                            pr: 8
                                        }}
                                    >
                                        <SkipBtn onSkip={() => handleNext("left", false)} />
                                        <SuperLikeBtn perfilId={currentUser} onSuperLike={() => handleNext("up", false, true)} />
                                        <CurtirBtn userId={currentUser} onLike={() => handleNext("right", true)} />
                                        <RewindBtn onRewind={handleRewind} />
                                        <IniciarChatBtn pessoa2={currentUser} />
                                    </Box>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        {(!currentUser || noMoreProfiles) && profissao && (
                            <Box sx={{ mt: 6, textAlign: "center", color: "#9933ff", fontWeight: 700 }}>
                                Já acabaram os perfis com essa profissão
                            </Box>
                        )}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
