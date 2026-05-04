import { useState } from "react";

export function Login({ onSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    // 1. State pentru mesajul de eroare
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async () => {
        // Resetăm eroarea la fiecare încercare nouă
        setErrorMessage('');

        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                const userData = {
                    username: data.username,
                    cubeState: data.cubeState
                };
                // Salvăm în localStorage ca să rămână logat la refresh
                localStorage.setItem("user", JSON.stringify(userData));

                // Anunțăm părintele (AuthContainer) că logarea a reușit
                onSuccess(userData);
            } else {
                // 2. Setăm mesajul primit de la backend (ex: "Parolă incorectă")
                setErrorMessage(data.error || "Username sau parolă greșită");
            }
        } catch (error) {
            setErrorMessage("Serverul nu răspunde. Încearcă mai târziu.");
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input
                className="auth-input"
                placeholder="Username"
                value={username}
                onChange={(e) => {
                    setUsername(e.target.value);
                    if(errorMessage) setErrorMessage(''); // Șterge eroarea când userul scrie
                }}
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <input
                    className="auth-input"
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        if(errorMessage) setErrorMessage('');
                    }}
                />

                {/* 3. Afișarea condiționată a erorii sub parolă */}
                {errorMessage && (
                    <span style={{
                        color: '#ff4d4d',
                        fontSize: '0.85rem',
                        marginTop: '2px',
                        textAlign: 'left',
                        paddingLeft: '5px'
                    }}>
                        {errorMessage}
                    </span>
                )}
            </div>

            <button className="btn-submit" onClick={handleLogin}>Login</button>
        </div>
    );
}