'use client'
import PPrivado from "@/app/components/Perfil/PerfilPrivado";
import RequireAuth from "@/app/services/VerificaLogado";
import EncaminhaUser from "@/app/services/encaminhaUser";
import Link from "next/link";
export default function perfil() {
  return (

    <div>
     
      <PPrivado />
    </div>

  )
}