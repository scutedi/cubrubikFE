import { useState } from "react";

export function Register({ onSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, cubeState: "INITIAL_STATE" })
            });

            if (response.ok) {
                alert("Cont creat cu succes! Acum te poți loga.");
                onSuccess(); // Comută la formularul de login
            } else {
                alert("Eroare la înregistrare.");
            }
        } catch (error) {
            alert("Eroare server.");
        }
    };

    return (
        <>
            <input
                className="auth-input"
                placeholder="Choose Username"
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                className="auth-input"
                placeholder="Choose Password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
            />
            <button className="btn-submit" onClick={handleRegister}>Sign Up</button>
        </>
    );
}