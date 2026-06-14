import { useState } from "react";

export function Login({ onSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async () => {
        setErrorMessage('');

        console.log("LOGIN TRY:", username, password);

        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const text = await response.text();
            const data = text ? JSON.parse(text) : null;

            if (!response.ok) {
                throw new Error(data?.error || "Username sau parolă greșită");
            }

            const userData = {
                id: data.id,
                username: data.username,
                cubeState: data.cubeState || ""
            };

            console.log("LOGIN SUCCESS:", userData);

            localStorage.setItem("user", JSON.stringify(userData));

            onSuccess(userData);

        } catch (error) {
            console.error(error);
            setErrorMessage(error.message || "Server error");
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
                    if (errorMessage) setErrorMessage('');
                }}
            />

            <input
                className="auth-input"
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage('');
                }}
            />

            {errorMessage && (
                <span style={{
                    color: '#ff4d4d',
                    fontSize: '0.85rem'
                }}>
                    {errorMessage}
                </span>
            )}

            <button className="btn-submit" onClick={handleLogin}>
                Login
            </button>
        </div>
    );
}