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

export function CFOPGuide() {
    const moveImages = {
        L: Limg, R: Rimg, U: Uimg, D: Dimg, F: Fimg, B: Bimg,
        "L'": Lpimg, "R'": Rpimg, "U'": Upimg, "D'": Dpimg, "F'": Fpimg, "B'": Bpimg,
        L2: L2img, R2: R2img, U2: U2img, D2: D2img, F2: F2img, B2: B2img,
    };

    const steps = [
        {
            title: "1. Cross (Crucea)",
            description: "Se rezolvă o cruce (de regulă cea albă) direct pe fața de jos, aliniind în același timp marginile cu centrele laterale. Spre deosebire de LBL, se face direct jos pentru a economisi timp.",
            algorithms: [["D'", "R", "F", "R'"]] // Un exemplu clasic de inserție fluidă
        },
        {
            title: "2. F2L (First Two Layers - Primele două straturi)",
            description: "Cea mai importantă etapă din CFOP. În loc să rezolvi colțurile și apoi muchiile separat (ca la LBL), aici combini un colț cu muchia corespunzătoare în slotul lor în același timp. (Exemplu de algoritm pentru un caz de bază):",
            algorithms: [["R", "U", "R'"], ["U'", "R", "U", "R'"]]
        },
        {
            title: "3. OLL (Orientation of the Last Layer - Orientarea ultimului strat)",
            description: "Se orientează toate piesele stratului superior astfel încât întreaga față de sus să devină galbenă. Există 57 de cazuri complete, dar cel mai utilizat algoritm de bază este „Sune”:",
            algorithms: [["R", "U", "R'", "U", "R", "U2", "R'"]]
        },
        {
            title: "4. PLL (Permutation of the Last Layer - Permutarea ultimului strat)",
            description: "Ultimul pas. Se mută piesele deja galbene în pozițiile lor corecte pe lateral pentru a termina complet cubul. Unul dintre cele mai populare cazuri este T-Perm:",
            algorithms: [["R", "U", "R'", "U'", "R'", "F", "R2", "U'", "R'", "U'", "R", "U", "R'", "F'"]]
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
            background: "linear-gradient(to right, #e11d48, #f59e0b)", // Gradient roșu-portocaliu dinamic pentru CFOP (Metoda avansată)
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
            background: "linear-gradient(145deg, #221622, #150f1a)", // Nuanțe închise premium cu o tentă fină de burgundiu
            padding: "30px",
            borderRadius: "16px",
            marginBottom: "24px",
            border: "1px solid #3c243c",
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
            background: "#0c0812",
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #2e1a35",
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
            color: "#f59e0b", // Text galben-portocaliu asortat cu stilul CFOP
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Metoda CFOP (Fridrich Method)</h1>
            <p style={styles.subtitle}>
                Ghidul introductiv pentru cea mai rapidă metodă de rezolvare din lume (Cross, F2L, OLL, PLL).
            </p>

            {steps.map((step, index) => (
                <div key={index} style={styles.card}>
                    <h3 style={styles.stepTitle}>{step.title}</h3>
                    <p style={styles.stepDesc}>{step.description}</p>

                    {step.algorithms.map((algorithm, algoIndex) => (
                        <div key={algoIndex} style={styles.algoContainer}>
                            {algorithm.map((move, moveIndex) => (
                                <div key={moveIndex} style={styles.moveCard}>
                                    <img
                                        src={moveImages[move]}
                                        alt={move}
                                        style={styles.moveImage}
                                    />
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