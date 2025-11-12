'use client'
import { useEffect, useState } from "react";
import MiniaturaPerfil from "@/app/components/Fy/Miniatura";
import Payment from "../payment/page";
import SkipBtn from "@/app/components/Fy/SkipBtn";
import CurtirBtn from "@/app/components/Fy/CurtirBtn";

export default function SuperLike() {
    const url = process.env.NEXT_PUBLIC_URL;
    const [SuperLikes, setSuperLikes] = useState([]);

    useEffect(() => {
        async function fetchSuperLike() {
            const db = await fetch(`${url}User/verSuperlikes`, {
                method: "GET",
                credentials: "include"
            });
            const res = await db.json(); // CORRIGIDO: await
            setSuperLikes(res);
        }
        fetchSuperLike();
    }, []);

    return (
        <div>
            
               {SuperLikes != false ?(
               <div>{SuperLikes.map((e) => (
                    <div key={e}>
                        <MiniaturaPerfil id={e} />
                          <div style={{ display: "flex", gap: 24, marginTop: 16 }}>
                             <SkipBtn />
                             <CurtirBtn />
                           </div>
                    </div>
                ))}
            </div>
             ):(
                <div>
                    <Payment></Payment>
                </div>
            )}
        </div>
    )
}