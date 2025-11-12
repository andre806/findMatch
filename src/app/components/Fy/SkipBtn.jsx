import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

export default function SkipBtn({ onSkip }) {
    return (
        <IconButton
            onClick={onSkip}
            sx={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "linear-gradient(135deg,#9933ff 0%,#ff66cc 100%)",
                boxShadow: "0 4px 16px #9933ff33",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 38,
                transition: "transform 0.2s",
                "&:hover": {
                    transform: "scale(1.12)",
                    background: "linear-gradient(135deg,#a855f7 0%,#ff66cc 100%)"
                }
            }}
        >
            <CloseIcon sx={{ fontSize: 38 }} />
        </IconButton>
    );
}