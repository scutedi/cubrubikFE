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

export function LBLGuide() {
    const moveImages = {
        L: Limg, R: Rimg, U: Uimg, D: Dimg, F: Fimg, B: Bimg,
        "L'": Lpimg, "R'": Rpimg, "U'": Upimg, "D'": Dpimg, "F'": Fpimg, "B'": Bpimg,
        L2: L2img, R2: R2img, U2: U2img, D2: D2img, F2: F2img, B2: B2img,
    };

    const steps = [
        {
            title: "1. Crucea Albă (White Cross)",
            description: "Creează o cruce albă pe fața de jos și aliniază muchiile cu centrele laterale.",
            algorithms: [["F", "R", "U", "R'", "U'", "F'"]]
        },
        {
            title: "2. Colțurile Albe (White Corners)",
            description: "Așază colțurile albe pentru a completa primul strat corect.",
            algorithms: [["R'", "D'", "R", "D"]]
        },
        {
            title: "3. Stratul Mijlociu (Middle Layer)",
            description: "Introdu muchiile în stratul mijlociu fără a strica ceea ce ai rezolvat deja.",
            algorithms: [["U", "R", "U'", "R'", "U'", "F'", "U", "F"]]
        },
        {
            title: "4. Crucea Galbenă (Yellow Cross)",
            description: "Formează crucea galbenă pe ultimul strat superior.",
            algorithms: [["F", "R", "U", "R'", "U'", "F'"]]
        }
    ];

    const styles = {
        container: {
            padding: "20px 10px",
            color: "#e2e8f0",
            width: "100%",
            maxWidth: "1150px", // 💡 Ocupă acum toată lățimea modalului extins
            margin: "0 auto",
            fontFamily: "system-ui, -apple-system, sans-serif",
        },
        title: {
            fontSize: "2.2rem",
            fontWeight: "800",
            background: "linear-gradient(to right, #6366f1, #a855f7)",
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
            background: "linear-gradient(145deg, #1e1e38, #151526)",
            padding: "30px", // Padding mărit în interiorul cardurilor
            borderRadius: "16px",
            marginBottom: "24px",
            border: "1px solid #2d2d44",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
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
            color: "#94a3b8",
            fontSize: "1rem",
            lineHeight: "1.6",
            margin: "0 0 24px 0",
        },
        algoContainer: {
            display: "flex",
            gap: "14px",
            flexWrap: "wrap",
            background: "rgba(0, 0, 0, 0.25)",
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
            background: "#0f0f1a",
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #27273a",
            width: "100px", // 💡 Mărit de la 56px la 100px pentru a susține imagini mari
            boxSizing: "border-box"
        },
        moveImage: {
            width: "75px",   // 💡 Imagini considerabil mai mari pentru vizibilitate maximă
            height: "75px",
            objectFit: "contain",
        },
        moveText: {
            fontSize: "1rem", // Text mai lizibil sub imagini
            fontWeight: "bold",
            color: "#6366f1",
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Metoda LBL (Layer by Layer)</h1>
            <p style={styles.subtitle}>
                Ghidul vizual pas cu pas pentru rezolvarea cubului Rubik.
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