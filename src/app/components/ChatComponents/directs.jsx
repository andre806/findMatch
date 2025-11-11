import { useEffect, useState } from "react"
import Link from "next/link";
import GetCurtidos from "../Fy/getCurtidos";
import GetSuperLikes from "../Fy/getSuperLike";

export default function Directs() {
    const [directs, setDirects] = useState([]);
    const [usersData, setUsersData] = useState({});
    const url = process.env.NEXT_PUBLIC_URL;

    useEffect(() => {
        async function fetchDirects() {
            const db = await fetch(`${url}direct/getDirectsByUser`, {
                method: "GET",
                credentials: "include"
            })
            const res = await db.json();
            setDirects(res);

            // Buscar dados dos usuários para todos os directs
            const users = await Promise.all(res.map(async (d) => {
                const dbUser = await fetch(`${url}direct/getNomeandFoto?userId1=${encodeURIComponent(d.pessoa1Id)}&userId2=${encodeURIComponent(d.pessoa2Id)}`, {
                    method: "GET",
                    credentials: "include"
                });
                const userRes = await dbUser.json();
                return {
                    key: `${d.pessoa1Id}-${d.pessoa2Id}`,
                    ...userRes
                };
            }));

            // Montar objeto para acesso rápido
            const usersObj = {};
            users.forEach(u => {
                usersObj[u.key] = u;
            });
            setUsersData(usersObj);
        }
        fetchDirects();
    }, [])

    return (
        <div>
            <GetSuperLikes></GetSuperLikes>
            <GetCurtidos></GetCurtidos>
            {directs.map((d) => {
                const key = `${d.pessoa1Id}-${d.pessoa2Id}`;
                const data = usersData[key];
                return (
                    <div key={key}>
                        <Link href={`/pages/Chat/${d.pessoa1Id}/${d.pessoa2Id}`}>
  <div style={{ display: "flex", alignItems: "center" }}>
    <img
      src={data?.foto}
      alt=""
      style={{
        width: "40px",
        height: "40px",
        objectFit: "cover",
        borderRadius: "50%",
        marginRight: "8px",
        verticalAlign: "middle"
      }}
    />
    {data ? data.nome : "Carregando..."}
  </div>
</Link>
                    </div>
                )
            })}
        </div>
    )
}