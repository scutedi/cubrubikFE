import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Login } from "./Login";
import { Register } from "./Register";
import "./AuthButtons.css";

export function AuthButtons({ user, setUser, onLogout }) {
    const [open, setOpen] = useState(null);

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, [setUser]);

    const closeModal = () => setOpen(null);

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("cubeState");
        if (onLogout) {
            onLogout();
        }
        setUser(null);
    };

    const handleLoginSuccess = (userData) => {
        setUser(userData);
        closeModal();
    };

    return (
        <div className="auth-container">
            <AnimatePresence mode="wait">
                {!user ? (
                    <motion.div
                        key="logged-out"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ display: 'flex', gap: '12px' }}
                    >
                        <button className="btn-auth" onClick={() => setOpen("login")}>
                            Login
                        </button>
                        <button className="btn-auth" onClick={() => setOpen("register")}>
                            Register
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="logged-in"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ display: 'flex', alignItems: 'center', gap: '15px' }}
                    >
                        <span className="user-welcome">
                            Salut, <strong>{user.username}</strong>!
                        </span>
                        <button className="btn-auth logout-style" onClick={handleLogout}>
                            Logout
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {open && (
                    <motion.div className="modal-overlay" onClick={closeModal} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <motion.div className="auth-card" onClick={(e) => e.stopPropagation()} initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
                            <h3>{open === "login" ? "Welcome Back" : "Create Account"}</h3>

                            {open === "login" ? (
                                <Login onSuccess={handleLoginSuccess} />
                            ) : (
                                <Register onSuccess={() => setOpen("login")} />
                            )}

                            <button className="btn-switch" onClick={() => setOpen(open === "login" ? "register" : "login")}>
                                {open === "login" ? "Don't have an account? Register" : "Already have an account? Login"}
                            </button>
                            <button className="btn-close" onClick={closeModal}>Cancel</button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}