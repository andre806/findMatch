import { useState } from "react";
import IconButton from "@mui/material/IconButton";

export default function SuperLikeBtn({ perfilId, onSuperLike }) {
    const url = process.env.NEXT_PUBLIC_URL;
    const [scale, setScale] = useState(1);
    const [loading, setLoading] = useState(false);

    async function SuperLike(e) {
        if (loading) return;
        setLoading(true);
        e?.stopPropagation?.();
        try {
            await fetch(`${url}Relacionamento/Superlike?perfilId=${encodeURIComponent(perfilId)}`, {
                method: "GET",
                credentials: "include"
            });
            if (onSuperLike) onSuperLike();
        } finally {
            setLoading(false);
        }
    }

    return (
        <IconButton
            onClick={SuperLike}
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
                src="/navBar/superLikes.png"
                alt="Super Like"
                style={{
                    width: 64,
                    height: 64,
                    transition: "transform 0.15s cubic-bezier(.4,2,.6,1)"
                }}
            />
        </IconButton>
    );
}