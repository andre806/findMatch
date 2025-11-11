import { useEffect, useState } from "react";
import Link from "next/link";

export default function GetCurtidos() {
    const [curtidaCount, setCurtidaCount] = useState(null);
    const url = process.env.NEXT_PUBLIC_URL;
    useEffect(() => {
        async function fetchCurtodaCount() {
            const db = await fetch(`${url}User/getQuantidadeCurtidas`, {
                method: "GET",
                credentials: "include"
            });
            const res = await db.json();
            setCurtidaCount(res);
        }
        fetchCurtodaCount();
    }, []);
    return (
        <div style={{ position: "relative", display: "inline-block" }}>
            <Link href="/pages/curtidas" style={{ position: "relative", paddingRight: curtidaCount ? 24 : 0 }}>
                curtidas
                {curtidaCount !== null && (
                    <span style={{
                        position: "absolute",
                        top: -8,
                        right: -18,
                        minWidth: 18,
                        height: 18,
                        background: "#f59e42",
                        color: "#fff",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                        fontWeight: 700,
                        boxShadow: "0 2px 6px #0008",
                        zIndex: 2,
                        padding: "0 5px"
                    }}>
                        {curtidaCount}
                    </span>
                )}
            </Link>
        </div>
    );
}