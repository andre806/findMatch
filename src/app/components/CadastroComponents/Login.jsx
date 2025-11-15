import { useState } from "react";

export default function Login() {
    const url = process.env.NEXT_PUBLIC_URL;
    const [email, setEmail] = useState("");
    async function Login() {
        await fetch(`https://demo-billowing-pine-7198.fly.dev/User/login?email=${email}`, {
            method: "POST",
            credentials: "include"
        });
    }
    return (
        <div>
            <input
                type="text"
                value={email}
                onChange={e => setEmail(e.target.value)}
            />
            <button onClick={Login}>login</button>
        </div>
    );
}
