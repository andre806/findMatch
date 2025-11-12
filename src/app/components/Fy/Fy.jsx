import { useEffect, useState } from "react";
import MiniaturaPerfil from "./Miniatura";
import CurtirBtn from "./CurtirBtn";
import SkipBtn from "./SkipBtn";
import RewindBtn from "./rewindBtn";
import SuperLikeBtn from "./SuperLikeBtn";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Fade from "@mui/material/Fade";
import { motion, AnimatePresence } from "framer-motion";
import IniciarChatBtn from "./IniciarChatBtn";

export default function Fy() {
    const [usersId, setUsersIds] = useState([]);
    const [noMoreProfiles, setNoMoreProfiles] = useState(false);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [animDirection, setAnimDirection] = useState("");
    const url = process.env.NEXT_PUBLIC_URL;
    const [previousProfile, setPreviousProfile] = useState(null);

    async function BuscarMais() {
        const db = await fetch(`${url}feed/Fy`, {
            method: "GET",
            credentials: "include"
        });
        const res = await db.json();
        setUsersIds(res);
        setCurrentIdx(0);
        if (!res || res.filter(p => p != null).length === 0) {
            setNoMoreProfiles(true);
        } else {
            setNoMoreProfiles(false);
        }
    }

    useEffect(() => {
        async function FetchIds() {
            const db = await fetch(`${url}feed/Fy`, {
                method: "GET",
                credentials: "include"
            });
            const res = await db.json();
            setUsersIds(res);
            setCurrentIdx(0);
            if (!res || res.filter(p => p != null).length === 0) {
                setNoMoreProfiles(true);
            } else {
                setNoMoreProfiles(false);
            }
        }
        FetchIds();
    }, [url]);

    useEffect(() => {
        if (usersId.some(p => p == null) && !noMoreProfiles) {
            BuscarMais();
        }
    }, [usersId, noMoreProfiles]);

    function getNextValidIdx(startIdx) {
        for (let i = startIdx + 1; i < usersId.length; i++) {
            if (usersId[i] != null) return i;
        }
        return -1;
    }

    // Animation variants for card (efeito de queda para direita/esquerda)
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
        reset: { x: 0, y: 0, rotate: 1, rotateY: 0, opacity: 1, transition: { duration: 0.2 } }
    };

    // Helper to get animation key
    function getAnimKey() {
        if (animDirection === "left") return "skip";
        if (animDirection === "right") return "like";
        if (animDirection === "up") return "superlike";
        if (animDirection === "rewind") return "rewind";
        return "initial";
    }

    function handleNext(direction = "", doLike = false, doSuperLike = false) {
        setAnimDirection(direction);
        setTimeout(async () => {
            setPreviousProfile(usersId[currentIdx]);
            const nextIdx = getNextValidIdx(currentIdx);
            if (nextIdx === -1) {
                await BuscarMais();
            } else {
                setCurrentIdx(nextIdx);
            }
            setAnimDirection("");
        }, 400);
    }

    function handleRewind() {
        setAnimDirection("rewind");
        setTimeout(() => {
            if (previousProfile) {
                const prevIdx = usersId.findIndex(id => id === previousProfile);
                if (prevIdx !== -1) {
                    setCurrentIdx(prevIdx);
                }
            }
            setAnimDirection("");
        }, 500);
    }

    const currentUser = usersId[currentIdx];
    // Dados do perfil atual
    const [profileData, setProfileData] = useState(null);

    useEffect(() => {
        async function FetchProfileData() {
            if (!currentUser) {
                setProfileData(null);
                return;
            }
            const db = await fetch(`${url}User/Miniatura?userId=${encodeURIComponent(currentUser)}`, {
                method: "GET"
            });
            const res = await db.json();
            setProfileData(res);
        }
        FetchProfileData();
    }, [currentUser, url]);

    return (
        <Box
            sx={{
                width: "100%",
                minHeight: "60vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                py: { xs: 2, sm: 6 },
                px: { xs: 1, sm: 0 }
            }}
        >
            <Box sx={{
                width: "100%",
                maxWidth: 620,
                mx: "auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
            }}>
                <Fade in={!!currentUser && !noMoreProfiles} timeout={400}>
                    <Box
                        sx={{
                            width: "100%",
                            maxWidth: 650,
                            minHeight: { xs: 340, sm: 480, md: 600 },
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            px: 0,
                            py: 0,
                            position: "relative"
                        }}
                    >
                        {/* Card do perfil com animação */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentUser}
                                initial="initial"
                                animate={getAnimKey()}
                                exit="reset"
                                variants={cardVariants}
                                style={{
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    perspective: 1200
                                }}
                            >
                                <MiniaturaPerfil id={currentUser} />
                            </motion.div>
                        </AnimatePresence>
                        {/* Botões de ação centralizados */}
                        <Box sx={{
                            display: "flex",
                            gap: { xs: 3, sm: 5 },
                            justifyContent: "center",
                            alignItems: "center",
                            width: "100%",
                            mt: { xs: 2, sm: 3 },
                            mb: { xs: 2, sm: 3 }
                        }}>
                            <Box sx={{ '& > *': { fontSize: 48, width: 72, height: 72 } }}>
                                <SkipBtn onSkip={() => handleNext("left", false)} />
                            </Box>
                            <Box sx={{ '& > *': { fontSize: 48, width: 72, height: 72 } }}>
                                <SuperLikeBtn perfilId={currentUser} onSuperLike={() => handleNext("up", false, true)} />
                            </Box>
                            <Box sx={{ '& > *': { fontSize: 48, width: 72, height: 72 } }}>
                                <CurtirBtn userId={currentUser} onLike={() => handleNext("right", true)} />
                            </Box>
                            <Box sx={{ '& > *': { fontSize: 48, width: 72, height: 72 } }}>
                                <RewindBtn onRewind={handleRewind} />
                            </Box>
                            <Box sx={{ '& > *': { fontSize: 48, width: 72, height: 72 } }}>
                                <IniciarChatBtn pessoa2={currentUser} />
                            </Box>
                        </Box>
                    </Box>
                </Fade>
                {/* Mensagem de fim de perfis */}
                {(!currentUser || noMoreProfiles) && (
                    <Box sx={{ mt: 6, textAlign: "center", color: "#9933ff", fontWeight: 700 }}>
                        Já acabaram os perfis nessa cidade
                    </Box>
                )}
            </Box>
        </Box>
    );
}