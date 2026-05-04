import React, { useState } from "react";

// 🔥 import imagini (rămân aceleași)
import Limg from "../../assets/L.png";
import Rimg from "../../assets/R.png";
import Uimg from "../../assets/U.png";
import Dimg from "../../assets/D.png";
import Fimg from "../../assets/F.png";
import Bimg from "../../assets/B.png";
import Lpimg from "../../assets/L'.png";
import Rpimg from "../../assets/R'.png";
import Upimg from "../../assets/U'.png";
import Dpimg from "../../assets/D'.png";
import Fpimg from "../../assets/F'.png";
import Bpimg from "../../assets/B'.png";
import L2img from "../../assets/L2.png";
import R2img from "../../assets/R2.png";
import U2img from "../../assets/U2.png";
import D2img from "../../assets/D2.png";
import F2img from "../../assets/F2.png";
import B2img from "../../assets/B2.png";

const moveImages = {
    "L": Limg, "L'": Lpimg, "L2": L2img,
    "R": Rimg, "R'": Rpimg, "R2": R2img,
    "U": Uimg, "U'": Upimg, "U2": U2img,
    "D": Dimg, "D'": Dpimg, "D2": D2img,
    "F": Fimg, "F'": Fpimg, "F2": F2img,
    "B": Bimg, "B'": Bpimg, "B2": B2img,
};

export default function SolutionViewer({ solution }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    if (!solution) return null;

    const moves = solution;

    const currentMove = moves[currentIndex];

    const nextMove = () => {
        if (currentIndex < moves.length - 1) setCurrentIndex(currentIndex + 1);
    };

    const prevMove = () => {
        if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
    };

    return (
        <div style={{
            position: 'fixed',
            right: '30px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '160px',
            backgroundColor: 'rgba(20, 20, 20, 0.9)',
            padding: '20px',
            borderRadius: '15px',
            border: '1px solid #444',
            color: 'white',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            fontFamily: 'Arial, sans-serif'
        }}>
            <span style={{ fontSize: '12px', color: '#888', marginBottom: '10px' }}>
                Pas {currentIndex + 1} / {moves.length}
            </span>

            {/* BUTONUL CENTRAL CU MUTAREA */}
            <div
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                    position: 'relative',
                    width: '80px',
                    height: '80px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '32px',
                    fontWeight: 'bold',
                    color: '#ff4444',
                    border: '2px solid #ff4444',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    backgroundColor: isHovered ? 'rgba(255, 68, 68, 0.1)' : 'transparent'
                }}
            >
                {currentMove}

                {/* IMAGINEA CARE APARE LA HOVER (În stânga) */}
                {isHovered && moveImages[currentMove] && (
                    <div style={{
                        position: 'absolute',
                        right: '120%',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        backgroundColor: '#1a1a1a',
                        border: '1px solid #ff4444',
                        borderRadius: '10px',
                        padding: '10px',
                        boxShadow: '0 5px 20px rgba(0,0,0,0.8)',
                        animation: 'popIn 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                    }}>
                        <img
                            src={moveImages[currentMove]}
                            alt={currentMove}
                            style={{ width: '130px', height: '130px', display: 'block' }}
                        />
                    </div>
                )}
            </div>

            {/* CONTROALE NEXT / PREV */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px', width: '100%' }}>
                <button
                    onClick={prevMove}
                    disabled={currentIndex === 0}
                    style={{
                        flex: 1,
                        padding: '8px',
                        backgroundColor: currentIndex === 0 ? '#333' : '#555',
                        border: 'none',
                        color: 'white',
                        borderRadius: '6px',
                        cursor: currentIndex === 0 ? 'default' : 'pointer',
                        fontSize: '12px'
                    }}
                >
                    Prev
                </button>
                <button
                    onClick={nextMove}
                    disabled={currentIndex === moves.length - 1}
                    style={{
                        flex: 1,
                        padding: '8px',
                        backgroundColor: currentIndex === moves.length - 1 ? '#333' : '#ff4444',
                        border: 'none',
                        color: 'white',
                        borderRadius: '6px',
                        cursor: currentIndex === moves.length - 1 ? 'default' : 'pointer',
                        fontWeight: 'bold',
                        fontSize: '12px'
                    }}
                >
                    Next
                </button>
            </div>

            {/* Stil pentru animație pop-in */}
            <style>
                {`
                    @keyframes popIn {
                        0% { opacity: 0; transform: translateY(-50%) scale(0.8); }
                        100% { opacity: 1; transform: translateY(-50%) scale(1); }
                    }
                `}
            </style>
        </div>
    );
}