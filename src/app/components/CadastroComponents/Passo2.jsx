"use client";

import { useState, useEffect } from "react";
import { Box, TextField, Button, Autocomplete } from "@mui/material";
import cidadesJson from "@/app/json/Cidades.json";
import gostosJson from "@/app/json/gostos.json";
import { useRouter } from "next/navigation";

// Extrai todas as cidades do JSON em uma lista única
const CIDADES_BRASIL = ["Todas", ...Object.values(cidadesJson)
    .flatMap(regiao => Object.values(regiao).flat())];

// Extrai todas as opções de gostos e hobbies do JSON
const GOSTOS_OPCOES = Object.values(gostosJson).flat();

export default function Passo2({ onSubmit }) {
    const [email, setEmail] = useState("");
    useEffect(() => {
        const fetchEmail = async () => {
            const db = await fetch("/api/getEmail", {
                method: "GET",
                headers: { "content-type": "application/json" }
            })
            const res = await db.json();
            console.log(res)
            setEmail(res.email)
        }
        fetchEmail();
    }, [])
    const url = process.env.NEXT_PUBLIC_URL
    const [user, setUser] = useState({
        gostos: [],
        bio: "",
        cidadesExibicao: [],
        educacao: "",
    });
    const router = useRouter();

    // Função para campos de texto simples
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setUser((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleGostosChange = (event, newValue) => {
        setUser((prev) => ({
            ...prev,
            gostos: newValue,
        }));
    };

    const handleCidadesExibicaoChange = (event, newValue) => {
        if (newValue.includes("Todas")) {
            setUser((prev) => ({
                ...prev,
                cidadesExibicao: ["Todas"],
            }));
        } else {
            setUser((prev) => ({
                ...prev,
                cidadesExibicao: newValue,
            }));
        }
    };

    const alterar = async (e) => {
        if (e) e.preventDefault();
        const cidadesParaEnviar = user.cidadesExibicao.includes("Todas") ? ["todas"] : user.cidadesExibicao;
        const userToSend = { ...user, cidadesExibicao: cidadesParaEnviar };
        await fetch(`${url}User/Passo2?email=${email}`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(userToSend)
        })
        if (onSubmit) onSubmit(userToSend);
        router.push("/pages/perfil");
    }

    return (
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400, mx: 'auto' }}>
            {/* Removido campo Gosto Musical */}
            <Autocomplete
                multiple
                options={GOSTOS_OPCOES}
                value={user.gostos}
                onChange={handleGostosChange}
                renderInput={(params) => (
                    <TextField {...params} label="Gostos e Hobbies" placeholder="Selecione gostos e hobbies" />
                )}
            />
            <TextField
                label="Bio"
                name="bio"
                value={user.bio}
                onChange={handleChange}
                multiline
                rows={3}
            />
            <Autocomplete
                multiple
                options={CIDADES_BRASIL}
                value={user.cidadesExibicao}
                onChange={handleCidadesExibicaoChange}
                disableCloseOnSelect
                getOptionDisabled={option =>
                    user.cidadesExibicao.includes("Todas") && option !== "Todas"
                }
                renderInput={(params) => (
                    <TextField {...params} label="Cidades de Exibição" placeholder="Selecione cidades" />
                )}
            />
            <TextField
                label="Educação"
                name="educacao"
                value={user.educacao}
                onChange={handleChange}
            />
            <Button variant="contained" color="primary" onClick={alterar}>
                Finalizar Cadastro
            </Button>
        </Box>
    );
}