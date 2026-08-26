# 🧩 RUBLUT — Interactive 3D Rubik's Cube Solver & Trainer

**RUBLUT** este o aplicație web full-stack modernă creată pentru interacțiunea, vizualizarea 3D și rezolvarea asistată a cubului Rubik. Aceasta integrează conectivitate prin **Bluetooth Low Energy (BLE)** cu un Smart Cube hardware, algoritmi de asistare pas-cu-pas și salvarea automată a stării cubului în baza de date pentru utilizatorii autentificați.

---

## 📸 Screenshots & Prezentare

### 1. Vizualizare Vizitator (Guest View)
La accesarea platformei fără autentificare, utilizatorul poate vizualiza modelul 3D interactiv și accesa ghidurile educaționale.
<img width="1024" height="520" alt="image" src="https://github.com/user-attachments/assets/21f83ebb-bc0b-4210-a1c5-756d2d9ccc15" />

### 2. Tablou de Bord (Utilizator Autentificat)
După logare, sistemul încarcă automat starea salvată a cubului din baza de date. Sunt activate opțiunile de rezolvare asistată (**Tot** / **Primul pas**) și este afișată urarea personalizată.
<img width="1024" height="519" alt="image" src="https://github.com/user-attachments/assets/1bf317f0-f547-4a94-99e8-0275fc4f7bf8" />


### 3. Meniu Lateral & Conectivitate Hardware
Meniul lateral pliabil (`RubikWeb`) oferă acces rapid la calibrare, configurare manuală a culorilor și starea conexiunii Bluetooth cu Smart Cube-ul.
<img width="1023" height="520" alt="image" src="https://github.com/user-attachments/assets/3369b476-be31-469e-9946-691b923f8bbd" />


---

## 🚀 Funcționalități Principale

* **Model 3D Interactiv:** Randare 3D în timp real utilizând Three.js / React Three Fiber.
* **Autentificare & Persistență:** Înregistrare/logare securizată cu salvarea automată a stării curente a cubului în baza de date MySQL.
* **Rezolvare Asistată (Solvers):**
  * **Primul pas:** Oferă un indiciu pentru următoarea mișcare optimă.
  * **Tot:** Calculează și execută secvența completă de rezolvare (algoritmi Kociemba / LBL).
* **Sincronizare BLE (Bluetooth):** Conectare directă din browser la Smart Cubes (ex: GoCube) prin Web Bluetooth API.
* **Meniu de Misiuni & Setări:** Opțiuni dedicate pentru calibrare, personalizare culori și navigare intuitivă.
* **Modul Tutoriale:** Resurse educaționale integrate pentru învățarea metodelor de rezolvare (LBL, CFOP, Roux).

---

## 🛠️ Stack Tehnologic

* **Frontend:** React.js, React Three Fiber (Three.js), Web Bluetooth API, CSS3 / Tailwind CSS
* **Backend:** Spring Boot (Java)
* **Bază de date:** MySQL
* **Protocol Hardware:** Bluetooth Low Energy (BLE)

---

## 📦 Instalare și Rulare Locală

### Cerințe preliminare
* **Node.js** (v16+)
* **Java JDK** (v17+)
* **MySQL Server**

### 1. Clonare repository
```bash
git clone [https://github.com/scutedi/Rubik-Cube-App.git](https://github.com/scutedi/Rubik-Cube-App.git)
cd Rubik-Cube-App
