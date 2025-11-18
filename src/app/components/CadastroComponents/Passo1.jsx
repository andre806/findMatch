import { useEffect, useState } from "react"
import { TextField, MenuItem, Button, Box, Autocomplete } from "@mui/material"

import { useRouter } from "next/navigation";
import cidadesJson from "@/app/json/Cidades.json";

// Extrai todas as cidades do JSON em uma lista única
const CIDADES_BRASIL = Object.values(cidadesJson)
    .flatMap(regiao => Object.values(regiao).flat());

const AREAS = [
    "Tecnologia da Informação",
    "Saúde",
    "Educação",
    "Engenharia",
    "Direito",
    "Administração",
    "Marketing",
    "Design",
    "Arquitetura",
    "Psicologia",
    "Finanças",
    "Recursos Humanos",
    "Vendas",
    "Logística",
    "Comunicação",
    "Jornalismo",
    "Artes",
    "Gastronomia",
    "Turismo",
    "Ciências Biológicas",
    "Química",
    "Física",
    "Matemática",
    "Agronomia",
    "Veterinária",
    "Moda",
    "Publicidade",
    "Farmácia",
    "Enfermagem",
    "Odontologia",
    "Outro"
];

export default function Passo1() {
    const url = process.env.NEXT_PUBLIC_URL
    const [user, setUser] = useState({
        idade: null,
        cidade: "",
        genero: "",
        sexualidade: "",
        toProcurando: "",
        ocupacao: "",
    });
    const router = useRouter();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCidadeChange = (event, newValue) => {
        setUser((prev) => ({
            ...prev,
            cidade: newValue || "",
        }));
    };

    const handleAreaChange = (event, newValue) => {
        setUser((prev) => ({
            ...prev,
            ocupacao: newValue || "",
        }));
    };

    const alterar = async (e) => {
        if (e) e.preventDefault();
        if (!user.idade || Number(user.idade) < 18) {
            alert("A idade mínima para cadastro é 18 anos.");
            return;
        }
        if (!CIDADES_BRASIL.includes(user.cidade)) {
            alert("Selecione uma cidade válida da lista.");
            return;
        }
        const response = await fetch(`${url}User/Passo1`, {
            credentials:"include",
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(user)
        });
        if (response.ok) {
            router.push("/pages/Passo2");
        } else {
            alert("Erro ao salvar os dados. Tente novamente.");
        }
    }

    return (
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400, mx: 'auto' }}>
            <TextField
                label="Idade"
                name="idade"
                type="number"
                value={user.idade || ""}
                onChange={handleChange}
                required
            />
            <Autocomplete
                options={CIDADES_BRASIL}
                value={user.cidade}
                onChange={handleCidadeChange}
                renderInput={(params) => (
                    <TextField {...params} label="Cidade" required />
                )}
                freeSolo
            />
            <TextField
                select
                label="Gênero"
                name="genero"
                value={user.genero}
                onChange={handleChange}
                required
            >
                <MenuItem value="">Selecione</MenuItem>
                <MenuItem value="masculino">Masculino</MenuItem>
                <MenuItem value="feminino">Feminino</MenuItem>
                <MenuItem value="outro">Outro</MenuItem>
            </TextField>
            <TextField
                select
                label="Sexualidade"
                name="sexualidade"
                value={user.sexualidade}
                onChange={handleChange}
                required
            >
                <MenuItem value="">Selecione</MenuItem>
                <MenuItem value="heterossexual">Heterossexual</MenuItem>
                <MenuItem value="homossexual">Homossexual</MenuItem>
                <MenuItem value="bissexual">Bissexual</MenuItem>
                <MenuItem value="outro">Outro</MenuItem>
            </TextField>
            <TextField
                select
                label="Tô procurando"
                name="toProcurando"
                value={user.toProcurando}
                onChange={handleChange}
                required
            >
                <MenuItem value="">Selecione</MenuItem>
                <MenuItem value="homem">Homem</MenuItem>
                <MenuItem value="mulher">Mulher</MenuItem>
                <MenuItem value="qualquer">Qualquer um</MenuItem>
            </TextField>
            <Autocomplete
                options={AREAS}
                value={user.ocupacao}
                onChange={handleAreaChange}
                renderInput={(params) => (
                    <TextField {...params} label="Trabalha na área" variant="outlined" />
                )}
                freeSolo
            />
            <Button variant="contained" color="primary" onClick={alterar}>
                Próximo
            </Button>
        </Box>
    )
}
