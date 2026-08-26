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

export function RouxGuide() {
    const moveImages = {
        L: Limg, R: Rimg, U: Uimg, D: Dimg, F: Fimg, B: Bimg,
        "L'": Lpimg, "R'": Rpimg, "U'": Upimg, "D'": Dpimg, "F'": Fpimg, "B'": Bpimg,
        L2: L2img, R2: R2img, U2: U2img, D2: D2img, F2: F2img, B2: B2img,
    };

    const steps = [
        {
            title: "1. Primul Bloc (First Block - 1x2x3)",
            description: "Se construiește intuitiv un bloc de dimensiune 1x2x3 pe partea stângă a cubului (de obicei jos-stânga, folosind culorile albastru/alb). Acest pas nu folosește algoritmi ficși, ci se bazează pe eficiență și orientare spațială.",
            algorithms: [["L", "U'", "L'", "U", "L"]] // Un exemplu simplu de grupare a pieselor pe stânga
        },
        {
            title: "2. Al Doilea Bloc (Second Block - 1x2x3)",
            description: "Se construiește un al doilea bloc de 1x2x3 pe partea dreaptă (jos-dreapta), opus primului. Partea genială? În acest pas ai voie să miști doar straturile R (Right) și U (Up), plus stratul de mijloc M, lăsând primul bloc neatins.",
            algorithms: [["R", "U", "R'", "U'", "R", "U", "R'"]]
        },
        {
            title: "3. CMLL (Corners of the Last Layer)",
            description: "Se rezolvă și se orientează cele 4 colțuri rămase pe stratul superior, fără a ține cont de muchiile de sus. Există 42 de algoritmi posibili. Iată unul dintre cele mai des întâlnite cazuri (U-Perm pt colțuri):",
            algorithms: [["R", "U", "R'", "U'", "R'", "F", "R", "F'"]]
        },
        {
            title: "4. LSE (Last Six Edges - Ultimele 6 muchii)",
            description: "Se rezolvă ultimele 6 muchii rămase (cele 4 de pe stratul de sus și cele 2 de jos). Acest pas se face aproape exclusiv din mișcări ale stratului de mijloc (M) și stratului superior (U), fiind cel mai rapid și spectaculos pas din metodă.",
            algorithms: [["U", "U", "U'", "U'"]] // Reprezentare simbolică (LSE folosește intens axa M)
        }
    ];

    const styles = {
        container: {
            padding: "20px 10px",
            color: "#e2e8f0",
            width: "100%",
            maxWidth: "1150px",
            margin: "0 auto",
            fontFamily: "system-ui, -apple-system, sans-serif",
        },
        title: {
            fontSize: "2.2rem",
            fontWeight: "800",
            background: "linear-gradient(to right, #10b981, #06b6d4)", // Gradient verde-cyan, proaspăt, specific stilului Roux
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "8px",
        },
        subtitle: {
            color: "#94a3b8",
            fontSize: "1.1rem",
            marginBottom: "35px",
        },
        card: {
            background: "linear-gradient(145deg, #11221a, #0b1411)", // Fundal închis cu tentă bio-tech / smarald
            padding: "30px",
            borderRadius: "16px",
            marginBottom: "24px",
            border: "1px solid #1e3a2b",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
            width: "100%",
            boxSizing: "border-box"
        },
        stepTitle: {
            fontSize: "1.4rem",
            fontWeight: "700",
            color: "#ffffff",
            margin: "0 0 10px 0",
        },
        stepDesc: {
            color: "#cbd5e1",
            fontSize: "1rem",
            lineHeight: "1.6",
            margin: "0 0 24px 0",
        },
        algoContainer: {
            display: "flex",
            gap: "14px",
            flexWrap: "wrap",
            background: "rgba(0, 0, 0, 0.3)",
            padding: "20px",
            borderRadius: "14px",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            width: "100%",
            boxSizing: "border-box"
        },
        moveCard: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            background: "#080f0c",
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #13251c",
            width: "100px",
            boxSizing: "border-box"
        },
        moveImage: {
            width: "75px",
            height: "75px",
            objectFit: "contain",
        },
        moveText: {
            fontSize: "1rem",
            fontWeight: "bold",
            color: "#10b981", // Text verde smarald asortat
        },
        fallbackText: {
            fontSize: "1.8rem",
            fontWeight: "bold",
            color: "#06b6d4",
            height: "75px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Metoda Roux</h1>
            <p style={styles.subtitle}>
                O metodă modernă bazată pe blocuri intuitive, mișcări puține și libertate completă a stratului de mijloc.
            </p>

            {steps.map((step, index) => (
                <div key={index} style={styles.card}>
                    <h3 style={styles.stepTitle}>{step.title}</h3>
                    <p style={styles.stepDesc}>{step.description}</p>

                    {step.algorithms.map((algorithm, algoIndex) => (
                        <div key={algoIndex} style={styles.algoContainer}>
                            {algorithm.map((move, moveIndex) => (
                                <div key={moveIndex} style={styles.moveCard}>
                                    {moveImages[move] ? (
                                        <img
                                            src={moveImages[move]}
                                            alt={move}
                                            style={styles.moveImage}
                                        />
                                    ) : (
                                        /* În caz că ai mutări speciale gen M sau M' pe viitor, se randează frumos ca text */
                                        <div style={styles.fallbackText}>{move}</div>
                                    )}
                                    <span style={styles.moveText}>{move}</span>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}