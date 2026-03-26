# ⚡ CompaCarga R5

Calculadora avanzada de coste y tiempo de carga para el **Renault 5 E-Tech (52 kWh)**.

Disponible online en:  
👉 https://davofn.github.io/CompaCarga_R5/

---

## 🚗 ¿Qué es?

**CompaCarga R5** es una **Progressive Web App (PWA)** diseñada para comparar de forma rápida y realista dos cargadores distintos para el Renault 5 E-Tech.

Permite comparar:

- 🔌 **Dos cargadores distintos**, configurables como **AC o DC**
- 💶 **Coste total** de la carga
- ⏱ **Tiempo estimado** de carga
- 🏆 **Ganador por coste**
- 🏁 **Ganador por tiempo**
- ✅ **Selección manual** del cargador que finalmente eliges
- 📝 **Histórico de cargas guardadas**
- 📤 **Exportación a CSV**

Está pensada específicamente para el **Renault 5 E-Tech 52 kWh**, con una lógica de cálculo adaptada a sus límites de carga.

---

## ✨ Funcionalidades principales

- Comparación entre **Cargador A** y **Cargador B**
- Selección explícita del tipo de cargador:
  - **AC**
  - **DC**
- Aplicación automática de límites según el tipo:
  - **AC → máximo 11 kW**
  - **DC → máximo 100 kW**
- Mensaje informativo en pantalla indicando las restricciones aplicadas
- Resaltado visual del ganador por:
  - **coste**
  - **tiempo**
- Elección manual del cargador preferido
- Guardado en histórico del cargador seleccionado
- Exportación del histórico en formato **CSV**
- Diseño responsive para **móvil y escritorio**
- Instalación como app gracias a PWA

---

## 🧠 Modelo de cálculo

### 🔋 Energía a cargar

La energía a cargar se calcula así:

```text
kWh a cargar = ((% final - % inicial) / 100) × batería útil
