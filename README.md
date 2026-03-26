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

- 🔄 Comparación en tiempo real entre **Cargador A** y **Cargador B**
- ⚙️ Selección explícita del tipo de cargador:
  - **AC**
  - **DC**
- 🔒 Aplicación automática de límites del vehículo:
  - **AC → máximo 11 kW**
  - **DC → máximo 100 kW**
- 💡 Mensajes dinámicos indicando restricciones aplicadas
- 🎯 Resaltado automático del ganador directamente en cada tarjeta
- 🎨 Identificación visual rápida (colores, badges, líneas superiores)
- 🧠 Elección manual del cargador preferido
- 📝 Histórico persistente en navegador
- 📊 Exportación de datos a CSV
- 📱 Diseño responsive optimizado para móvil y escritorio
- 📦 Instalación como aplicación (PWA)

---

## 🧠 Modelo de cálculo

### 🔋 Energía a cargar

La energía necesaria se calcula como:

`kWh a cargar = ((% final - % inicial) / 100) × batería útil`

---

### 🟢 Carga AC

En modo **AC**, el Renault 5 E-Tech está limitado a:

**11 kW**

- Si introduces ≤ 11 kW → se usa esa potencia  
- Si introduces > 11 kW → se limita automáticamente a 11 kW  

Cálculo del tiempo:

`Tiempo = kWh a cargar / potencia efectiva`

---

### 🔵 Carga DC

En modo **DC**, el Renault 5 E-Tech está limitado a:

**100 kW**

- Si introduces ≤ 100 kW → se usa esa potencia  
- Si introduces > 100 kW → se limita automáticamente a 100 kW  

Además, se aplica una **curva de carga por tramos**, ya que la potencia no es constante.

---

### 📊 Curva de carga utilizada (estimación)

| SoC | Potencia |
|-----|--------:|
| 0–20% | 95 kW |
| 20–40% | 85 kW |
| 40–60% | 70 kW |
| 60–80% | 50 kW |
| 80–90% | 35 kW |
| 90–100% | 20 kW |

> ⚠️ Curva estimada basada en comportamiento típico.  
> Renault no publica la curva oficial completa.

---

## 🎨 Interfaz y usabilidad

La aplicación está diseñada para ser clara, rápida y visual:

- 🟡🔵 Tarjetas diferenciadas para cada cargador
- 🅰️🅱️ Badge identificador visible en todo momento
- 🎛 Selector AC/DC integrado en cabecera
- 📦 Inputs agrupados y limpios (potencia + precio)
- 🟦 Tiempo en caja azul
- 🟨 Coste en caja amarilla
- 🏆 Resaltado automático del ganador directamente en la tarjeta
- 🎯 Botones de selección con color por cargador

Resultado:  
👉 Puedes decidir en segundos sin mirar la tabla inferior.

---

## 📝 Histórico de cargas

Permite guardar comparaciones reales.

Cada registro incluye:

- 📅 Fecha
- 🔘 Cargador elegido
- 🔌 Tipo (AC/DC)
- 🔋 SoC inicial y final
- ⚡ Energía cargada (kWh)
- 🔌 Potencia
- ⏱ Tiempo
- 💶 Coste

Funciones:

- 💾 Guardar carga
- 📤 Exportar CSV
- 🧹 Limpiar histórico

> Los datos se guardan en `localStorage`.

---

## 📱 Instalación como app

La app es una **PWA**, por lo que se puede instalar.

### Android

- Abrir en Chrome
- Pulsar **Instalar app**

### iPhone

- Abrir en Safari
- Compartir → **Añadir a pantalla de inicio**

### Escritorio

- Instalable desde navegador compatible

✔ Funciona offline tras la primera carga

---

## 🛠 Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript (vanilla)
- Service Worker
- Web App Manifest
- LocalStorage
- GitHub Pages

---

## 🎯 Objetivo del proyecto

Evolución de una hoja Excel hacia una herramienta real:

- más precisa
- más visual
- más rápida
- accesible desde cualquier dispositivo
- instalable como app
- útil en situaciones reales de carga

---

## 📦 Versiones

- **v1.0** → Modelo lineal
- **v1.1** → Curva DC + límite 100 kW
- **v1.2** → UI responsive
- **v1.3** → Histórico + CSV
- **v1.4** → Selección manual
- **v1.5** → AC/DC explícito + límites reales
- **v1.6** → Rediseño visual:
  - tarjetas mejoradas
  - resaltado automático
  - UI más clara y rápida

---

## 👨‍💻 Autor

Proyecto personal desarrollado por **David**  
Administrador de Sistemas · Ingeniería aplicada

---

## ⚡ Nota final

**CompaCarga R5** convierte cálculos complejos en decisiones simples.

👉 Comparas, eliges y listo.

**Renault 5 E-Tech · Ingeniería aplicada a la carga real**
