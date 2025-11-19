import { useParams } from "next/navigation";
import { useEffect, useRef, useState, useMemo } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

export default function Chat() {
    const params = useParams();
    // Use useMemo para garantir que os IDs não mudem a cada render
    const user1Id = useMemo(() => encodeURIComponent(params.user1Id), [encodeURIComponent(params.user1Id)]);
    const user2Id = useMemo(() => encodeURIComponent(params.user2Id), [encodeURIComponent(params.user2Id)]);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const stompClient = useRef(null);
    const url = process.env.NEXT_PUBLIC_URL;
    const [historico, setHistorico] = useState([]);
    const [side, setSide] = useState(null);
    const [idCripto, setIdCrip] = useState("");
    useEffect(() => {
        async function FetchIdcryp() {
            const db = await fetch(`${url}User/getIdCodificado`, { credentials: "include" })
            const res = await db.text();
            setIdCrip(res)

        }
        FetchIdcryp()
    }, [])

    useEffect(() => {
        const fechHsitorico = async () => {
            const db = await fetch(`${url}direct/getHistorico?pessoa1Id=${encodeURIComponent(user1Id)}&pessoa2Id=${encodeURIComponent(user2Id)}`, {
                method: "GET"
            })
            const res = await db.json();
            setHistorico(Array.isArray(res) ? res : []);
        }
        fechHsitorico();
    }, [])
    useEffect(() => {
        const socket = new SockJS(`${url}ws-chat`);
        stompClient.current = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                setIsConnected(true);
                stompClient.current.subscribe(
                    `/chat/${decodeURIComponent(user1Id)}/${decodeURIComponent(user2Id)}`,
                    (message) => {
                        // Espera que message.body seja um JSON stringificado
                        try {
                            const msgObj = JSON.parse(message.body);
                            setMessages((prev) => [...prev, msgObj]);
                        } catch {
                            // fallback para texto simples
                            setMessages((prev) => [...prev, { content: message.body }]);
                        }
                    }
                );
            },
            onDisconnect: () => setIsConnected(false),
            onStompError: () => setIsConnected(false),
        });
        stompClient.current.activate();

        return () => {
            if (stompClient.current) stompClient.current.deactivate();
            setIsConnected(false);
        };
    }, [user1Id, user2Id, url]);

    useEffect(() => {
        async function fetchSide() {
            try {
                const db = await fetch(`${url}direct/getSide?user1Id=${encodeURIComponent(user1Id)}`, {
                    credentials: "include"
                });
                const res = await db.text();
                setSide(res);
            } catch (e) {
                setSide(null);
            }
        }
        fetchSide();
    }, [user1Id, url]);

    const sendMessage = (conteudo) => {
        if (!stompClient.current || !stompClient.current.connected) {
            console.warn("Conexão ainda não estabelecida.");
            return;
        }

        const msgObj = {
            senderId: idCripto,
            content: conteudo
        };

        stompClient.current.publish({
            destination: `/app/Chat.send/${decodeURIComponent(user1Id)}/${decodeURIComponent(user2Id)}`,
            body: JSON.stringify(msgObj)
        });
    };

    const handleSend = () => {
        if (input.trim()) {
            sendMessage(input);
            setInput("");
        }
    };

    console.log("idCripto:", idCripto);
    console.log("historico:", historico);
    console.log("messages:", messages);

    return (
        <div>
            <div>
                {Array.isArray(historico) && historico.map((h, idx) => {
                    const alignRight = String(h.userId) === String(idCripto);
                    
                    return (
                        <div
                            key={idx}
                            style={{
                                display: "flex",
                                justifyContent: alignRight ? "flex-end" : "flex-start",
                                marginBottom: 4
                            }}
                        >
                            <div
                                style={{
                                    background: alignRight ? "#d1e7dd" : "#f8d7da",
                                    color: "#333",
                                    padding: "8px 12px",
                                    borderRadius: "16px",
                                    maxWidth: "60%",
                                    textAlign: alignRight ? "right" : "left"
                                }}
                            >
                                {h.content}
                            </div>
                        </div>
                    );
                })}
                {messages.map((msg, idx) => {
                    const alignRight = String(msg.senderId) === String(idCripto);
                    console.log(`[messages] idx=${idx} msg.senderId=${msg.senderId} idCripto=${idCripto} alignRight=${alignRight}`);
                    return (
                        <div
                            key={idx}
                            style={{
                                display: "flex",
                                justifyContent: alignRight ? "flex-end" : "flex-start",
                                marginBottom: 4
                            }}
                        >
                            <div
                                style={{
                                    background: alignRight ? "#d1e7dd" : "#f8d7da",
                                    color: "#333",
                                    padding: "8px 12px",
                                    borderRadius: "16px",
                                    maxWidth: "60%",
                                    textAlign: alignRight ? "right" : "left"
                                }}
                            >
                                {msg.content}
                            </div>
                        </div>
                    );
                })}
            </div>
            <div style={{ marginTop: 10 }}>
                {!isConnected && (
                    <div style={{ color: "gray", marginBottom: 8 }}>
                        Conectando ao chat...
                    </div>
                )}
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleSend();
                    }}
                    placeholder="Digite sua mensagem..."
                    disabled={!isConnected}
                />
                <button onClick={handleSend} disabled={!isConnected || !input.trim()}>
                    Enviar
                </button>
            </div>
        </div>
    );
}