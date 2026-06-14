import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SolutionViewer from "./SolutionViewer";

export default function SolutionControls({
                                             solutionMoves
                                             , selection, setSelection,
                                             onGenerateSolution
                                         }) {
    const [loading, setLoading] = useState(false);

    const handleAction = async (type) => {
        setSelection(type);
        setLoading(true);
        try {
            await onGenerateSolution();
        } catch (error) {
            console.error("Eroare la generare");
        } finally {
            setLoading(false);
        }
    };

    const getMoves = () => {
        if (selection === 'all') return solutionMoves;
        if (selection === 'first' && solutionMoves.length > 0) return [solutionMoves[0]];
        return [];
    };

    return (
        <>
            <AnimatePresence mode="wait">
                {/* 1. BUTOANELE MICI - MIJLOC JOS */}
                {selection === null && (
                    <motion.div
                        key="buttons"
                        initial={{ opacity: 0, y: 50, x: "-50%" }}
                        animate={{ opacity: 1, y: 0, x: "-50%" }}
                        exit={{ opacity: 0, y: 20, x: "-50%" }}
                        style={bottomCenterContainer}
                    >
                        <button
                            onClick={() => handleAction('all')}
                            style={compactBtnStyle}
                            className="btn-minimal"
                        >
                            📖 Tot
                        </button>
                        <button
                            onClick={() => handleAction('first')}
                            style={compactBtnStyle}
                            className="btn-minimal"
                        >
                            ☝️ Primul pas
                        </button>
                    </motion.div>
                )}

                {loading && (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0, y: 20, x: "-50%" }}
                        animate={{ opacity: 1, y: 0, x: "-50%" }}
                        style={bottomStatusStyle}
                    >
                        <div className="loader-dot"></div>
                        <span style={{ fontSize: '13px', color: '#94a3b8' }}>Se calculează...</span>
                    </motion.div>
                )}

                {selection !== null && !loading && (
                        <SolutionViewer
                            solution={getMoves()}
                            onFinish={() => setSelection(null)}
                        />
                )}
            </AnimatePresence>

            <style>{`
                .btn-minimal {
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                .btn-minimal:hover {
                    background: #4f46e5 !important;
                    transform: translateY(-3px);
                    box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.3) !important;
                }
                .loader-dot {
                    width: 8px;
                    height: 8px;
                    background: #6366f1;
                    border-radius: 50%;
                    animation: pulse 0.6s infinite alternate;
                }
                @keyframes pulse { from { opacity: 0.3; transform: scale(0.8); } to { opacity: 1; transform: scale(1.2); } }
            `}</style>
        </>
    );
}


const bottomCenterContainer = {
    position: "fixed",
    bottom: "30px",
    left: "50%",
    display: "flex",
    gap: "12px",
    zIndex: 1000,
    background: "rgba(15, 23, 42, 0.8)",
    padding: "8px 16px",
    borderRadius: "20px",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)"
};

const compactBtnStyle = {
    padding: "8px 16px",
    background: "#6366f1",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "13px",
    letterSpacing: "0.3px",
};

const bottomStatusStyle = {
    position: "fixed",
    bottom: "40px",
    left: "50%",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "rgba(15, 23, 42, 0.9)",
    padding: "10px 20px",
    borderRadius: "15px",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    zIndex: 1001
};