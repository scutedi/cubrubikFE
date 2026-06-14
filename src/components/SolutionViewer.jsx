import React, { useState, useEffect } from "react";

import Limg from "../assets/L.png";
import Rimg from "../assets/R.png";
import Uimg from "../assets/U.png";
import Dimg from "../assets/D.png";
import Fimg from "../assets/F.png";
import Bimg from "../assets/B.png";
import Lpimg from "../assets/L'.png";
import Rpimg from "../assets/R'.png";
import Upimg from "../assets/U'.png";
import Dpimg from "../assets/D'.png";
import Fpimg from "../assets/F'.png";
import Bpimg from "../assets/B'.png";
import L2img from "../assets/L2.png";
import R2img from "../assets/R2.png";
import U2img from "../assets/U2.png";
import D2img from "../assets/D2.png";
import F2img from "../assets/F2.png";
import B2img from "../assets/B2.png";

const moveImages = {
    "L": Limg, "L'": Lpimg, "L2": L2img,
    "R": Rimg, "R'": Rpimg, "R2": R2img,
    "U": Uimg, "U'": Upimg, "U2": U2img,
    "D": Dimg, "D'": Dpimg, "D2": D2img,
    "F": Fimg, "F'": Fpimg, "F2": F2img,
    "B": Bimg, "B'": Bpimg, "B2": B2img,
};

const COLORS = {
    bg: 'rgba(6, 34, 44, 0.95)',
    accent: '#0b3a4a',
    textMain: '#ffffff',
    textSecondary: '#8ba1a8',
    btnBg: 'rgb(11, 58, 74)',
    btnBgHover: 'rgb(16, 78, 99)',
};

export default function SolutionViewer({ solution, onFinish }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        setCurrentIndex(0);
    }, [solution]);

    if (!solution || solution.length === 0) {
        return null;
    }

    const moves = solution;

    const safeIndex = Math.min(currentIndex, moves.length - 1);
    const currentMove = moves[safeIndex];

    const nextMove = () => {
        if (currentIndex < moves.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            if (onFinish) onFinish();
        }
    };

    const prevMove = () => {
        if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
    };

    const buttonStyle = {
        flex: 1,
        padding: '10px',
        border: 'none',
        color: COLORS.textMain,
        borderRadius: '10px',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: '600',
        transition: 'all 0.2s ease',
        fontFamily: 'inherit',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    };

    return (
        <div style={{
            position: 'fixed',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '180px',
            backgroundColor: COLORS.bg,
            backdropFilter: 'blur(12px)',
            padding: '24px 18px',
            borderRadius: '24px',
            color: COLORS.textMain,
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            fontFamily: 'system-ui, -apple-system, sans-serif',
        }}>

            <button onClick={onFinish} style={closeBtnStyle}>✕</button>

            <div style={stepLabelStyle}>
                Pas <span style={{color: COLORS.textMain}}>{safeIndex + 1}</span> / {moves.length}
            </div>

            <div
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                    position: 'relative',
                    width: '100%',
                    height: '100px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '64px',
                    fontWeight: '800',
                    color: COLORS.textMain,
                    transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                    transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
            >
                {currentMove}

                {isHovered && moveImages[currentMove] && (
                    <div className="move-tooltip" style={tooltipStyle}>
                        <img src={moveImages[currentMove]} alt={currentMove} style={imageStyle} />
                        <div style={{ marginTop: '10px', fontSize: '20px', fontWeight: '800' }}>
                            {currentMove}
                        </div>
                    </div>
                )}
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '20px', width: '100%' }}>
                <button
                    onClick={prevMove}
                    disabled={safeIndex === 0}
                    className="nav-btn-alt"
                    style={{
                        ...buttonStyle,
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        opacity: safeIndex === 0 ? 0.3 : 1,
                    }}
                >
                    Prev
                </button>
                <button
                    onClick={nextMove}
                    className="nav-btn-primary"
                    style={{
                        ...buttonStyle,
                        backgroundColor: COLORS.btnBg,
                    }}
                >
                    {safeIndex === moves.length - 1 ? 'Finish' : 'Next'}
                </button>
            </div>

            <style></style>
        </div>
    );
}

const closeBtnStyle = { position: 'absolute', top: '12px', right: '12px', background: 'transparent', border: 'none', color: COLORS.textSecondary, cursor: 'pointer' };
const stepLabelStyle = { fontSize: '11px', fontWeight: '700', color: COLORS.textSecondary, marginBottom: '15px', letterSpacing: '1px', textTransform: 'uppercase' };
const tooltipStyle = { position: 'absolute', right: '135%', top: '50%', transform: 'translateY(-50%)', backgroundColor: COLORS.bg, borderRadius: '20px', padding: '15px', boxShadow: '0 15px 40px rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.05)' };
const imageStyle = { width: '150px', height: '150px', display: 'block', borderRadius: '12px' };