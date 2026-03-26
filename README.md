⚡ CompaCarga R5

Calculadora avanzada de coste y tiempo de carga para el Renault 5 E-Tech (52 kWh).

Disponible online en:
👉 https://davofn.github.io/CompaCarga_R5/

🚗 ¿Qué es?

CompaCarga R5 es una Progressive Web App (PWA) diseñada para comparar de forma rápida y realista dos cargadores distintos para el Renault 5 E-Tech.

Permite comparar:

🔌 Dos cargadores distintos, configurables como AC o DC
💶 Coste total de la carga
⏱ Tiempo estimado de carga
🏆 Ganador por coste
🏁 Ganador por tiempo
✅ Selección manual del cargador que finalmente eliges
📝 Histórico de cargas guardadas
📤 Exportación a CSV

Está pensada específicamente para el Renault 5 E-Tech 52 kWh, con una lógica de cálculo adaptada a sus límites de carga.

✨ Funcionalidades principales
Comparación entre Cargador A y Cargador B
Selección explícita del tipo de cargador:
AC
DC
Aplicación automática de límites según el tipo:
AC → máximo 11 kW
DC → máximo 100 kW
Mensaje informativo en pantalla indicando las restricciones aplicadas
Resaltado visual del ganador por:
coste
tiempo
Elección manual del cargador preferido
Guardado en histórico del cargador seleccionado
Exportación del histórico en formato CSV
Diseño responsive para móvil y escritorio
Instalación como app gracias a PWA
🧠 Modelo de cálculo
🔋 Energía a cargar

La energía a cargar se calcula así:

kWh a cargar = ((% final - % inicial) / 100) × batería útil

🟢 Carga AC

En modo AC, el Renault 5 E-Tech admite un máximo de 11 kW.

Por tanto:

Si introduces una potencia menor o igual a 11 kW, se usa esa potencia.
Si introduces una potencia superior, la app aplica automáticamente el límite de 11 kW.

Cálculo del tiempo:

Tiempo = kWh a cargar / potencia efectiva

🔵 Carga DC

En modo DC, el Renault 5 E-Tech admite un máximo de 100 kW.

Por tanto:

Si introduces una potencia menor o igual a 100 kW, se usa esa potencia.
Si introduces una potencia superior, la app aplica automáticamente el límite de 100 kW.

Además, en DC no se usa una potencia constante, sino una curva de carga estimada por tramos de SoC.

Curva estándar utilizada (estimación no oficial)
SoC	Potencia media
0–20%	95 kW
20–40%	85 kW
40–60%	70 kW
60–80%	50 kW
80–90%	35 kW
90–100%	20 kW

⚠️ Esta curva es una estimación basada en el comportamiento típico esperado para vehículos eléctricos de este segmento.
Renault no publica oficialmente la curva detallada completa del Renault 5 E-Tech.

🎨 Interfaz y usabilidad

La aplicación incluye varias mejoras visuales y de usabilidad:

Tarjetas independientes para Cargador A y Cargador B
Identificación rápida mediante:
badge A/B
franja superior de color
Selector de tipo AC/DC integrado en la cabecera de cada tarjeta
Resultados destacados en cajas separadas:
Tiempo en azul
Coste en amarillo
Resaltado automático del ganador directamente en la tarjeta correspondiente
Botones de selección manual con color identificativo para cada cargador
📝 Histórico de cargas

La app permite guardar cargas comparadas en un histórico local del navegador.

Cada registro almacena:

Fecha y hora
Cargador elegido
Tipo de cargador (AC/DC)
SoC inicial y final
Energía cargada (kWh)
Potencia usada
Tiempo estimado
Coste

Funciones disponibles:

Guardar carga
Exportar CSV
Limpiar histórico

Los datos se almacenan en localStorage, por lo que permanecen guardados en el dispositivo o navegador hasta que se eliminen manualmente.

📱 Instalación como app

Al ser una PWA, puede instalarse en móvil o escritorio.

En Android
Abrir la web en Chrome
Pulsar Instalar app
En iPhone / iPad
Abrir la web en Safari
Pulsar Compartir
Seleccionar Añadir a pantalla de inicio
En escritorio
En navegadores compatibles, se puede instalar desde la barra de direcciones o desde el menú del navegador.

Después de la primera carga, la app puede seguir funcionando offline gracias al Service Worker.

🛠 Tecnologías utilizadas
HTML5
CSS3
JavaScript vanilla
Service Worker
Web App Manifest
LocalStorage
GitHub Pages
🎯 Objetivo del proyecto

Este proyecto nace como evolución de una hoja Excel inicial, con la idea de convertirla en una herramienta web más práctica y realista.

Objetivos:

pasar de un cálculo lineal simple a una simulación más útil
reflejar mejor el comportamiento real de la carga AC/DC
disponer de una herramienta siempre accesible
poder usarla como app instalada en el móvil
guardar comparativas reales para consulta posterior
📦 Versiones
v1.0 → Modelo lineal inicial
v1.1 → Modelo DC con curva por tramos + límite 100 kW
v1.2 → Mejoras visuales y estructura responsive
v1.3 → Histórico local y exportación CSV
v1.4 → Selección manual del cargador elegido
v1.5 → Selección explícita AC/DC por cargador + límites automáticos:
AC limitado a 11 kW
DC limitado a 100 kW
v1.6 → Rediseño visual de tarjetas:
badge A/B
cabecera compacta
cajas diferenciadas de tiempo y coste
resaltado automático del ganador
botones de elección con color identificativo
👨‍💻 Autor

Proyecto personal desarrollado por David.

Administrador de Sistemas e ingeniero informático, con foco en crear herramientas útiles, técnicas y prácticas para el día a día.

⚡ Nota final

CompaCarga R5 busca ser una herramienta rápida, clara y realista para comparar opciones de carga del Renault 5 E-Tech, manteniendo una experiencia cómoda tanto en móvil como en escritorio.

Renault 5 E-Tech · Ingeniería aplicada a la carga real
