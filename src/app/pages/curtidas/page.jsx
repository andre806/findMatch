'use client'
import { useEffect, useState } from "react"
import Payment from "../payment/page";
import MiniaturaPerfil from "@/app/components/Fy/Miniatura";
export default function page() {
    const [ids, setIds] = useState([]);
    const [mounted, setMounted] = useState(false);
   

    const url = process.env.NEXT_PUBLIC_URL;

    useEffect(() => {
        setMounted(true);
        async function fetchIds() {
            const db = await fetch(`${url}User/verCurtidas`, {
                method: "GET",
                headers: { "content-type": "application/json" },
                credentials: "include"
            });
            const res = await db.json();
            setIds(res);
        }
        fetchIds();
    }, []);

    if (!mounted) return null; // Prevent hydration mismatch

    return (
        <div>
            {ids != false ? (
                <div>
                    {ids.map((e) => (
                        <div key={e}>
                            <MiniaturaPerfil id={e} />
                        </div>
                    ))}
                </div>
            ) : (
                <div>
                    <Payment></Payment>
                </div>
            )}
        </div>
    )
}