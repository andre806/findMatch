'use client'
import Apresentação from "./components/CadastroComponents/Apresentação";
import RequireAuth from "./services/VerificaLogado";

export default function Home() {
  return(
    <div>
      <RequireAuth>
        <Apresentação />
      </RequireAuth>
    </div>
  );
}