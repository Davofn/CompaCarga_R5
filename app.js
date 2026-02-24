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

  function dcTimeCurve(powerInput){
    const maxPower = Math.min(powerInput, 100);

    const segments = [
      {min:0, max:20, power:95},
      {min:20, max:40, power:85},
      {min:40, max:60, power:70},
      {min:60, max:80, power:50},
      {min:80, max:90, power:35},
      {min:90, max:100, power:20},
    ];

    let totalSeconds = 0;

    segments.forEach(seg => {
      const start = Math.max(socStart, seg.min);
      const end = Math.min(socEnd, seg.max);

      if (end > start){
        const segmentSoc = (end - start) / 100;
        const segmentKwh = segmentSoc * battery;
        const realPower = Math.min(seg.power, maxPower);
        totalSeconds += (segmentKwh / realPower) * 3600;
      }
    });

    return totalSeconds;
  }

  function calculateCharger(power, price, costEl, timeEl){
    const cost = kwhToCharge * price;
    costEl.textContent = fmtEUR(cost);

    let timeSec;

    if (power <= 11){
      timeSec = power > 0 ? (kwhToCharge / power) * 3600 : NaN;
      document.getElementById("dcInfo").style.display = "none";
    } else {
      timeSec = dcTimeCurve(power);
      document.getElementById("dcInfo").style.display = "block";
    }

    timeEl.textContent = secondsToHMS(timeSec);
    return {cost, timeSec};
  }

  const aPower = Math.max(0, parseFloat($("aPower").value));
  const aPrice = Math.max(0, parseFloat($("aPrice").value));
  const a = calculateCharger(aPower, aPrice, $("aCost"), $("aTime"));

  const bPower = Math.max(0, parseFloat($("bPower").value));
  const bPrice = Math.max(0, parseFloat($("bPrice").value));
  const b = calculateCharger(bPower, bPrice, $("bCost"), $("bTime"));

  let winnerCost = "—";
  if (Number.isFinite(a.cost) && Number.isFinite(b.cost)){
    if (Math.abs(a.cost - b.cost) < 1e-9) winnerCost = "Empate";
    else winnerCost = a.cost < b.cost ? "Cargador A" : "Cargador B";
  }

  let winnerTime = "—";
  if (Number.isFinite(a.timeSec) && Number.isFinite(b.timeSec)){
    if (Math.abs(a.timeSec - b.timeSec) < 1e-6) winnerTime = "Empate";
    else winnerTime = a.timeSec < b.timeSec ? "Cargador A" : "Cargador B";
  }

  $("winnerCost").textContent = winnerCost;
  $("winnerTime").textContent = winnerTime;

  const diff = b.cost - a.cost;
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
