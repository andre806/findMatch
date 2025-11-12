import IconButton from "@mui/material/IconButton";
import StarIcon from "@mui/icons-material/Star";

export default function SuperLikeBtn({ perfilId, onSuperLike }) {
    const url = process.env.NEXT_PUBLIC_URL;
    async function SuperLike(e) {
        await fetch(`${url}Relacionamento/Superlike?perfilId=${encodeURIComponent(perfilId)}`, {
            method: "GET",
            credentials: "include"
        });
        if (onSuperLike) onSuperLike();
    }
    return (
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
    );
}