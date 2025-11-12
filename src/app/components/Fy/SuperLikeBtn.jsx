import IconButton from "@mui/material/IconButton";
import StarIcon from "@mui/icons-material/Star";
import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function SuperLikeBtn({ perfilId, onSuperLike }) {
    const url = process.env.NEXT_PUBLIC_URL;
    const [showMatch, setShowMatch] = useState(false);

    async function SuperLike(e) {
        const db = await fetch(`${url}Relacionamento/Superlike?perfilId=${encodeURIComponent(perfilId)}`, {
            method: "GET",
            credentials: "include"
        });
        const res = await db.text();
        if (res === "chat Criado") {
            setShowMatch(true);
            setTimeout(() => {
                setShowMatch(false);
                alert("Match! Agora vocês podem conversar.");
            }, 1800);
        }
        if (onSuperLike) onSuperLike();
    }

    return (
        <>
            <IconButton
                onClick={SuperLike}
                sx={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg,#ffe066 0%,#f5c542 100%)",
                    boxShadow: "0 4px 16px #f5c54233",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#f5c542",
                    fontSize: 38,
                    transition: "transform 0.2s",
                    "&:hover": {
                        transform: "scale(1.12)",
                        background: "linear-gradient(135deg,#ffe066 0%,#ffd700 100%)"
                    }
                }}
            >
                <StarIcon sx={{ fontSize: 38 }} />
            </IconButton>
            {showMatch && (
                <Box
                    sx={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        bgcolor: "rgba(0,0,0,0.7)",
                        zIndex: 9999,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        animation: "fadeIn 0.3s",
                    }}
                >
                    <Box
                        sx={{
                            bgcolor: "#fff",
                            borderRadius: 6,
                            boxShadow: 8,
                            p: 5,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 2,
                            animation: "pop 0.7s",
                        }}
                    >
                        <Typography variant="h3" sx={{
                            fontWeight: 900,
                            color: "#9933ff",
                            mb: 2,
                            textAlign: "center",
                            letterSpacing: 2,
                            textShadow: "0 2px 16px #9933ff55"
                        }}>
                            🎉 MATCH! 🎉
                        </Typography>
                        <Typography variant="h5" sx={{ color: "#333", fontWeight: 700 }}>
                            Agora vocês podem conversar!
                        </Typography>
                    </Box>
                    <style>{`
                        @keyframes fadeIn {
                            from { opacity: 0; }
                            to { opacity: 1; }
                        }
                        @keyframes pop {
                            0% { transform: scale(0.7); }
                            60% { transform: scale(1.1); }
                            100% { transform: scale(1); }
                        }
                    `}</style>
                </Box>
            )}
        </>
    );
}