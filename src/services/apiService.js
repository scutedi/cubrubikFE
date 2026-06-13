const API_URL = "http://localhost:8080/api/cube";

export async function saveCubeState(token, cubeString) {
    try {
        const response = await fetch(`${API_URL}/save`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                userId: JSON.parse(localStorage.getItem("user")).id,
                cubeState: cubeString
            })
        });

        // ❌ nu mai citim de 2 ori response-ul
        const text = await response.text();

        if (!response.ok) {
            throw new Error(text || "Request failed");
        }

        // dacă nu returnezi nimic din backend
        return text ? JSON.parse(text) : null;

    } catch (err) {
        console.error("saveCubeState:", err);
    }
}

export async function loadCubeState(token) {
    try {
        const userId = JSON.parse(localStorage.getItem("user")).id;

        const response = await fetch(
            `${API_URL}/load/${userId}`,
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            throw new Error("Eroare la încărcarea cubului");
        }

        return await response.json();

    } catch (err) {
        console.error("loadCubeState:", err);
        return null;
    }
}