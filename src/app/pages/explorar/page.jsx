'use client'
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import RequireAuth from "@/app/services/VerificaLogado";

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
                py: { xs: 3, sm: 8 },
                px: { xs: 1, sm: 0 }
            }}
        >
        
            <Typography
                variant="h4"
                sx={{
                    fontWeight: 900,
                    color: "#9933ff",
                    mb: { xs: 3, sm: 5 },
                    fontSize: { xs: "2rem", sm: "2.5rem" },
                    textAlign: "center"
                }}
            >
                Explorar
            </Typography>
            <Box
                sx={{
                    display: "flex",
                    gap: { xs: 2, sm: 4 },
                    flexDirection: { xs: "column", sm: "row" },
                    width: { xs: "100%", sm: "auto" },
                    alignItems: "center"
                }}
            >
                <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    sx={{
                        borderRadius: 3,
                        fontWeight: 700,
                        fontSize: { xs: 16, sm: 18 },
                        px: { xs: 2, sm: 4 },
                        py: { xs: 1.5, sm: 2 },
                        boxShadow: 3,
                        textTransform: "none",
                        width: { xs: "100%", sm: "auto" }
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
                        fontSize: { xs: 16, sm: 18 },
                        px: { xs: 2, sm: 4 },
                        py: { xs: 1.5, sm: 2 },
                        boxShadow: 3,
                        textTransform: "none",
                        width: { xs: "100%", sm: "auto" }
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
                        fontSize: { xs: 16, sm: 18 },
                        px: { xs: 2, sm: 4 },
                        py: { xs: 1.5, sm: 2 },
                        boxShadow: 3,
                        textTransform: "none",
                        width: { xs: "100%", sm: "auto" }
                    }}
                    onClick={() => router.push("/pages/explorarProfissoes")}
                >
                    Explorar profissões
                </Button>
            </Box>
        </Box>
    );
}