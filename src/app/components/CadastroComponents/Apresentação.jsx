import { Container, Typography, Box, Paper, Button } from '@mui/material';
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from 'react';
import { SessionProvider } from 'next-auth/react';
import RequireAuth from '@/app/services/VerificaLogado';
import { useRouter } from "next/navigation";

function Apresentacao() {
    const url = process.env.NEXT_PUBLIC_URL;
    const { data: session, status } = useSession();
    const [userChecked, setUserChecked] = useState(false);
    const router = useRouter();

    // Atualiza user quando session muda
    useEffect(() => {
        if (status !== "authenticated" || !session?.user?.email) return;

        async function checkAndAuth() {
            try {
                // Verifica se usuário já existe
                const db = await fetch(`${url}User/VerificaLogadoEmail?email=${session.user.email}`);
                const res = await db.json();
                if (res === true) {
                    // Login no backend
                    const loginRes = await fetch(`${url}User/login?email=${session.user.email}`, {
                        method: "POST",
                        headers: { "content-type": "application/json" },
                        credentials: "include"
                    });
                    if (loginRes.ok) {
                        setUserChecked(true);
                        router.push("/Passo1");
                    }
                } else {
                    // Cadastro no backend
                    const cadastroRes = await fetch(`${url}User/createUser`, {
                        method: "POST",
                        headers: { "content-type": "application/json" },
                        body: JSON.stringify({
                            nome: session.user.name || "",
                            email: session.user.email
                        })
                    });
                    if (cadastroRes.ok) {
                        // Login após cadastro
                        const loginRes = await fetch(`${url}User/login?email=${session.user.email}`, {
                            method: "POST",
                            headers: { "content-type": "application/json" },
                            credentials: "include"
                        });
                        if (loginRes.ok) {
                            setUserChecked(true);
                            router.push("/Passo1");
                        }
                    }
                }
            } catch (e) {
                // Trate erros aqui
                setUserChecked(false);
            }
        }

        if (!userChecked) {
            checkAndAuth();
        }
    }, [status, session, url, router, userChecked]);

    const handleGoogleSignIn = () => {
        signIn("google", { callbackUrl: `/` });
    };

    return (
        <>
            <RequireAuth>
                <Box
                    sx={{
                        minHeight: '100vh',
                        width: '100vw',
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
                                backgroundColor: 'rgba(20, 20, 30, 0.85)',
                                color: '#fafafa',
                                boxShadow: '0 8px 32px 0 rgba(31,38,135,0.37)',
                                backdropFilter: 'none',
                            }}
                        >
                            <Box textAlign="center">
                                <img
                                    src="/logo.png"
                                    alt="Logo CupidoApp"
                                    style={{
                                        width: 140,
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
                                    CupidoApp
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
                                    CupidoApp é um app de relacionamentos criado para quem valoriza conexões verdadeiras e deseja encontrar pessoas realmente compatíveis.
                                    Aqui, o que importa é quem você é de verdade, não apenas a sua aparência. Diferente de outros apps, onde as primeiras impressões vêm das fotos, no CupidoApp você se apresenta pelo seu perfil, sua personalidade, seus valores e interesses. Assim, você é escolhido pelo que realmente importa.
                                </Typography>
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
            </RequireAuth>
        </>
    );
}

export default function Apresentação() {
    return (
        <SessionProvider>
            <Apresentacao />
        </SessionProvider>
    );
}