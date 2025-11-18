'use client'
import Passo1 from "@/app/components/CadastroComponents/Passo1"
import EncaminhaUser from "@/app/services/encaminhaUser"

export default function Passo() {
    return (
       
            <div>
                <EncaminhaUser />
                <Passo1 />
            </div>
       
    )
}