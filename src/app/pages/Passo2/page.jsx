import Passo2 from "@/app/components/CadastroComponents/Passo2"
import RequireAuth from "@/app/services/VerificaLogado"

export default function SegundoPasso() {
    return (
        
            <div>
                <RequireAuth></RequireAuth>
                <Passo2 />
            </div>
       
    )
}