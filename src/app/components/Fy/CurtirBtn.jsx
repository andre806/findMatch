import { useState } from "react";
import IconButton from "@mui/material/IconButton";

export default function CurtirBtn({ userId, onLike }) {
    const url = process.env.NEXT_PUBLIC_URL;
    const [scale, setScale] = useState(1);

    async function curtir() {
        await fetch(`${url}Relacionamento/curtir?perfilId=${userId}`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: userId })
        });
        if (onLike) onLike();
    }

    return (
        <IconButton
            onClick={curtir}
            onMouseDown={() => setScale(1.15)}
            onMouseUp={() => setScale(1)}
            onMouseLeave={() => setScale(1)}
            onMouseEnter={() => setScale(1.1)}
            sx={{
                p: 0,
                transition: "transform 0.60s cubic-bezier(.4,2,.6,1)",
                transform: `scale(${scale})`
            }}
        >
            <img
                src="/Fy/CurtirBtn/BTN.png"
                alt="Curtir"
                style={{
                    width: 64,
                    height: 64,
                    transition: "transform 0.15s cubic-bezier(.4,2,.6,1)"
                }}
            />
        </IconButton>
    );
}