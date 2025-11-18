'use client'
import Apresentação from "./components/CadastroComponents/Apresentação";
import RequireAuth from "./services/VerificaLogado";
import EncaminhaUser from "./services/encaminhaUser";

export default function Home() {
  return(
    <div>
      
      <RequireAuth>
         <Apresentação />
      </RequireAuth>
    </div>
  );
}