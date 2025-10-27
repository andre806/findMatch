export async function getEmail() {
    const response = await fetch("/api/getEmail", {
        method: "GET",
        headers: { "content-type": "application/json" }
    });
    const data = await response.json();
    return data.email;
}