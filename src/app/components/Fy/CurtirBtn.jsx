import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";

export default function CurtirBtn({ userId, onLike }) {
    const url = process.env.NEXT_PUBLIC_URL;
    async function curtir(e) {
        await fetch(`${url}Relacionamento/curtir?perfilId=${encodeURIComponent(userId)}`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (onLike) onLike();
    }
    return (
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
    );
}