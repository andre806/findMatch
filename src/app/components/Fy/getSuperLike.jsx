import { useEffect, useState } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Badge from "@mui/material/Badge";
import Typography from "@mui/material/Typography";

export default function GetSuperLikes() {
    const url = process.env.NEXT_PUBLIC_URL;
    const [count, setCount] = useState(null);
    useEffect(() => {
        async function fetchCount() {
            const db = await fetch(`${url}User/getQuantidadeSuperLike`, {
                method: "GET",
                credentials: "include"
            });
            const res = await db.json();
            setCount(res);
        }
        fetchCount();
    }, []);
    return (
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Link href="/pages/superLikes" style={{ textDecoration: "none" }}>
                <Badge
                    badgeContent={count}
                    color="secondary"
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
                            bgcolor: "#a855f7"
                        }
                    }}
                >
                    <Typography
                        sx={{
                            fontWeight: 700,
                            color: "#a855f7",
                            fontSize: 18,
                            px: 2,
                            py: 1,
                            borderRadius: 2,
                            bgcolor: "#f3e8ff",
                            boxShadow: 2,
                            transition: "box-shadow 0.2s",
                            "&:hover": { boxShadow: 6, bgcolor: "#e9d5ff" }
                        }}
                    >
                        SuperLikes
                    </Typography>
                </Badge>
            </Link>
        </Box>
    );
}