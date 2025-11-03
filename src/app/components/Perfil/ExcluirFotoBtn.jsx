export default function ExcluirFotoBtn({FotoUrl}) {
    const url = process.env.NEXT_PUBLIC_URL;

    async function excluir() {
        await fetch(`${url}User/excluirFoto?fileKey=${FotoUrl}`,{
            method:"POST",
            headers:{"content-type":"application/json"},
            credentials:"include"
        })
    }
    return(
        <div>
            <button onClick={excluir}>
                excluir
            </button>
        </div>
    )
}