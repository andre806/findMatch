import { useEffect, useState } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Badge from "@mui/material/Badge";
import Typography from "@mui/material/Typography";

export default function GetCurtidos() {
    const [curtidaCount, setCurtidaCount] = useState(null);
    const url = process.env.NEXT_PUBLIC_URL;
    useEffect(() => {
        async function fetchCurtodaCount() {
            const db = await fetch(`${url}User/getQuantidadeCurtidas`, {
                method: "GET",
                credentials: "include"
            });
            const res = await db.json();
            setCurtidaCount(res);
        }
        fetchCurtodaCount();
    }, []);
    return (
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Link href="/pages/curtidas" style={{ textDecoration: "none" }}>
                <Badge
                    badgeContent={curtidaCount}
                    color="warning"
                    sx={{
                        "& .MuiBadge-badge": {
                            fontSize: 14,
                            fontWeight: 700,
                            minWidth: 22,
                            height: 22,
                            borderRadius: "50%",
                            boxShadow: "0 2px 6px #0008",
                            right: -18,
                            top: 2,
                        }
                    }}
                >
                    <Typography
                        sx={{
                            fontWeight: 700,
                            color: "#9933ff",
                            fontSize: 18,
                            px: 2,
                            py: 1,
                            borderRadius: 2,
                            bgcolor: "#f8e4e6",
                            boxShadow: 2,
                            transition: "box-shadow 0.2s",
                            "&:hover": { boxShadow: 6, bgcolor: "#e9d5ff" }
                        }}
                    >
                        Curtidas
                    </Typography>
                </Badge>
            </Link>
        </Box>
    );
}