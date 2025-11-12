'use client'
import { useEffect, useState } from "react"
import Payment from "../payment/page";
import MiniaturaPerfil from "@/app/components/Fy/Miniatura";
import SkipBtn from "@/app/components/Fy/SkipBtn";
import CurtirBtn from "@/app/components/Fy/CurtirBtn";
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
                        <div key={e} style={{ marginBottom: 32, display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <MiniaturaPerfil id={e} />
                            <div style={{ display: "flex", gap: 24, marginTop: 16 }}>
                                <SkipBtn />
                                <CurtirBtn />
                            </div>
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