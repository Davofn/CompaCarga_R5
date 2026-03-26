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

  function calculateTime(power, start, end){

    if (power <= 0) return NaN;

    // 🔵 DC
    if (power > 11){

      const maxPower = Math.min(power, 100); // límite R5

      const curve = [
        { min:0,  max:20,  kw:95 },
        { min:20, max:40,  kw:85 },
        { min:40, max:60,  kw:70 },
        { min:60, max:80,  kw:50 },
        { min:80, max:90,  kw:35 },
        { min:90, max:100, kw:20 }
      ];

      let totalSeconds = 0;

      for (let tramo of curve){

        if (end <= tramo.min || start >= tramo.max) continue;

        const tramoStart = Math.max(start, tramo.min);
        const tramoEnd = Math.min(end, tramo.max);

        const socDelta = (tramoEnd - tramoStart) / 100;
        const kwhTramo = socDelta * battery;

        const effectivePower = Math.min(maxPower, tramo.kw);

        totalSeconds += (kwhTramo / effectivePower) * 3600;
      }

      return totalSeconds;
    }

    // 🟢 AC
    return (kwhToCharge / power) * 3600;
  }
  let selectedCharger = "A";
  // Charger A
  const aPower = Math.max(0, parseFloat($("aPower").value));
  const aPrice = Math.max(0, parseFloat($("aPrice").value));
  const aCost = kwhToCharge * aPrice;
  const aTimeSec = calculateTime(aPower, socStart, socEnd);

  $("aCost").textContent = fmtEUR(aCost);
  $("aTime").textContent = secondsToHMS(aTimeSec);

  // Charger B
  const bPower = Math.max(0, parseFloat($("bPower").value));
  const bPrice = Math.max(0, parseFloat($("bPrice").value));
  const bCost = kwhToCharge * bPrice;
  const bTimeSec = calculateTime(bPower, socStart, socEnd);

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
function setSelectedCharger(charger){
  selectedCharger = charger;

  const btnA = $("chooseA");
  const btnB = $("chooseB");
  const label = $("selectedChargerLabel");

  if (btnA) btnA.classList.remove("active");
  if (btnB) btnB.classList.remove("active");

  if (charger === "A" && btnA) btnA.classList.add("active");
  if (charger === "B" && btnB) btnB.classList.add("active");

  if (label){
    label.textContent = charger === "A" ? "Cargador A" : "Cargador B";
  }
}

function wire(){
  const ids = [
    "batteryKwh",
    "socStart",
    "socEnd",
    "aType",
    "aPower",
    "aPrice",
    "bType",
    "bPower",
    "bPrice"
  ];

  ids.forEach((id) => {
    const el = $(id);
    if (!el) return;
    el.addEventListener("input", compute);
    el.addEventListener("change", compute);
  });

  const btnA = $("chooseA");
  const btnB = $("chooseB");

  if (btnA){
    btnA.addEventListener("click", function(e){
      e.preventDefault();
      setSelectedCharger("A");
    });
  }

  if (btnB){
    btnB.addEventListener("click", function(e){
      e.preventDefault();
      setSelectedCharger("B");
    });
  }

  compute();
}
// PWA install (optional nice-to-have UI hook)
window.addEventListener("load", () => {
  wire();
  if ("serviceWorker" in navigator){
    navigator.serviceWorker.register("./service-worker.js").catch(()=>{});
  }
});


// ===== Histórico Nivel 1 (localStorage) =====
function getHistory(){ return JSON.parse(localStorage.getItem("compacarga_r5_history")||"[]"); }
function saveHistory(data){ localStorage.setItem("compacarga_r5_history",JSON.stringify(data)); }

function renderHistory(){
  const tbody=document.querySelector("#historyTable tbody");
  if(!tbody) return;
  tbody.innerHTML="";
  getHistory().forEach(e=>{
    const tr=document.createElement("tr");
    tr.innerHTML=`<td>${e.fecha}</td><td>${e.socInicio}-${e.socFinal}</td>
    <td>${e.kWh.toFixed(2)}</td><td>${e.potencia}</td>
    <td>${e.tiempo}</td><td>${e.coste.toFixed(2)}</td>`;
    tbody.appendChild(tr);
  });
}

function exportCSV(){
  const h=getHistory();
  if(!h.length) return;
  let csv="Fecha,SOC Inicio,SOC Final,kWh,kW,Tiempo,Coste\n";
  h.forEach(e=>{
    csv+=`${e.fecha},${e.socInicio},${e.socFinal},${e.kWh.toFixed(2)},${e.potencia},${e.tiempo},${e.coste.toFixed(2)}\n`;
  });
  const blob=new Blob([csv],{type:"text/csv"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url;a.download="historico_compacarga_r5.csv";a.click();
  URL.revokeObjectURL(url);
}

window.addEventListener("DOMContentLoaded", () => {
  wire();
  setSelectedCharger("A");
  renderHistory();
  initHistoryActions();

  if ("serviceWorker" in navigator){
    navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  }
});
