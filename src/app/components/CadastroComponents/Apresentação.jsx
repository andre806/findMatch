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
    const url = process.env.NEXT_PUBLIC_URL;
    const { data: session, status } = useSession();
    const [logado, setLogado] = useState(null);
    const [user, setUser] = useState({ nome: "", email: "" });
    const [passo1, setPasso1] = useState(null);

    useEffect(() => {
        if (!session?.user?.email) return;
        async function fetchPasso1() {
            const db = await fetch(`${url}User/verificaPasso1?email=${session.user.email}`);
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
        if (!session || logado === null) return;
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
            signIn("google", { callbackUrl: "https://find-match.vercel.app/" });
        }
    };

    return (

        <Box
            sx={{
                minHeight: '100vh',
                width: '100vw',
                backgroundImage: `url(/BGApresentação.png)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        borderRadius: 2,
                        backgroundColor: 'rgba(20, 20, 30, 0.85)', // Fundo mais escuro e translúcido
                        color: '#fafafa',
                        boxShadow: '0 8px 32px 0 rgba(31,38,135,0.37)',
                        backdropFilter: 'none',
                    }}
                >
                    <Box textAlign="center">
                        <img
                            src="/logo.png"
                            alt="Logo FindMatch"
                            style={{
                                width: 140, // aumentado de 90 para 140
                                marginBottom: 24,
                                filter: 'drop-shadow(0 2px 8px #0008)'
                            }}
                        />
                        <Typography
                            variant="h4"
                            component="h1"
                            gutterBottom
                            sx={{
                                fontWeight: 'bold',
                                color: '#fff',
                                letterSpacing: 2,
                                textShadow: '0 2px 8px #000',
                                animation: 'fadeInDown 1s',
                                '@keyframes fadeInDown': {
                                    from: { opacity: 0, transform: 'translateY(-40px)' },
                                    to: { opacity: 1, transform: 'translateY(0)' }
                                }
                            }}
                        >
                            FindMatch
                        </Typography>

                        <Typography
                            variant="body1"
                            paragraph
                            sx={{
                                mb: 3,
                                lineHeight: 1.8,
                                color: '#e0e0e0',
                                animation: 'fadeIn 1.2s',
                                '@keyframes fadeIn': {
                                    from: { opacity: 0 },
                                    to: { opacity: 1 }
                                }
                            }}
                        >
                            FindMatch é um app de relacionamentos criado para quem valoriza conexões verdadeiras e deseja encontrar pessoas realmente compatíveis.
                            Aqui, o que importa é quem você é de verdade, não apenas a sua aparência. Diferente de outros apps, onde as primeiras impressões vêm das fotos, no FindMatch você se apresenta pelo seu perfil, sua personalidade, seus valores e interesses. Assim, você é escolhido pelo que realmente importa.
                        </Typography>

                        {/* Botão de login com Google */}
                        <Button
                            onClick={handleGoogleSignIn}
                            variant="contained"
                            sx={{
                                mb: 2,
                                background: 'linear-gradient(90deg, #4285F4 0%, #34A853 100%)',
                                color: '#fff',
                                fontWeight: 600,
                                textTransform: 'none',
                                boxShadow: '0 2px 8px #0004',
                                '&:hover': {
                                    background: 'linear-gradient(90deg, #357ae8 0%, #2e7d32 100%)',
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