import { useState } from "react";
// 1. Importăm componentele de Toast
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function Register({ onSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username,
                    password,
                    cubeState: "UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB"
                })
            });

            if (response.ok) {
                // 2. Afișăm toast-ul de succes
                toast.success(" Cont creat cu succes! Te poți loga.", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "colored",
                });

                // Așteptăm puțin să vadă user-ul mesajul înainte de a schimba pagina
                setTimeout(() => {
                    onSuccess();
                }, 2000);

            } else {
                toast.error("Eroare la înregistrare. Username-ul ar putea fi luat.");
            }
        } catch (error) {
            toast.error("Eroare severă la server.");
        }
    };

    return (
        <>
            {/* 3. Adăugăm Container-ul de Toast oriunde în JSX */}
            <ToastContainer />

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