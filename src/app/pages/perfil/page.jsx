'use client'
import PPrivado from "@/app/components/Perfil/PerfilPrivado";
import RequireAuth from "@/app/services/VerificaLogado";

export default function perfil() {
  return (
    <RequireAuth>
      <div>
        <PPrivado />
      </div>
    </RequireAuth>
  )
}