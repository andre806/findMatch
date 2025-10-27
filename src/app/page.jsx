'use client'
import Apresentação from "./components/CadastroComponents/Apresentação";
import EncaminhaUser from "./services/encaminhaUser";
Apresentação
export default function Home() {
  return(
    <div>
      <EncaminhaUser>
        <Apresentação />
        </EncaminhaUser>
    </div>
  );
}