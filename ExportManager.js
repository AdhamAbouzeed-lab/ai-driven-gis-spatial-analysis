import { fetchDataset } from '../utils/cache.js';
import { CONFIG } from '../config.js';

export async function exportData(type) {
  const colData = await fetchDataset(CONFIG.DATA_URLS.colombia);
  const features = colData.features;

  switch (type) {
    case 'png':
      await exportPNG();
      break;
    case 'csv':
      exportCSV(features);
      break;
    case 'pdf':
      await exportPDF(features);
      break;
    case 'excel':
      await exportExcel(features);
      break;
  }
}

async function exportPNG() {
  const mapCanvas = document.querySelector('.maplibregl-canvas');
  if (!mapCanvas) return;
  const a = document.createElement('a');
  a.download = `gis-ai-map-${new Date().toISOString().slice(0, 10)}.png`;
  a.href = mapCanvas.toDataURL('image/png');
  a.click();
}

function exportCSV(features) {
  let csv = 'Region,Population,Area,Density,GDP_Capita,Total_GDP,DSI,Cluster,Tier\n';
  features.forEach(f => {
    const p = f.properties;
    csv += `${p.name},${p.population},${p.area},${p.density},${p.gdpCapita},${p.totalGdp},${p.dsi},${p.cluster},${p.tier}\n`;
  });
  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a');
  a.download = `gis-ai-data-${new Date().toISOString().slice(0, 10)}.csv`;
  a.href = URL.createObjectURL(blob);
  a.click();
  URL.revokeObjectURL(a.href);
}

async function exportPDF(features) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text('Latin America GIS-AI Report', 20, 25);
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 35);
  let y = 45;
  features.forEach(f => {
    const p = f.properties;
    if (y > 280) { doc.addPage(); y = 20; }
    doc.text(`${p.name}: DSI ${p.dsi}, GDP $${p.gdpCapita.toLocaleString()}, Pop ${(p.population / 1e6).toFixed(1)}M`, 20, y);
    y += 7;
  });
  doc.save(`gis-ai-report-${new Date().toISOString().slice(0, 10)}.pdf`);
}

async function exportExcel(features) {
  const XLSX = await import('xlsx');
  const data = features.map(f => ({
    Region: f.properties.name,
    Population: f.properties.population,
    Area_km2: f.properties.area,
    Density: f.properties.density,
    GDP_Capita: f.properties.gdpCapita,
    Total_GDP: f.properties.totalGdp,
    DSI: f.properties.dsi,
    Cluster: f.properties.cluster,
    Tier: f.properties.tier,
  }));
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Colombia');
  XLSX.writeFile(wb, `gis-ai-data-${new Date().toISOString().slice(0, 10)}.xlsx`);
}
