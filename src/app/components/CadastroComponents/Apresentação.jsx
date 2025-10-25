import { Container, Typography, Box, Paper, Button, Link } from '@mui/material';

export default function Apresentação() {
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
                        backgroundColor: 'transparent', // Removido fundo preto
                        color: '#fafafa',
                        boxShadow: '0 8px 32px 0 rgba(31,38,135,0.37)',
                        backdropFilter: 'none', // Removido blur
                    }}
                >
                    <Box textAlign="center">
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

                        {/* <Typography
                            variant="body1"
                            paragraph
                            sx={{
                                mb: 3,
                                lineHeight: 1.8,
                                color: '#bdbdbd',
                                animation: 'fadeIn 1.5s',
                            }}
                        >
                            No FindMatch, você é conectado principalmente a pessoas da sua bolha, ou seja, pessoas que compartilham ideias, gostos e estilos de vida semelhantes aos seus. Isso aumenta as chances de encontros significativos e relacionamentos duradouros!
                        </Typography>

                        <Typography
                            variant="body1"
                            paragraph
                            sx={{
                                lineHeight: 1.8,
                                fontWeight: 500,
                                color: '#fff',
                                animation: 'fadeIn 1.8s',
                            }}
                        >
                            Mostre-se sem medo, sem inseguranças e saiba que será valorizado pelo seu jeito único de ser.
                            Chegou a hora de encontrar alguém que te admire pelo que você é – encontre seu amor de verdade.
                            Baixe agora e viva a experiência de se conectar com quem realmente combina com você!
                        </Typography> */}

                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            sx={{
                                mt: 3,
                                mb: 2,
                                px: 5,
                                fontWeight: 'bold',
                                fontSize: '1.1rem',
                                borderRadius: 2,
                                boxShadow: '0 2px 8px #0008',
                                background: 'linear-gradient(90deg, #212121 0%, #7b1fa2 100%)',
                                transition: 'transform 0.2s',
                                '&:hover': {
                                    background: 'linear-gradient(90deg, #7b1fa2 0%, #212121 100%)',
                                    transform: 'scale(1.05)'
                                }
                            }}
                            href="/pages/Cadastro"
                        >
                            Cadastre-se
                        </Button>

                        <Box mt={2}>
                            <Typography variant="body2" sx={{ color: '#bdbdbd', display: 'inline' }}>
                                Já tem uma conta?{' '}
                            </Typography>
                            <Link
                                href="/login"
                                underline="hover"
                                sx={{
                                    color: '#ce93d8',
                                    fontWeight: 500,
                                    transition: 'color 0.2s',
                                    '&:hover': { color: '#fff' }
                                }}
                            >
                                Faça login
                            </Link>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    )
}