import { useState } from "react";
import IconButton from "@mui/material/IconButton";

export default function SkipBtn({ onSkip }) {
    const [scale, setScale] = useState(1);

    return (
        <IconButton
            onClick={onSkip}
            onMouseDown={() => setScale(1.15)}
            onMouseUp={() => setScale(1)}
            onMouseLeave={() => setScale(1)}
            onMouseEnter={() => setScale(1.10)}
            sx={{
                p: 0,
                transition: "transform 0.60s cubic-bezier(.4,2,.6,1)",
                transform: `scale(${scale})`
            }}
        >
            <img
                src="/Fy/skipBtn.png"
                alt="Skip"
                style={{ width: 64, height: 64, transition: "transform 0.15s cubic-bezier(.4,2,.6,1)" }}
            />
        </IconButton>
    );
}