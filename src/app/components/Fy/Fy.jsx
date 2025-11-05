import { useEffect, useState, useRef } from "react";
import MiniaturaPerfil from "./Miniatura";
import CurtirBtn from "./CurtirBtn";
import SkipBtn from "./SkipBtn";
export default function Fy() {
    const [usersId, setUsersIds] = useState([]);
    const [noMoreProfiles, setNoMoreProfiles] = useState(false);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [animDirection, setAnimDirection] = useState(""); // "right" ou "left"
    const url = process.env.NEXT_PUBLIC_URL;

    // Drag state
    const [dragX, setDragX] = useState(0);
    const dragStartX = useRef(null);
    const dragging = useRef(false);

    async function BuscarMais() {
        const db = await fetch(`${url}feed/Fy`, {
            method: "GET",
            credentials: "include"
        });
        const res = await db.json();
        setUsersIds(res);
        setCurrentIdx(0);
        // Se não houver perfis válidos, exibe mensagem
        if (!res || res.filter(p => p != null).length === 0) {
            setNoMoreProfiles(true);
        } else {
            setNoMoreProfiles(false);
        }
    }

    useEffect(() => {
        async function FetchIds() {
            const db = await fetch(`${url}feed/Fy`, {
                method: "GET",
                credentials: "include"
            });
            const res = await db.json();
            setUsersIds(res);
            setCurrentIdx(0);
            if (!res || res.filter(p => p != null).length === 0) {
                setNoMoreProfiles(true);
            } else {
                setNoMoreProfiles(false);
            }
        }
        FetchIds();
    }, [url]);

    // Busca automática se houver algum null
    useEffect(() => {
        if (usersId.some(p => p == null) && !noMoreProfiles) {
            BuscarMais();
        }
    }, [usersId, noMoreProfiles]);

    function getNextValidIdx(startIdx) {
        for (let i = startIdx + 1; i < usersId.length; i++) {
            if (usersId[i] != null) return i;
        }
        return -1;
    }

    // Função para curtir (usada no drag e no botão)
    // async function curtirPerfil(userId) {
    //     await fetch(`${url}Relacionamento/curtir?perfilId=${userId}`, {
    //         method: "POST",
    //         credentials: "include",
    //         headers: {
    //             "Content-Type": "application/json"
    //         },
    //         body: JSON.stringify({ id: userId })
    //     });
    // }

    function handleNext(direction = "", doLike = false) {
        setAnimDirection(direction);
        setDragX(0);
        setTimeout(async () => {
            if (doLike && usersId[currentIdx]) {
                await curtirPerfil(usersId[currentIdx]);
            }
            const nextIdx = getNextValidIdx(currentIdx);
            if (nextIdx === -1) {
                // Array foi totalmente percorrido, buscar mais perfis
                await BuscarMais();
            } else {
                setCurrentIdx(nextIdx);
            }
            setAnimDirection("");
        }, 350); // tempo da animação
    }

    // Drag handlers
    function onDragStart(e) {
        dragging.current = true;
        setDragX(0);
        dragStartX.current = e.type === "touchstart"
            ? e.touches[0].clientX
            : e.clientX;
    }

    function onDragMove(e) {
        if (!dragging.current) return;
        const clientX = e.type === "touchmove"
            ? e.touches[0].clientX
            : e.clientX;
        setDragX(clientX - dragStartX.current);
    }

    function onDragEnd() {
        dragging.current = false;
        if (dragX > 100) {
            handleNext("right", true); // direita = curtir
        } else if (dragX < -100) {
            handleNext("left", false); // esquerda = skip
        } else {
            setDragX(0);
        }
    }

    // Busca o próximo usuário válido a partir do índice atual
    const currentUser = usersId[currentIdx];

    // Estilos de animação
    const animStyles = {
        transition: animDirection
            ? "transform 0.35s cubic-bezier(.4,2,.6,1), opacity 0.35s"
            : dragX !== 0
                ? "none"
                : "transform 0.2s",
        transform:
            animDirection === "right"
                ? "translateX(120vw) rotate(20deg)"
                : animDirection === "left"
                    ? "translateX(-120vw) rotate(-20deg)"
                    : dragX !== 0
                        ? `translateX(${dragX}px) rotate(${dragX / 18}deg)`
                        : "translateX(0)",
        opacity: animDirection ? 0 : 1,
        cursor: dragX !== 0 ? "grabbing" : "grab",
        touchAction: "pan-y"
    };

    return (
        <div style={{ position: "relative", minHeight: 200 }}>
            {currentUser && !noMoreProfiles ? (
                <div
                    style={{ ...animStyles, position: "absolute", width: "100%" }}
                    onMouseDown={onDragStart}
                    onMouseMove={dragging.current ? onDragMove : undefined}
                    onMouseUp={onDragEnd}
                    onMouseLeave={dragging.current ? onDragEnd : undefined}
                    onTouchStart={onDragStart}
                    onTouchMove={onDragMove}
                    onTouchEnd={onDragEnd}
                >
                    <MiniaturaPerfil id={currentUser} />
                    <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 16 }}>
                        <SkipBtn onSkip={() => handleNext("left", false)} />
                        <CurtirBtn userId={currentUser} onLike={() => handleNext("right", true)} />
                    </div>
                </div>
            ) : noMoreProfiles ? (
                <div>Já acabaram os perfis nessa cidade</div>
            ) : null}
        </div>
    );
}