'use client'
import { useState } from "react";

export default function Cadastro() {
    const [user, setUser] = useState({
        nome:"",
        idade:""
    });
    const cadastrar = async () => {
        await fetch(`http://localhost:8080/FreeActions/createUser`,
            {
                method:"POST",
                headers:{"content-type":"application/json"},
                body:JSON.stringify(user)
            }
        )
    }
    const handleChange = (e) =>{
        const {name, value} = e.target
        setUser({...user,
            [name]:value
        })
    }
    return(
        <div>
            <input type="text" name="nome" value={user.nome} placeholder="nome" onChange={handleChange}/><br />
            <input type="" name="idade" value={user.idade} placeholder="idade" onChange={handleChange}/><br />
            <button onClick={cadastrar}>
                cadastrar
            </button>
        </div>
    )
}