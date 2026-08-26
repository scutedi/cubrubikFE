import React from "react";

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

export function NotationsGuide() {
    const moves = [
        { name: "L", img: Limg, desc: "Left face clockwise" },
        { name: "R", img: Rimg, desc: "Right face clockwise" },
        { name: "U", img: Uimg, desc: "Up face clockwise" },
        { name: "D", img: Dimg, desc: "Down face clockwise" },
        { name: "F", img: Fimg, desc: "Front face clockwise" },
        { name: "B", img: Bimg, desc: "Back face clockwise" },

        { name: "L'", img: Lpimg, desc: "Left face counter-clockwise" },
        { name: "R'", img: Rpimg, desc: "Right face counter-clockwise" },
        { name: "U'", img: Upimg, desc: "Up face counter-clockwise" },
        { name: "D'", img: Dpimg, desc: "Down face counter-clockwise" },
        { name: "F'", img: Fpimg, desc: "Front face counter-clockwise" },
        { name: "B'", img: Bpimg, desc: "Back face counter-clockwise" },

        { name: "L2", img: L2img, desc: "Left face 180°" },
        { name: "R2", img: R2img, desc: "Right face 180°" },
        { name: "U2", img: U2img, desc: "Up face 180°" },
        { name: "D2", img: D2img, desc: "Down face 180°" },
        { name: "F2", img: F2img, desc: "Front face 180°" },
        { name: "B2", img: B2img, desc: "Back face 180°" },
    ];

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Rubik Cube Notations</h1>
            <p style={styles.subtitle}>
                Toate mișcările oficiale folosite în algoritmi (LBL / CFOP / Roux)
            </p>

            <div style={styles.grid}>
                {moves.map((m) => (
                    <div key={m.name} style={styles.card}>
                        <img src={m.img} alt={m.name} style={styles.img} />
                        <h2 style={styles.name}>{m.name}</h2>
                        <p style={styles.desc}>{m.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

const styles = {
    container: {
        padding: "30px",
        color: "white",
        background: "#0f0f1a",
        minHeight: "100vh",
    },
    title: {
        fontSize: "32px",
        marginBottom: "10px",
    },
    subtitle: {
        opacity: 0.7,
        marginBottom: "20px",
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: "15px",
    },
    card: {
        background: "#1a1a2e",
        padding: "15px",
        borderRadius: "12px",
        textAlign: "center",
        border: "1px solid #333",
    },
    img: {
        width: "60px",
        height: "60px",
        objectFit: "contain",
    },
    name: {
        marginTop: "10px",
    },
    desc: {
        fontSize: "12px",
        opacity: 0.7,
    },
};