import IconButton from "@mui/material/IconButton";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useState } from "react";

export default function CurtirBtn({ userId, onLike }) {
    const url = process.env.NEXT_PUBLIC_URL;
    const [resposta, setRepostas] = useState();
    const [showMatch, setShowMatch] = useState(false);
    const router = useRouter();

    async function curtir(e) {
        const db = await fetch(`${url}Relacionamento/curtir?perfilId=${encodeURIComponent(userId)}`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        });
        const res = await db.text();
        setRepostas(res);
        if (res === "chat Criado") {
            setShowMatch(true);
            setTimeout(() => {
                setShowMatch(false);
                router.push("/pages/directs");
            }, 1500);
        } else {
            if (onLike) onLike();
        }
    }
    return (
        <>
            <IconButton
                onClick={curtir}
                sx={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg,#ff66cc 0%,#9933ff 100%)",
                    boxShadow: "0 4px 16px #ff66cc33",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ff66cc",
                    fontSize: 38,
                    transition: "transform 0.2s",
                    "&:hover": {
                        transform: "scale(1.12)",
                        background: "linear-gradient(135deg,#ff66cc 0%,#e040fb 100%)"
                    }
                }}
            >
                <FavoriteIcon sx={{ fontSize: 38 }} />
            </IconButton>
            <AnimatePresence>
                {showMatch && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1.2, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.6 }}
                        style={{
                            position: "fixed",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            zIndex: 9999,
                            background: "rgba(255,255,255,0.98)",
                            borderRadius: 32,
                            padding: "56px 80px",
                            boxShadow: "0 8px 32px #9933ff55",
                            textAlign: "center",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        <span style={{ fontSize: 64, color: "#9933ff", fontWeight: 900, letterSpacing: 2 }}>MATCH!!!</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}