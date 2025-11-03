'use client'
import PPrivado from "@/app/components/Perfil/PerfilPrivado";
import RequireAuth from "@/app/services/VerificaLogado";
import Link from "next/link";

export default function perfil() {
  return (
    <RequireAuth>
      <div>
        <PPrivado />
        <Link href={"/pages/testes"}>Ir para Testes</Link>
      </div>
    </RequireAuth>
  )
}