import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";

export default function RewindBtn({ onRewind }) {
    const [scale, setScale] = useState(1);
    const url = process.env.NEXT_PUBLIC_URL;

    async function rewind(e) {
        await fetch(`${url}Relacionamento/rewind`, {
            method: "POST",
            credentials: "include"
        });
        if (onRewind) onRewind(e);
    }

    return (
        <button
            onClick={rewind}
            style={{
                background: "#f5c542",
                borderRadius: 8,
                padding: "8px 16px",
                border: "none",
                cursor: "pointer",
                transition: "transform 0.60s cubic-bezier(.4,2,.6,1)",
                transform: `scale(${scale})`
            }}
            onMouseDown={e => { setScale(1.15); e.stopPropagation(); }}
            onMouseUp={e => { setScale(1); e.stopPropagation(); }}
            onMouseLeave={() => setScale(1)}
            onMouseEnter={() => setScale(1.1)}
        >
            Rewind
        </button>
    );
}