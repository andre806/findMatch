'use client'
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default function Explorar() {
    const router = useRouter();
    return (
        <Box
            sx={{
                minHeight: "100vh",
                bgcolor: "linear-gradient(180deg,#f8e4e6 0%, #cbe7e7 100%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                py: 8
            }}
        >
            <Typography variant="h4" sx={{ fontWeight: 900, color: "#9933ff", mb: 5 }}>
                Explorar
            </Typography>
            <Box sx={{ display: "flex", gap: 4 }}>
                <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    sx={{
                        borderRadius: 3,
                        fontWeight: 700,
                        fontSize: 18,
                        px: 4,
                        py: 2,
                        boxShadow: 3,
                        textTransform: "none"
                    }}
                    onClick={() => router.push("/pages/explorarCidades")}
                >
                    Explorar cidades
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    sx={{
                        borderRadius: 3,
                        fontWeight: 700,
                        fontSize: 18,
                        px: 4,
                        py: 2,
                        boxShadow: 3,
                        textTransform: "none"
                    }}
                    onClick={() => router.push("/pages/explorarGostos")}
                >
                    Explorar gostos
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    sx={{
                        borderRadius: 3,
                        fontWeight: 700,
                        fontSize: 18,
                        px: 4,
                        py: 2,
                        boxShadow: 3,
                        textTransform: "none"
                    }}
                    onClick={() => router.push("/pages/explorarProfissoes")}
                >
                    Explorar profissões
                </Button>
            </Box>
        </Box>
    );
}