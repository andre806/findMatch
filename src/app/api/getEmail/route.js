import { jwtDecode } from "jwt-decode";

export async function GET(request) {
    const cookieHeader = request.headers.get("cookie") || "";
    const match = cookieHeader.match(/(?:^|;\s*)token=([^;]*)/);
    if (!match) {
        return new Response(JSON.stringify({ email: null }), { status: 401 });
    }
    const token = match[1];
    try {
        const decoded = jwtDecode(token);
        return new Response(JSON.stringify({ email: decoded.sub || null }), { status: 200 });
    } catch {
        return new Response(JSON.stringify({ email: null }), { status: 400 });
    }
}