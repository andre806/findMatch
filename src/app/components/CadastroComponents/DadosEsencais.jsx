import { TextField, Button, Checkbox, FormControlLabel, Box } from '@mui/material';
import { useState } from 'react';

export default function Page1() {
    const url = process.env.NEXT_PUBLIC_URL;
    const [User, setUser] = useState({
        email: '',
        senha: '',
        numeroTelefone: '',
        verificacaoEmail: false,
        codigoVerificacao: ''
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setUser(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };
    const Cadastro = async () => {
        await fetch(`${url}User/createUser`, {
            method: "GET",
            headers: { "content-type": "application/json" }
        })
    }
    


    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'transparent'
            }}
        >
            <Box
                component="form"
                sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: 300 }}

            >
                <TextField
                    label="Email"
                    type="email"
                    name="email"
                    required
                    variant="outlined"
                    value={User.email}
                    onChange={handleChange}
                />
                <TextField
                    label="Senha"
                    type="password"
                    name="senha"
                    required
                    variant="outlined"
                    value={User.senha}
                    onChange={handleChange}
                />
                <TextField
                    label="Número de telefone"
                    type="tel"
                    name="numeroTelefone"
                    required
                    variant="outlined"
                    value={User.numeroTelefone}
                    onChange={handleChange}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            name="verificacaoEmail"
                            checked={User.verificacaoEmail}
                            onChange={handleChange}
                        />
                    }
                    label="Verificação de Email"
                />
                <TextField
                    label="Código de Verificação"
                    type="text"
                    name="codigoVerificacao"
                    variant="outlined"
                    value={User.codigoVerificacao}
                    onChange={handleChange}
                />
                <Button type="submit" variant="contained" color="primary" onClick={Cadastro}>
                    Enviar
                </Button>
            </Box>
        </Box>
    )
}