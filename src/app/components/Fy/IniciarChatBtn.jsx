import Button from "@mui/material/Button";

export default function IniciarChatBtn({ pessoa2 }) {
    const url = process.env.NEXT_PUBLIC_URL;
    async function iniciarChat() {
        await fetch(`${url}Relacionamento/iniciarChat?pessoa2=${pessoa2}`, {
            method: "POST",
            credentials: "include"
        });
    }
    return (
        <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{
                fontSize: 32,
                width: 72,
                height: 72,
                borderRadius: "50%",
                minWidth: 0,
                boxShadow: 3,
                textTransform: "none"
            }}
            onClick={iniciarChat}
        >
            💬
        </Button>
    );
}