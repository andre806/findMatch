'use client'
import Link from "next/link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useState, useEffect } from "react";

export default function NavBar({ style = {} }) {
    const navItems = [
        { href: "/pages/home", img: "/navbar/home.png", alt: "Home", label: "Home" },
        { href: "/pages/perfil", img: "/navbar/perfil.png", alt: "Perfil", label: "Perfil" },
        { href: "/pages/explorar", img: "/navbar/explore.png", alt: "Explorar", label: "Explorar" },
        { href: "/superLikes", img: "/navbar/superLikes.png", alt: "SuperLikes", label: "SuperLikes" },
        { href: "/pages/directs", img: "/navbar/matchs.png", alt: "Matchs", label: "Matchs" },
        { href: "/private/login", img: "/navbar/login.png", alt: "Login", label: "Login" } // Novo link para login
    ];

    const [hovered, setHovered] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Atualiza isMobile após o carregamento do cliente
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 480);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Responsividade: ajuste tamanhos conforme a largura da tela
    const iconSize = isMobile ? 40 : 72;
    const fontSize = isMobile ? 10 : 13;
    const gapSize = isMobile ? 2 : 8;
    const maxWidth = isMobile ? 320 : 540;
    const navHeight = isMobile ? 60 : 90;

    if (!mounted) return null;

    return (
        <Paper
            elevation={8}
            sx={{
                width: "100%",
                height: { xs: 60, sm: 90 },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "fixed",
                bottom: 0,
                left: 0,
                zIndex: 10,
                px: 1,
                ...style
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    gap: { xs: 2, sm: 8 },
                    alignItems: "flex-end",
                    justifyContent: "center",
                    width: "100%",
                    maxWidth: { xs: 320, sm: 540 }
                }}
            >
                {navItems.map((item, idx) => (
                    <Box key={item.href} sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <Link href={item.href} >
                            <IconButton
                                sx={{
                                    p: 0,
                                    borderRadius: 2,
                                    transition: "background 0.2s",
                                    "&:hover": {
                                        background: "rgba(255,255,255,0.08)"
                                    },
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center"
                                }}
                                onMouseEnter={() => setHovered(idx)}
                                onMouseLeave={() => setHovered(null)}
                                onFocus={() => setHovered(idx)}
                                onBlur={() => setHovered(null)}
                            >
                                <img
                                    src={item.img}
                                    alt={item.alt}
                                    style={{
                                        width: "clamp(36px, 8vw, 72px)",
                                        height: "clamp(36px, 8vw, 72px)",
                                        objectFit: "contain",
                                        filter: hovered === idx
                                            ? "drop-shadow(0 4px 12px #000b)"
                                            : "drop-shadow(0 2px 6px #0008)",
                                        transform: hovered === idx
                                            ? "scale(1.18)"
                                            : "scale(1)",
                                        transition: "transform 1.0s cubic-bezier(.4,2,.6,1), filter 0.8s"
                                    }}
                                    className="navbar-icon"
                                />
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: "#111",
                                        fontSize: { xs: 10, sm: 13 },
                                        fontWeight: 500,
                                        mt: 0.5,
                                        transition: "transform 1.0s cubic-bezier(.4,2,.6,1), color 0.8s",
                                        transform: hovered === idx
                                            ? "scale(1.18)"
                                            : "scale(1)"
                                    }}
                                >
                                    {item.label}
                                </Typography>
                            </IconButton>
                        </Link>
                    </Box>
                ))}
            </Box>
        </Paper>
    );
}