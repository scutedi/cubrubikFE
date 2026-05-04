export async function sendCubeToBackend(faceletString) {
    const response = await fetch("http://localhost:8080/api/cube/colors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cube: faceletString })
    });

    return await response.json();
}