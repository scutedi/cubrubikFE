import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function FloatingMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeModal, setActiveModal] = useState(null);

    const menuItems = [
        { id: 1, label: "Metoda LBL" },
        { id: 2, label: "Metoda CFOP" },
        { id: 3, label: "Metoda Roux" },
        { id: 4, label: "Notatii oficiale ale miscarilor" }
    ];

    const mainButtonStyle = {
        padding: "12px 24px",
        borderRadius: "12px",
        border: "none",
        background: "#6366f1",
        color: "white",
        fontWeight: "bold",
        cursor: "pointer",
        boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
    };

    const itemButtonStyle = {
        padding: "12px 20px",
        borderRadius: "10px",
        border: "1px solid rgba(255,255,255,0.2)",
        background: "rgba(30, 30, 40, 0.9)",
        color: "white",
        cursor: "pointer",
        marginBottom: "8px",
        width: "180px",
        textAlign: "left",
        backdropFilter: "blur(5px)"
    };

    return (
        <>
            <AnimatePresence>
                {activeModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: "fixed",
                            top: 0, left: 0, width: "100vw", height: "100vh",
                            background: "rgba(0,0,0,0.7)",
                            backdropFilter: "blur(15px)",
                            display: "flex", justifyContent: "center", alignItems: "center",
                            zIndex: 9999
                        }}
                        onClick={() => setActiveModal(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.8, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            style={{
                                background: "#1a1a2e",
                                padding: "40px",
                                borderRadius: "20px",
                                border: "1px solid #333",
                                color: "white",
                                textAlign: "center",
                                maxWidth: "400px"
                            }}
                            onClick={(e) => e.stopPropagation()} // Să nu se închidă dacă apeși pe text
                        >
                            <h2>{activeModal}</h2>
                            <p>Aici pui conținutul pentru acest tutorial...</p>
                            <button
                                onClick={() => setActiveModal(null)}
                                style={{ marginTop: "20px", padding: "10px 20px", cursor: "pointer" }}
                            >
                                Am înțeles
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div style={{ position: "fixed", bottom: 30, right: 30, zIndex: 9000, display: "flex", flexDirection: "column", alignItems: "flex-end" }}>

                <AnimatePresence>
                    {isOpen && !activeModal && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            style={{ display: "flex", flexDirection: "column", marginBottom: "10px" }}
                        >
                            {menuItems.map((item) => (
                                <motion.button
                                    key={item.id}
                                    whileHover={{ x: -5, background: "#4f46e5" }}
                                    style={itemButtonStyle}
                                    onClick={() => {
                                        setActiveModal(item.label); // Deschide modalul mare
                                        setIsOpen(false);           // Închide lista mică
                                    }}
                                >
                                    {item.label}
                                </motion.button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(!isOpen)}
                    style={mainButtonStyle}
                >
                    {isOpen ? "Închide" : "Tutorial"}
                </motion.button>
            </div>
        </>
    );
}