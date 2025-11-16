'use client'
import Passo1 from "@/app/components/CadastroComponents/Passo1"
import RequireAuth from "@/app/services/VerificaLogado"

export default function Passo() {
    return (
       
            <div>
                <RequireAuth />
                <Passo1 />
            </div>
       
    )
}