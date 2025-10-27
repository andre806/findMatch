import Passo2 from "@/app/components/CadastroComponents/Passo2"
import RequireAuth from "@/app/services/VerificaLogado"

export default function SegundoPasso() {
    return (
        <RequireAuth>
            <div>
                <Passo2 />
            </div>
        </RequireAuth>
    )
}