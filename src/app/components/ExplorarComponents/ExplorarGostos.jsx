import { useEffect, useState, useRef } from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import MiniaturaPerfil from "../Fy/Miniatura";
import CurtirBtn from "../Fy/CurtirBtn";
import SkipBtn from "../Fy/SkipBtn";
import gostosJson from "@/app/json/gostos.json";

export default function ExplorarGostos() {
    const [ids, setIds] = useState([]);
    const [gosto, setGosto] = useState("");
    const [search, setSearch] = useState("");
    const [currentIdx, setCurrentIdx] = useState(0);
    const [noMoreProfiles, setNoMoreProfiles] = useState(false);
    const [animDirection, setAnimDirection] = useState("");
    const [dragX, setDragX] = useState(0);
    const dragStartX = useRef(null);
    const dragging = useRef(false);
    const url = process.env.NEXT_PUBLIC_URL;
    const GOSTOS_LIST = Array.isArray(gostosJson)
        ? gostosJson
        : Object.values(gostosJson).flat();

    useEffect(() => {
        async function fetchGostos() {
            if (!gosto) {
                setIds([]);
                setCurrentIdx(0);
                setNoMoreProfiles(false);
                return;
            }
            const db = await fetch(`${url}explorar/explorargostos?gosto=${encodeURIComponent(gosto)}`, {
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
        fetchGostos();
    }, [gosto, url]);

    function getNextValidIdx(startIdx) {
        for (let i = startIdx + 1; i < ids.length; i++) {
            if (ids[i] != null) return i;
        }
        return -1;
    }

    async function curtirPerfil(userId) {
        await fetch(`${url}Relacionamento/curtir?perfilId=${userId}`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: userId })
        });
    }

    async function buscarMaisPerfis() {
        const db = await fetch(`${url}explorar/explorargostos?gosto=${encodeURIComponent(gosto)}`, {
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

    function handleNext(direction = "", doLike = false) {
        setAnimDirection(direction);
        setDragX(0);
        setTimeout(async () => {
            if (doLike && ids[currentIdx]) {
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

    // Drag handlers
    function onDragStart(e) {
        dragging.current = true;
        setDragX(0);
        dragStartX.current = e.type === "touchstart"
            ? e.touches[0].clientX
            : e.clientX;
    }

    function onDragMove(e) {
        if (!dragging.current) return;
        const clientX = e.type === "touchmove"
            ? e.touches[0].clientX
            : e.clientX;
        setDragX(clientX - dragStartX.current);
    }

    function onDragEnd() {
        dragging.current = false;
        if (dragX > 100) {
            handleNext("right", true);
        } else if (dragX < -100) {
            handleNext("left", false);
        } else {
            setDragX(0);
        }
    }

    const currentUser = ids[currentIdx];

    const animStyles = {
        transition: animDirection
            ? "transform 0.35s cubic-bezier(.4,2,.6,1), opacity 0.35s"
            : dragX !== 0
                ? "none"
                : "transform 0.2s",
        transform:
            animDirection === "right"
                ? "translateX(120vw) rotate(20deg)"
                : animDirection === "left"
                    ? "translateX(-120vw) rotate(-20deg)"
                    : dragX !== 0
                        ? `translateX(${dragX}px) rotate(${dragX / 18}deg)`
                        : "translateX(0)",
        opacity: animDirection ? 0 : 1,
        cursor: dragX !== 0 ? "grabbing" : "grab",
        touchAction: "pan-y"
    };

    const gostosFiltrados = search
        ? GOSTOS_LIST.filter(g =>
            g.toLowerCase().includes(search.toLowerCase())
        )
        : GOSTOS_LIST;

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
            {/* Barra de gostos fixa no canto esquerdo */}
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
                    placeholder="Pesquisar gosto"
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
                    {gostosFiltrados.map((g, idx) => (
                        <ListItem key={idx} disablePadding sx={{ mb: 1 }}>
                            <Box
                                sx={{
                                    width: "100%",
                                    borderRadius: 2,
                                    bgcolor: gosto === g ? "#444" : "#18181b",
                                    border: gosto === g ? "2px solid #a855f7" : "2px solid transparent",
                                    boxShadow: gosto === g ? 4 : 0,
                                    transition: "all 0.2s",
                                }}
                            >
                                <ListItemButton
                                    selected={gosto === g}
                                    onClick={() => setGosto(g)}
                                    sx={{
                                        color: "#fff",
                                        borderRadius: 2,
                                        "&:hover": { bgcolor: "#333" },
                                        minHeight: 36
                                    }}
                                >
                                    <ListItemText primary={g} />
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
                        onMouseDown={onDragStart}
                        onMouseMove={dragging.current ? onDragMove : undefined}
                        onMouseUp={onDragEnd}
                        onMouseLeave={dragging.current ? onDragEnd : undefined}
                        onTouchStart={onDragStart}
                        onTouchMove={onDragMove}
                        onTouchEnd={onDragEnd}
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
                                width: "100%"
                            }}
                        >
                            <SkipBtn onSkip={() => handleNext("left", false)} />
                            <CurtirBtn userId={currentUser} onLike={() => handleNext("right", true)} />
                        </Box>
                    </div>
                ) : noMoreProfiles && gosto ? (
                    <Box sx={{ mt: 6, textAlign: "center" }}>Já acabaram os perfis com esse gosto</Box>
                ) : null}
            </Box>
        </Box>
    );
}