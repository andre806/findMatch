export default function IniciarChatBtn({ pessoa2 }) {
    const url = process.env.NEXT_PUBLIC_URL;
    async function iniciarChat() {
        await fetch(`${url}Relacionamento/iniciarChat?pessoa2=${pessoa2}`, {
            method: "POST",
            credentials: "include"
        });
    }
    return (
        <div>
            <button onClick={iniciarChat}>
                iniciar chat
            </button>
        </div>
    );
}