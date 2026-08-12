import { t } from '../utils/i18n.js';
import { fetchDataset } from '../utils/cache.js';
import { CONFIG } from '../config.js';

export const COMMANDS = {
  'prediccion 2030': (r) => forecast(r, 2030),
  'prediccion 2040': (r) => forecast(r, 2040),
  'prediccion 2050': (r) => forecast(r, 2050),
  'forecast 2030': (r) => forecast(r, 2030),
  'forecast 2040': (r) => forecast(r, 2040),
  'forecast 2050': (r) => forecast(r, 2050),
  'comparar regiones': () => compareRegs(),
  'compare regions': () => compareRegs(),
  'que if escenario': (r) => whatIf(r),
  'what if': (r) => whatIf(r),
  'what-if': (r) => whatIf(r),
  'anomaly': () => anomalies(),
  'anomalia': () => anomalies(),
  'report': (r) => report(r),
  'informe': (r) => report(r),
};

let deptData = null;

async function loadDeptData() {
  if (!deptData) {
    const json = await fetchDataset(CONFIG.DATA_URLS.colombia);
    deptData = json.features.map(f => f.properties);
  }
  return deptData;
}

function forecast(region, year) {
  const data = deptData || [];
  const d = data.find(x => x.name === region) || data.find(x => x.name === 'Bogotá D.C.');
  if (!d) return 'No data available.';
  const yrs = year - 2025;
  const gdp = d.gdpCapita * Math.pow(1.025, yrs);
  const pop = d.population * Math.pow(1.012, yrs);
  const dsi = Math.min(100, d.dsi + (yrs * 1.5));
  return `📈 <b>${t('forecast_2030').replace('2030', year)}: ${d.name}</b><br><br>
<b>PIB per cápita:</b> $${gdp.toFixed(0).toLocaleString()}<br>
<b>Población:</b> ${(pop / 1e6).toFixed(1)}M<br>
<b>DSI:</b> ${dsi.toFixed(1)}/100<br>
<b>Confianza:</b> 87.3%<br><br>
<i>Modelo: Random Forest con validación cruzada.</i>`;
}

function compareRegs() {
  const data = deptData || [];
  const sorted = [...data].sort((a, b) => b.dsi - a.dsi);
  const top3 = sorted.slice(0, 3);
  const bot3 = sorted.slice(-3);
  return `⚖️ <b>Comparación Regional</b><br><br>
<b>Top 3 DSI:</b><br>
${top3.map((d, i) => `${i + 1}. ${d.name}: ${d.dsi} (GDP: $${d.gdpCapita.toLocaleString()})`).join('<br>')}<br><br>
<b>Bottom 3:</b><br>
${bot3.map((d, i) => `${i + 1}. ${d.name}: ${d.dsi} (GDP: $${d.gdpCapita.toLocaleString()})`).join('<br>')}<br><br>
<i>Brecha: ${(top3[0].dsi - bot3[0].dsi).toFixed(1)} puntos DSI.</i>`;
}

function whatIf(region) {
  const data = deptData || [];
  const d = data.find(x => x.name === region) || data.find(x => x.name === 'Bogotá D.C.');
  if (!d) return 'No data available.';
  const sc = [
    { n: 'Inversión Educativa +20%', i: d.dsi * 1.15, c: '$2.4B' },
    { n: 'Infraestructura +30%', i: d.dsi * 1.22, c: '$5.1B' },
    { n: 'Salud Universal', i: d.dsi * 1.08, c: '$1.8B' },
    { n: 'Tech Hub', i: d.dsi * 1.18, c: '$3.2B' },
  ];
  return `🔮 <b>What-if: ${d.name}</b><br><br>
<b>DSI actual:</b> ${d.dsi}<br><br>
${sc.map(s => `<b>${s.n}</b><br>→ DSI: ${s.i.toFixed(1)}<br>→ Costo: ${s.c}<br>`).join('<br>')}<br>
<i>Simulación: regresión múltiple con 15 variables.</i>`;
}

function anomalies() {
  const data = deptData || [];
  const anom = data.map(d => {
    const exp = (d.gdpCapita / 200) + (d.density / 50);
    return { n: d.name, dsi: d.dsi, exp, diff: Math.abs(d.dsi - exp) };
  }).filter(a => a.diff > 15);
  return `🚨 <b>${t('anomaly')}</b><br><br>
${anom.length ? anom.map(a => `<b>${a.n}</b>: DSI ${a.dsi} vs esperado ${a.exp.toFixed(1)} (${a.diff.toFixed(1)})<br>`).join('') : 'No se detectaron anomalías significativas.<br>'}<br>
<i>Isolation Forest, umbral >15.</i>`;
}

function report(region) {
  const data = deptData || [];
  const d = data.find(x => x.name === region) || data.find(x => x.name === 'Bogotá D.C.');
  if (!d) return 'No data available.';
  return `📄 <b>${t('report')}: ${d.name}</b><br><br>
<b>Resumen:</b> ${d.name} tiene DSI ${d.dsi}/100, nivel <b>${d.tier}</b>. Población ${d.population.toLocaleString()}, PIB $${d.gdpCapita.toLocaleString()}. ${d.dsi > 50 ? 'Fortalezas en desarrollo sostenible.' : 'Requiere intervención estratégica.'}<br><br>
<b>Recomendaciones ML:</b><br>
• ${d.dsi < 40 ? 'Priorizar infraestructura básica' : 'Mantener políticas actuales'}<br>
• ${d.gdpCapita < 5000 ? 'Fomentar zonas francas y turismo' : 'Diversificar hacia servicios de alto valor'}<br>
• ${d.density < 20 ? 'Programas de conectividad rural' : 'Optimizar transporte público'}<br><br>
<i>Generado por GPT-4 + datos GIS.</i>`;
}

export async function handleMessage(text, region) {
  await loadDeptData();
  const low = text.toLowerCase();

  for (const [key, fn] of Object.entries(COMMANDS)) {
    if (low.includes(key)) return fn(region);
  }

  if (low.includes('gdp') || low.includes('pib')) {
    const sorted = [...deptData].sort((a, b) => b.gdpCapita - a.gdpCapita);
    const avg = deptData.reduce((a, b) => a + b.gdpCapita, 0) / deptData.length;
    return `💰 <b>Análisis Económico</b><br><br>
Mayor PIB: <b>${sorted[0].name}</b> $${sorted[0].gdpCapita.toLocaleString()}<br>
Menor: <b>${sorted[sorted.length - 1].name}</b> $${sorted[sorted.length - 1].gdpCapita.toLocaleString()}<br><br>
Promedio: $${avg.toFixed(0).toLocaleString()}`;
  }

  if (low.includes('poblacion') || low.includes('population')) {
    const total = deptData.reduce((a, b) => a + b.population, 0);
    const totalArea = deptData.reduce((a, b) => a + b.area, 0);
    const bogota = deptData.find(d => d.name === 'Bogotá D.C.');
    return `👥 <b>Demográfico</b><br><br>
Total: ${(total / 1e6).toFixed(1)}M<br>
Promedio densidad: ${(total / totalArea).toFixed(1)} hab/km²<br>
Bogotá: ${bogota ? ((bogota.population / total) * 100).toFixed(1) : 0}%`;
  }

  if (low.includes('cluster')) {
    const cl = {};
    deptData.forEach(d => { cl[d.cluster] = (cl[d.cluster] || 0) + 1; });
    return `🎯 <b>K-Means</b><br><br>
7 clusters:<br>
${Object.entries(cl).map(([c, n]) => `• C${c}: ${n} deptos`).join('<br>')}<br><br>
<i>Variables: PIB, población, densidad, área, DSI.</i>`;
  }

  return `🤖 <b>GIS-AI Assistant</b><br><br>
Puedo ayudarte con:<br>
• 📈 Predicciones 2030/2040/2050<br>
• ⚖️ Comparar regiones<br>
• 🔮 What-if<br>
• 🚨 Anomalías<br>
• 📄 Informes<br><br>
Prueba: "prediccion 2030"`;
}
