import { useEffect, useState } from "react";
import Link from "next/link";

export default function GetSuperLikes() {
    const url = process.env.NEXT_PUBLIC_URL;
    const [count, setCount] = useState(null);
    useEffect(() => {
        async function fetchCount() {
            const db = await fetch(`${url}User/getQuantidadeSuperLike`, {
                method: "GET",
                credentials: "include"
            });
            const res = await db.json();
            setCount(res);
        }
        fetchCount();
    }, []);
    return (
        <div style={{ position: "relative", display: "inline-block" }}>
            <Link href="/pages/superLikes" style={{ position: "relative", paddingRight: count ? 24 : 0 }}>
                superLikes
                {count !== null && (
                    <span style={{
                        position: "absolute",
                        top: -8,
                        right: -18,
                        minWidth: 18,
                        height: 18,
                        background: "#a855f7",
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
                        {count}
                    </span>
                )}
            </Link>
        </div>
    );
}