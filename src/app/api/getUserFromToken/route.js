export async function GET(request) {
    // Extrai os cookies do request
    const cookieHeader = request.headers.get('cookie') || '';
    const match = cookieHeader.match(/(?:^|;\s*)next-auth\.session-token=([^;]*)/);

    if (!match) {
        return new Response(JSON.stringify({ error: 'Token not found' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const token = decodeURIComponent(match[1]);

    // Apenas retorna o token, para decodificar use uma lib JWT se necessário
    return new Response(JSON.stringify({ token }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}