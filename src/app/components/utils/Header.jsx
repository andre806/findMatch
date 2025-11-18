'use client'
import {
    AppBar, Toolbar, IconButton, Typography, Box, Button, Avatar, Drawer
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function Header() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    return (
        <>
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    bgcolor: "#fff",
                    boxShadow: "0 2px 12px #0001",
                    borderRadius: 0,
                    zIndex: 100,
                }}
            >
                <Toolbar sx={{
                    px: { xs: 1, sm: 2, md: 4 },
                    minHeight: { xs: 56, sm: 72 },
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: { xs: "space-between", sm: "flex-start" },
                    alignItems: "center"
                }}>
                    {/* Logo centralizado no mobile */}
                    <Box sx={{
                        display: "flex",
                        alignItems: "center",
                        flexGrow: 1,
                        justifyContent: { xs: "center", sm: "flex-start" }
                    }}>
                        {/* Logo removida */}
                    </Box>
                    {/* Menus - Drawer no mobile */}
                    <Box sx={{
                        display: { xs: "none", sm: "flex" },
                        gap: { sm: 2, md: 4 },
                        alignItems: "center"
                    }}>
                        {["Início", "Matchs", "Explorar"].map((menu, idx) => (
                            <Button
                                key={menu}
                                sx={{
                                    fontWeight: 700,
                                    color: "#9933ff",
                                    fontSize: { sm: 13, md: 16 },
                                    borderBottom:
                                        (menu === "Matchs" && (pathname === "/pages/direct" || pathname === "/pages/directs"))
                                            ? "3px solid #9933ff"
                                            : (menu === "Início" && pathname === "/pages/home")
                                                ? "3px solid #9933ff"
                                                : (menu === "Explorar" && pathname === "/pages/explorar")
                                                    ? "3px solid #9933ff"
                                                    : "none",
                                    borderRadius: 0,
                                    px: 2,
                                    transition: "color 0.3s"
                                }}
                                onClick={() => {
                                    if (menu === "Matchs") router.push("/pages/directs");
                                    if (menu === "Início") router.push("/pages/home");
                                    if (menu === "Explorar") router.push("/pages/explorar");
                                }}
                            >
                                {menu}
                            </Button>
                        ))}
                    </Box>
                    {/* Avatar e notificações - menores no mobile */}
                    <Box sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        ml: 2
                    }}>
                        {/* Removido o IconButton do sininho */}
                        <Avatar
                            src="/demo/avatar.jpg"
                            sx={{
                                width: { xs: 28, sm: 40 },
                                height: { xs: 28, sm: 40 },
                                border: "2px solid #9933ff",
                                cursor: "pointer"
                            }}
                            onClick={() => router.push("/pages/perfil")}
                        />
                    </Box>
                    {/* Botão menu lateral mobile */}
                    <Box sx={{ display: { xs: "flex", sm: "none" }, ml: 1 }}>
                        <IconButton onClick={() => setDrawerOpen(true)} sx={{ p: 0.5 }}>
                            <MenuIcon sx={{ color: "#9933ff", fontSize: 28 }} />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            {/* Drawer lateral para mobile */}
            <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                <Box sx={{ width: 220, p: 2 }}>
                    {["Início", "Matchs", "Explorar"].map((menu, idx) => (
                        <Button
                            key={menu}
                            fullWidth
                            sx={{
                                fontWeight: 700,
                                color: "#9933ff",
                                fontSize: 16,
                                mb: 1,
                                borderBottom:
                                    (menu === "Matchs" && (pathname === "/pages/directs" || pathname === "/pages/directs"))
                                        ? "3px solid #9933ff"
                                        : (menu === "Início" && pathname === "/pages/home")
                                            ? "3px solid #9933ff"
                                            : (menu === "Explorar" && pathname === "/pages/explorar")
                                                ? "3px solid #9933ff"
                                                : "none",
                                borderRadius: 0,
                                px: 2,
                                transition: "color 0.3s"
                            }}
                            onClick={() => {
                                if (menu === "Matchs") router.push("/pages/directs");
                                if (menu === "Início") router.push("/pages/home");
                                if (menu === "Explorar") router.push("/pages/explorar");
                            }}
                        >
                            {menu}
                        </Button>
                    ))}
                </Box>
            </Drawer>
            {/* Espaço para AppBar */}
            <Box sx={{ height: { xs: 56, sm: 72 } }} />
        </>
    );
}