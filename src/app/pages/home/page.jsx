'use client'
import Box from "@mui/material/Box";
import Fy from "@/app/components/Fy/Fy";

export default function HomePage() {
    return (
        <Box sx={{
            bgcolor: "#f8f8fc",
            minHeight: "100vh",
            display: "flex",
            alignItems: "flex-start", // topo
            justifyContent: "center"
        }}>
            <Box sx={{
                flex: "1 1 520px",
                maxWidth: 520,
                minWidth: 320,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                transform: "scale(0.8)",
                transformOrigin: "center",
                mt: -15 // margem superior menor
            }}>
                <Fy />
            </Box>
        </Box>
    );
}