import Button from "@mui/material/Button";
import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function IniciarChatBtn({ pessoa2 }) {
    const url = process.env.NEXT_PUBLIC_URL;
    const [showMatch, setShowMatch] = useState(false);

    async function iniciarChat() {
        const res = await fetch(`${url}Relacionamento/iniciarChat?pessoa2=${pessoa2}`, {
            method: "POST",
            credentials: "include"
        });
        const resposta = await res.text();
        if (resposta === "chat Criado") {
            setShowMatch(true);
            setTimeout(() => {
                setShowMatch(false);
                alert("Match! Agora vocês podem conversar.");
            }, 1800);
        }
    }

    return (
        <>
            <Button
                variant="contained"
                color="primary"
                size="large"
                sx={{
                    fontSize: 32,
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    minWidth: 0,
                    boxShadow: 3,
                    textTransform: "none"
                }}
                onClick={iniciarChat}
            >
                💬
            </Button>
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