// Comparador (replica fórmulas de tu Excel v2)
const $ = (id) => document.getElementById(id);

function clamp(n, min, max){
  if (Number.isNaN(n)) return min;
  return Math.max(min, Math.min(max, n));
}

function fmtEUR(n){
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(n);
}

function fmtKwh(n){
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("es-ES", { maximumFractionDigits: 2 }).format(n) + " kWh";
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

// Excel:
// kWh_a_cargar = (%Final - %Inicial)/100 * Bateria_util
// Coste = kWh_a_cargar * Precio
// Tiempo_excel = IF(Potencia>0, (kWh_a_cargar/Potencia)/24, "")
// En web: tiempoSeg = (kWh_a_cargar/Potencia)*3600

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
  const aPower = Math.max(0, parseFloat($("aPower").value));
  const aPrice = Math.max(0, parseFloat($("aPrice").value));
  const aCost = kwhToCharge * aPrice;
  const aTimeSec = aPower > 0 ? (kwhToCharge / aPower) * 3600 : NaN;

  $("aCost").textContent = fmtEUR(aCost);
  $("aTime").textContent = secondsToHMS(aTimeSec);

  // Charger B
  const bPower = Math.max(0, parseFloat($("bPower").value));
  const bPrice = Math.max(0, parseFloat($("bPrice").value));
  const bCost = kwhToCharge * bPrice;
  const bTimeSec = bPower > 0 ? (kwhToCharge / bPower) * 3600 : NaN;

  $("bCost").textContent = fmtEUR(bCost);
  $("bTime").textContent = secondsToHMS(bTimeSec);

  // Winners
  let winnerCost = "—";
  if (Number.isFinite(aCost) && Number.isFinite(bCost)){
    if (Math.abs(aCost - bCost) < 1e-9) winnerCost = "Empate";
    else winnerCost = aCost < bCost ? "Cargador A" : "Cargador B";
  }

  let winnerTime = "—";
  if (Number.isFinite(aTimeSec) && Number.isFinite(bTimeSec)){
    if (Math.abs(aTimeSec - bTimeSec) < 1e-6) winnerTime = "Empate";
    else winnerTime = aTimeSec < bTimeSec ? "Cargador A" : "Cargador B";
  }

  $("winnerCost").textContent = winnerCost;
  $("winnerTime").textContent = winnerTime;

  const diff = bCost - aCost;
  $("diffCost").textContent = Number.isFinite(diff) ? fmtEUR(diff) : "—";
}

function wire(){
  const ids = ["batteryKwh","socStart","socEnd","aPower","aPrice","bPower","bPrice"];
  ids.forEach(id => $(id).addEventListener("input", compute));
  compute();
}

// PWA install (optional nice-to-have UI hook)
window.addEventListener("load", () => {
  wire();
  if ("serviceWorker" in navigator){
    navigator.serviceWorker.register("./service-worker.js").catch(()=>{});
  }
});
