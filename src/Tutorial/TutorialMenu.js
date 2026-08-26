import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LBLGuide } from "./LBLGuide";
import { NotationsGuide } from "./NotationsGuide";
import { CFOPGuide } from "./CFOPGuide";
import {RouxGuide} from "./RouxGuide";

export function FloatingMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeModal, setActiveModal] = useState(null);

    const MODAL_COMPONENTS = {
        LBL: LBLGuide,
        NOTATIONS: NotationsGuide,
        CFOP : CFOPGuide,
        ROUX: RouxGuide
    };

    const ActiveComponent = activeModal ? MODAL_COMPONENTS[activeModal] : null;

    const menuItems = [
        { id: 1, label: "Metoda LBL", component: "LBL" },
        { id: 2, label: "Metoda CFOP", component: "CFOP" },
        { id: 3, label: "Metoda Roux", component: "ROUX" },
        { id: 4, label: "Notatii oficiale", component: "NOTATIONS" }
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
        border: "1px solid rgba(255,255,255,0.1)",
        background: "rgba(30, 30, 40, 0.9)",
        color: "white",
        cursor: "pointer",
        marginBottom: "8px",
        width: "200px",
        textAlign: "left",
        backdropFilter: "blur(5px)"
    };

    // Funcție simplă ca să transformăm ID-ul din header într-un text mai prietenos
    const getModalTitle = (modal) => {
        if (modal === "LBL") return "Ghid Metoda LBL";
        if (modal === "NOTATIONS") return "Notații Oficiale ale Mișcărilor";
        return modal;
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
                            background: "rgba(0,0,0,0.75)",
                            backdropFilter: "blur(10px)",
                            display: "flex", justifyContent: "center", alignItems: "center",
                            zIndex: 9999
                        }}
                        onClick={() => setActiveModal(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            style={{
                                background: "#0f0f1a",
                                width: "90vw",
                                height: "85vh",
                                borderRadius: "16px",
                                border: "1px solid #222",
                                color: "white",
                                display: "flex",
                                flexDirection: "column",
                                overflow: "hidden",
                                boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
                                position: "relative" // 👈 IMPORTANT: Permite butonului să se alinieze la acest chenar mare
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* HEADER */}
                            <div style={{
                                padding: "20px",
                                borderBottom: "1px solid #222",
                                background: "#131322",
                                flexShrink: 0
                            }}>
                                <h2 style={{ margin: 0, fontSize: "1.5rem", letterSpacing: "0.5px" }}>
                                    {getModalTitle(activeModal)}
                                </h2>
                            </div>

                            {/* CONTAINER CONȚINUT (CU SCROLL NEGRU) */}
                            <div
                                className="custom-scrollbar" // 👈 Îi punem o clasă ca să o putem stiliza
                                style={{
                                    flex: 1,
                                    overflowY: "auto",
                                    padding: "24px",
                                    paddingBottom: "80px",
                                    background: "#09090f"
                                }}
                            >
                                <style>{`
                                    .custom-scrollbar::-webkit-scrollbar {
                                        width: 8px; /* Lățimea scrollbar-ului */
                                    }
                                    .custom-scrollbar::-webkit-scrollbar-track {
                                        background: #09090f; /* Culoarea fundalului pe care merge scroll-ul (asortat cu containerul) */
                                    }
                                    .custom-scrollbar::-webkit-scrollbar-thumb {
                                        background: #1a1a2e; /* Culoarea bbarei de scroll în sine (negru/indigo foarte închis) */
                                        border-radius: 4px;
                                    }
                                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                                        background: #252542; /* Culoarea când pui mouse-ul pe ea */
                                    }
                                `}</style>

                                {ActiveComponent && <ActiveComponent />}
                            </div>

                            <button
                                onClick={() => setActiveModal(null)}
                                style={{
                                    position: "absolute", // 👈 Poziționare absolută direct peste colțul din dreapta-jos
                                    bottom: "20px",
                                    right: "20px",
                                    padding: "10px 24px",
                                    cursor: "pointer",
                                    background: "#6366f1",
                                    color: "white",
                                    fontWeight: "600",
                                    border: "none",
                                    borderRadius: "8px",
                                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.5)", // Umbră puțin mai pronunțată fiindcă plutește peste elemente
                                    zIndex: 100, // Se asigură că stă mereu deasupra imaginilor sau textului din ghid
                                    transition: "background 0.2s"
                                }}
                                onMouseEnter={(e) => e.target.style.background = "#4f46e5"}
                                onMouseLeave={(e) => e.target.style.background = "#6366f1"}
                            >
                                Close
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* BUTONUL FLOTANT DIN COLȚ */}
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
                                        setActiveModal(item.component);
                                        setIsOpen(false);
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
                    {isOpen ? "Închide" : "Tutoriale"}
                </motion.button>
            </div>
        </>
    );
}