import Button from "@mui/material/Button";

export default function ExcluirFotoBtn({ FotoUrl, onFotoAlterada }) {
    const url = process.env.NEXT_PUBLIC_URL;

    async function excluir() {
        await fetch(`${url}User/excluirFoto?fileKey=${FotoUrl}`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            credentials: "include"
        });
        if (onFotoAlterada) onFotoAlterada();
    }
    return (
        <Button
            variant="outlined"
            color="error"
            size="small"
            sx={{ mt: 1, mb: 1, borderRadius: 2, textTransform: "none" }}
            onClick={excluir}
        >
            Excluir foto
        </Button>
    );
}