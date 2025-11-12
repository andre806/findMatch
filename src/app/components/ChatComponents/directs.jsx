import { useEffect, useState } from "react"
import Link from "next/link";
import GetCurtidos from "../Fy/getCurtidos";
import GetSuperLikes from "../Fy/getSuperLike";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

export default function Directs() {
    const [directs, setDirects] = useState([]);
    const [usersData, setUsersData] = useState({});
    const url = process.env.NEXT_PUBLIC_URL;

    useEffect(() => {
        async function fetchDirects() {
            const db = await fetch(`${url}direct/getDirectsByUser`, {
                method: "GET",
                credentials: "include"
            })
            const res = await db.json();
            setDirects(res);

            // Buscar dados dos usuários para todos os directs
            const users = await Promise.all(res.map(async (d) => {
                const dbUser = await fetch(`${url}direct/getNomeandFoto?userId1=${encodeURIComponent(d.pessoa1Id)}&userId2=${encodeURIComponent(d.pessoa2Id)}`, {
                    method: "GET",
                    credentials: "include"
                });
                const userRes = await dbUser.json();
                return {
                    key: `${d.pessoa1Id}-${d.pessoa2Id}`,
                    ...userRes
                };
            }));

            // Montar objeto para acesso rápido
            const usersObj = {};
            users.forEach(u => {
                usersObj[u.key] = u;
            });
            setUsersData(usersObj);
        }
        fetchDirects();
    }, [])

    return (
        <Box
            sx={{
                minHeight: "100vh",
                bgcolor: "linear-gradient(180deg,#f8e4e6 0%, #cbe7e7 100%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                py: 6
            }}
        >
            <Box sx={{ width: "100%", maxWidth: 520, mb: 4 }}>
                <GetSuperLikes />
                <GetCurtidos />
            </Box>
            <Box sx={{ width: "100%", maxWidth: 520 }}>
                {directs.map((d) => {
                    const key = `${d.pessoa1Id}-${d.pessoa2Id}`;
                    const data = usersData[key];
                    return (
                        <Card
                            key={key}
                            variant="outlined"
                            sx={{
                                mb: 2,
                                borderRadius: 4,
                                boxShadow: 2,
                                bgcolor: "#fff",
                                transition: "box-shadow 0.2s",
                                "&:hover": { boxShadow: 6, borderColor: "#9933ff" }
                            }}
                        >
                            <Link href={`/pages/Chat/${d.pessoa1Id}/${d.pessoa2Id}`} style={{ textDecoration: "none" }}>
                                <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                    <Avatar
                                        src={data?.foto}
                                        alt={data?.nome || ""}
                                        sx={{
                                            width: 48,
                                            height: 48,
                                            border: "2px solid #9933ff",
                                            mr: 2
                                        }}
                                    />
                                    <Typography sx={{ fontWeight: 700, color: "#9933ff", fontSize: 18 }}>
                                        {data ? data.nome : "Carregando..."}
                                    </Typography>
                                </CardContent>
                            </Link>
                        </Card>
                    )
                })}
            </Box>
        </Box>
    )
}