# ⚡ CompaCarga R5

Calculadora avanzada de coste y tiempo de carga para el **Renault 5 E-Tech (52 kWh)**.

Disponible online en:
👉 https://davofn.github.io/CompaCarga_R5/

---

## 🚗 ¿Qué es?

CompaCarga R5 es una Progressive Web App (PWA) que permite comparar:

- 🔌 Dos cargadores distintos (AC o DC)
- 💶 Coste total de la carga
- ⏱ Tiempo estimado realista
- 🏆 Ganador por coste y por tiempo

Diseñada específicamente para el Renault 5 E-Tech 52 kWh.

---

## 🧠 Modelo de cálculo

### 🔋 Energía a cargar

---

### 🟢 Carga AC (≤ 11 kW)

- Potencia constante
- Tiempo = kWh / Potencia

---

### 🔵 Carga DC (> 11 kW)

- Limitada automáticamente a 100 kW (límite del R5)
- Aplicación de curva de carga estimada por tramos

Curva estándar utilizada (no oficial):

| SoC        | Potencia media |
|------------|---------------|
| 0–20%      | 95 kW        |
| 20–40%     | 85 kW        |
| 40–60%     | 70 kW        |
| 60–80%     | 50 kW        |
| 80–90%     | 35 kW        |
| 90–100%    | 20 kW        |

⚠️ Esta curva es una estimación basada en comportamiento típico de vehículos eléctricos de este segmento.  
Renault no publica oficialmente la curva detallada.

---

## 📱 Instalación como App

Al ser una PWA, puede instalarse en Android o iOS:

- Android → "Instalar app"
- iPhone → "Añadir a pantalla de inicio"

Funciona offline tras la primera carga.

---

## 🛠 Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript vanilla
- Service Worker
- Web App Manifest
- GitHub Pages

---

## 🎯 Objetivo del proyecto

Pasar de un Excel de cálculo simple a una herramienta web:

- Más realista
- Más técnica
- Instalable
- Siempre disponible

---

## 📦 Versiones

- **v1.0** → Modelo lineal
- **v1.1** → Modelo DC con curva por tramos + límite 100 kW

---

## 👨‍💻 Autor

Proyecto personal desarrollado por David (Administrador de Sistemas).

---

⚡ Renault 5 E-Tech · Ingeniería aplicada a la carga real
