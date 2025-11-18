import { useEffect, useState } from "react";

import FotosByUser from "./FotosByUser";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";

export default function PPrivado() {

    const [perfil, setPerfil] = useState(null);
    const url = process.env.NEXT_PUBLIC_URL;



    useEffect(() => {

        const fetchPerfil = async () => {
            const db = await fetch(`${url}User/Perfil`, {
                method: "GET",
                headers: { "content-type": "application/json" },
                credentials: "include"
            });
            const res = await db.json();
            setPerfil(res);
        };
        fetchPerfil();
    }, [url]);

    const interests = perfil?.interesses && Array.isArray(perfil.interesses)
        ? perfil.interesses
        : [];

    // Lista de campos para exibir
    const campos = [
        { key: "nome", label: "Nome" },
        { key: "idade", label: "Idade" },
        { key: "cidade", label: "Cidade" },
        { key: "bio", label: "Bio" },
        { key: "ocupacao", label: "Ocupação" },
        { key: "educacao", label: "Educação" },
        { key: "genero", label: "Gênero" },
        { key: "sexualidade", label: "Sexualidade" },
        { key: "toProcurando", label: "Procurando" },
        { key: "cidadesExibicao", label: "Cidades de Exibição" },
        { key: "gostos", label: "Gostos" },
        { key: "compatibilidade", label: "Compatibilidade" },
        { key: "distancia", label: "Distância" }
    ];

    return (
        <Box sx={{
            minHeight: "100vh",
            bgcolor: "linear-gradient(180deg,#f8e4e6 0%, #cbe7e7 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            py: 6
        }}>
            <Card sx={{
                maxWidth: 600,
                width: "100%",
                borderRadius: 6,
                boxShadow: "0 4px 32px #0002",
                bgcolor: "#fff",
                p: 0,
                overflow: "visible"
            }}>
                <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#222", mb: 1 }}>
                            Sobre mim
                        </Typography>
                        {/* Exibe todos os campos não nulos */}
                        <Box sx={{ mb: 2 }}>
                            {campos.map(({ key, label }) =>
                                perfil?.[key] ? (
                                    <Typography key={key} sx={{ color: "#555", fontSize: 16, mb: 1 }}>
                                        <b>{label}:</b> {Array.isArray(perfil[key]) ? perfil[key].join(", ") : perfil[key]}
                                    </Typography>
                                ) : null
                            )}
                        </Box>
                        {/* Interesses */}
                        {interests.length > 0 && (
                            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                                {interests.map((interest, idx) => (
                                    <Chip
                                        key={interest}
                                        label={interest}
                                        sx={{
                                            bgcolor: "#f8e4e6",
                                            color: "#222",
                                            fontWeight: 700,
                                            fontSize: 15,
                                            px: 2,
                                            py: 1,
                                            borderRadius: 2,
                                            boxShadow: "0 2px 8px #eabfff22"
                                        }}
                                    />
                                ))}
                            </Stack>
                        )}
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#222", mb: 1 }}>
                            Galeria de Fotos
                        </Typography>
                        <FotosByUser />
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}