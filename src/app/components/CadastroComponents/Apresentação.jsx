import { Container, Typography, Box, Paper, Button } from '@mui/material';
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from 'react';
import { SessionProvider } from 'next-auth/react';
function getTokenFromCookies() {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(/(?:^|; )token=([^;]*)/);
    return match ? match[1] : null;
}

function Apresentacao() {
    const url = "https://demo-billowing-pine-7198.fly.dev";
    const { data: session, status } = useSession();
    const [logado, setLogado] = useState(null);
    const [user, setUser] = useState({ nome: "", email: "" });
    const [passo1, setPasso1] = useState(null);

    useEffect(() => {
        if (!session?.user?.email) return;
        async function fetchPasso1() {
            const db = await fetch(`https://demo-billowing-pine-7198.fly.dev/User/verificaPasso1?email=${session.user.email}`);
            const res = await db.json();
            setPasso1(res);
        }
        fetchPasso1();
    }, [session, url]);

    useEffect(() => {
        if (status === "authenticated" && passo1 !== null) {
            if (passo1 === false) {
                window.location.href = "/pages/Passo1";
            } else {
                window.location.href = "/pages/perfil";
            }
        }
    }, [status, passo1]);

    useEffect(() => {
        if (!session) return;
        setUser(prev => ({
            ...prev,
            email: session.user?.email || "",
            nome: session.user?.name || ""
        }));
    }, [session]);

    useEffect(() => {
        if (!session) return;
        async function fetchLogado() {
            const db = await fetch(`${url}User/VerificaLogadoEmail?email=${session.user.email}`);
            const res = await db.json();
            setLogado(res);
        }
        fetchLogado();
    }, [session, url]);

    useEffect(() => {
        
        if (logado === true) {
            login();
        } else {
            cadastrar();
        }
        // eslint-disable-next-line
    }, [logado, session]);

    const cadastrar = async () => {
        await fetch(`${url}User/createUser`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(user)
        });
    };
    const login = async () => {
        await fetch(`${url}User/login?email=${user.email}`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            credentials: "include"
        });
    };
    const [loginRealizado, setLoginRealizado] = useState(false);

    const handleGoogleSignIn = () => {
        const token = getTokenFromCookies();
        if (!token) {
            signIn("google", { callbackUrl: "https://find-match-j1vq897dl-andres-projects-fd209be4.vercel.app/" });
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                width: '100vw',
                background: '#fff', // fundo branco
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                px: { xs: 1, sm: 2 },
            }}
        >
            <Container
                maxWidth="sm"
                sx={{
                    py: { xs: 2, sm: 4 },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                <Paper
                    elevation={4}
                    sx={{
                        p: { xs: 2, sm: 4 },
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, rgba(30,30,40,0.95) 60%, rgba(60,40,80,0.90) 100%)',
                        color: '#fafafa',
                        boxShadow: '0 8px 32px 0 rgba(31,38,135,0.37)',
                        backdropFilter: 'blur(2px)',
                        width: '100%',
                        maxWidth: 420,
                        mx: 'auto',
                    }}
                >
                    <Box textAlign="center">
                        <img
                            src="/logo.png"
                            alt="Logo Cupido App"
                            style={{
                                width: 110,
                                marginBottom: 18,
                                filter: 'drop-shadow(0 2px 8px #0008)',
                                borderRadius: 16,
                                background: 'rgba(40,40,60,0.5)',
                                padding: 8,
                            }}
                        />
                        <Typography
                            variant="h4"
                            component="h1"
                            gutterBottom
                            sx={{
                                fontWeight: 700,
                                color: 'primary.main',
                                letterSpacing: 2,
                                textShadow: '0 2px 8px #000',
                                fontFamily: 'Montserrat, Arial, sans-serif',
                                mb: 2,
                                fontSize: { xs: '2rem', sm: '2.4rem' },
                            }}
                        >
                            Cupido App
                        </Typography>

                        <Typography
                            variant="body1"
                            paragraph
                            sx={{
                                mb: 3,
                                lineHeight: 1.7,
                                color: 'grey.200',
                                fontSize: { xs: '1rem', sm: '1.1rem' },
                                fontFamily: 'Montserrat, Arial, sans-serif',
                                textAlign: 'justify',
                            }}
                        >
                            Cupido App é um app de relacionamentos criado para quem valoriza conexões verdadeiras e deseja encontrar pessoas realmente compatíveis.
                            Aqui, o que importa é quem você é de verdade, não apenas a sua aparência. Diferente de outros apps, onde as primeiras impressões vêm das fotos, no Cupido App você se apresenta pelo seu perfil, sua personalidade, seus valores e interesses. Assim, você é escolhido pelo que realmente importa.
                        </Typography>

                        <Button
                            onClick={handleGoogleSignIn}
                            variant="contained"
                            sx={{
                                mb: 2,
                                background: 'linear-gradient(90deg, #6C63FF 0%, #4285F4 100%)',
                                color: '#fff',
                                fontWeight: 700,
                                textTransform: 'none',
                                fontFamily: 'Montserrat, Arial, sans-serif',
                                fontSize: { xs: '1rem', sm: '1.1rem' },
                                borderRadius: 2,
                                boxShadow: '0 2px 8px #0004',
                                py: 1.2,
                                '&:hover': {
                                    background: 'linear-gradient(90deg, #5548c8 0%, #357ae8 100%)',
                                },
                            }}
                            fullWidth
                        >
                            Entrar com Google
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </Box>

    )
}

export default function Apresentação() {
    return (
        < SessionProvider>
            <Apresentacao />
        </SessionProvider>
    )
}