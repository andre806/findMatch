import React from "react";
import IconButton from "@mui/material/IconButton";
import ReplayIcon from "@mui/icons-material/Replay";

export default function RewindBtn({ onRewind }) {
    const url = process.env.NEXT_PUBLIC_URL;

    async function rewind(e) {
        await fetch(`${url}Relacionamento/rewind`, {
            method: "POST",
            credentials: "include"
        });
        if (onRewind) onRewind(e);
    }

    return (
        <IconButton
            onClick={rewind}
            sx={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "linear-gradient(135deg,#9933ff 0%,#e0c3fc 100%)",
                boxShadow: "0 4px 16px #9933ff33",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#9933ff",
                fontSize: 38,
                transition: "transform 0.2s",
                "&:hover": {
                    transform: "scale(1.12)",
                    background: "linear-gradient(135deg,#a855f7 0%,#e0c3fc 100%)"
                }
            }}
        >
            <ReplayIcon sx={{ fontSize: 38 }} />
        </IconButton>
    );
}