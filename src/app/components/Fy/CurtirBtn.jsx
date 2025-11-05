import { useState, useRef, useCallback } from "react";
import IconButton from "@mui/material/IconButton";

export default function CurtirBtn({ userId, onLike }) {
    const url = process.env.NEXT_PUBLIC_URL;
    const [scale, setScale] = useState(1);
    const [loading, setLoading] = useState(false);
    const called = useRef(false);

    // useCallback para garantir referência única
    const curtir = useCallback(async (e) => {
        if (loading || called.current) return;
        called.current = true;
        setLoading(true);
        e?.stopPropagation?.();
        try {
            await fetch(`${url}Relacionamento/curtir?perfilId=${encodeURIComponent(userId)}`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (onLike) onLike();
        } finally {
            setLoading(false);
            setTimeout(() => { called.current = false; }, 500);
        }
    }, [loading, url, userId, onLike]);

    return (
        <IconButton
            onClick={curtir}
            disabled={loading}
            onMouseDown={e => { setScale(1.15); e.stopPropagation(); }}
            onMouseUp={e => { setScale(1); e.stopPropagation(); }}
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