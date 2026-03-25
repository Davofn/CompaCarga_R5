// Comparador de cargadores R5
const $ = (id) => document.getElementById(id);

function clamp(n, min, max){
  if (Number.isNaN(n)) return min;
  return Math.max(min, Math.min(max, n));
}

function fmtEUR(n){
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR"
  }).format(n);
}

function fmtKwh(n){
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("es-ES", {
    maximumFractionDigits: 2
  }).format(n) + " kWh";
}

function fmtKw(n){
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("es-ES", {
    maximumFractionDigits: 1
  }).format(n) + " kW";
}

function secondsToHMS(totalSeconds){
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return "—";
  const s = Math.round(totalSeconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (x) => String(x).padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(sec)}`;
}

function getDcCurve(){
  return [
    { min: 0,  max: 20,  kw: 95 },
    { min: 20, max: 40,  kw: 85 },
    { min: 40, max: 60,  kw: 70 },
    { min: 60, max: 80,  kw: 50 },
    { min: 80, max: 90,  kw: 35 },
    { min: 90, max: 100, kw: 20 }
  ];
}

function calculateCharge(type, power, start, end, battery){
  if (!Number.isFinite(power) || power <= 0) {
    return {
      timeSec: NaN,
      appliedPower: NaN,
      info: "Potencia no válida"
    };
  }

  const deltaSoc = (end - start) / 100;
  const kwhToCharge = Math.max(0, deltaSoc * battery);

  if (type === "ac"){
    const appliedPower = Math.min(power, 11);
    const timeSec = appliedPower > 0 ? (kwhToCharge / appliedPower) * 3600 : NaN;

    return {
      timeSec,
      appliedPower,
      info: power > 11 ? "AC limitado a 11 kW" : "AC sin limitación adicional"
    };
  }

  // DC
  const dcPowerCap = Math.min(power, 100);
  const curve = getDcCurve();

  let totalSeconds = 0;

  for (const tramo of curve){
    if (end <= tramo.min || start >= tramo.max) continue;

    const tramoStart = Math.max(start, tramo.min);
    const tramoEnd = Math.min(end, tramo.max);
    const socDelta = (tramoEnd - tramoStart) / 100;
    const kwhTramo = socDelta * battery;
    const effectivePower = Math.min(dcPowerCap, tramo.kw);

    totalSeconds += (kwhTramo / effectivePower) * 3600;
  }

  return {
    timeSec: totalSeconds,
    appliedPower: dcPowerCap,
    info: power > 100 ? "DC limitado a 100 kW + curva R5" : "DC con curva R5"
  };
}

function compute(){
  const battery = Math.max(0, parseFloat($("batteryKwh").value));
  const socStart = clamp(parseFloat($("socStart").value), 0, 100);
  const socEnd = clamp(parseFloat($("socEnd").value), 0, 100);

  $("socStart").value = socStart;
  $("socEnd").value = socEnd;

  const deltaSoc = (socEnd - socStart) / 100;
  const kwhToCharge = Math.max(0, deltaSoc * battery);

  $("kwhToCharge").textContent = fmtKwh(kwhToCharge);

  // Charger A
  const aType = $("aType").value;
  const aPower = Math.max(0, parseFloat($("aPower").value));
  const aPrice = Math.max(0, parseFloat($("aPrice").value));
  const aCost = kwhToCharge * aPrice;
  const aCalc = calculateCharge(aType, aPower, socStart, socEnd, battery);

  $("aCost").textContent = fmtEUR(aCost);
  $("aTime").textContent = secondsToHMS(aCalc.timeSec);
  $("aAppliedPower").textContent = fmtKw(aCalc.appliedPower);
  $("aInfo").textContent = aCalc.info;

  // Charger B
  const bType = $("bType").value;
  const bPower = Math.max(0, parseFloat($("bPower").value));
  const bPrice = Math.max(0, parseFloat($("bPrice").value));
  const bCost = kwhToCharge * bPrice;
  const bCalc = calculateCharge(bType, bPower, socStart, socEnd, battery);

  $("bCost").textContent = fmtEUR(bCost);
  $("bTime").textContent = secondsToHMS(bCalc.timeSec);
  $("bAppliedPower").textContent = fmtKw(bCalc.appliedPower);
  $("bInfo").textContent = bCalc.info;

  // Winners
  let winnerCost = "—";
  if (Number.isFinite(aCost) && Number.isFinite(bCost)){
    if (Math.abs(aCost - bCost) < 1e-9) {
      winnerCost = "Empate";
    } else {
      winnerCost = aCost < bCost ? "🏆 Cargador A" : "🏆 Cargador B";
    }
  }

  let winnerTime = "—";
  if (Number.isFinite(aCalc.timeSec) && Number.isFinite(bCalc.timeSec)){
    if (Math.abs(aCalc.timeSec - bCalc.timeSec) < 1e-6) {
      winnerTime = "Empate";
    } else {
      winnerTime = aCalc.timeSec < bCalc.timeSec ? "⚡ Cargador A" : "⚡ Cargador B";
    }
  }

  $("winnerCost").textContent = winnerCost;
  $("winnerTime").textContent = winnerTime;

  const diff = bCost - aCost;
  $("diffCost").textContent = Number.isFinite(diff) ? fmtEUR(diff) : "—";
}

function wire(){
  const ids = [
    "batteryKwh","socStart","socEnd",
    "aType","aPower","aPrice",
    "bType","bPower","bPrice"
  ];

  ids.forEach(id => {
    const el = $(id);
    if (!el) return;
    el.addEventListener("input", compute);
    el.addEventListener("change", compute);
  });

  compute();
}

// ===== Histórico local =====
function getHistory(){
  return JSON.parse(localStorage.getItem("compacarga_r5_history") || "[]");
}

function saveHistory(data){
  localStorage.setItem("compacarga_r5_history", JSON.stringify(data));
}

function renderHistory(){
  const tbody = document.querySelector("#historyTable tbody");
  if (!tbody) return;

  tbody.innerHTML = "";

  getHistory().forEach(e => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${e.fecha}</td>
      <td>${e.tipo || "—"}</td>
      <td>${e.socInicio}-${e.socFinal}</td>
      <td>${e.kWh.toFixed(2)}</td>
      <td>${typeof e.potencia === "number" ? e.potencia.toFixed(1) : e.potencia}</td>
      <td>${e.tiempo}</td>
      <td>${e.coste.toFixed(2)}</td>
    `;
    tbody.appendChild(tr);
  });
}

function exportCSV(){
  const h = getHistory();
  if (!h.length) return;

  let csv = "Fecha,Tipo,SOC Inicio,SOC Final,kWh,kW,Tiempo,Coste\n";

  h.forEach(e => {
    csv += `${e.fecha},${e.tipo || ""},${e.socInicio},${e.socFinal},${e.kWh.toFixed(2)},${typeof e.potencia === "number" ? e.potencia.toFixed(1) : e.potencia},${e.tiempo},${e.coste.toFixed(2)}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "historico_compacarga_r5.csv";
  a.click();
  URL.revokeObjectURL(url);
}

document.addEventListener("DOMContentLoaded", () => {
  renderHistory();

  document.getElementById("saveCharge")?.addEventListener("click", () => {
    const battery = parseFloat(document.getElementById("batteryKwh").value);
    const socStart = parseFloat(document.getElementById("socStart").value);
    const socEnd = parseFloat(document.getElementById("socEnd").value);

    const kWh = ((socEnd - socStart) / 100) * battery;

    // Mantengo el guardado usando el cargador A, como en tu versión actual
    const type = document.getElementById("aType").value;
    const rawPower = parseFloat(document.getElementById("aPower").value);
    const price = parseFloat(document.getElementById("aPrice").value);

    const calc = calculateCharge(type, rawPower, socStart, socEnd, battery);
    const cost = kWh * price;
    const tiempo = document.getElementById("aTime").textContent;

    const h = getHistory();
    h.push({
      fecha: new Date().toLocaleString(),
      tipo: type === "ac" ? "AC" : "DC",
      socInicio: socStart,
      socFinal: socEnd,
      kWh: kWh,
      potencia: calc.appliedPower,
      tiempo: tiempo,
      coste: cost
    });

    saveHistory(h);
    renderHistory();
  });

  document.getElementById("clearHistory")?.addEventListener("click", () => {
    localStorage.removeItem("compacarga_r5_history");
    renderHistory();
  });

  document.getElementById("exportCSV")?.addEventListener("click", exportCSV);
});

// ===== Init + PWA =====
window.addEventListener("load", () => {
  wire();
  if ("serviceWorker" in navigator){
    navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  }
});
