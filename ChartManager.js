import { getDSIColor } from '../config.js';
import { fetchDataset } from '../utils/cache.js';
import { CONFIG } from '../config.js';

let chartLib = null;
const charts = {};
let observer = null;

export async function initChartManager() {
  const section = document.getElementById('charts-section');
  if (!section) return;

  if (!chartLib) {
    const mod = await import('chart.js/auto');
    chartLib = mod.default;
  }

  if (!observer) {
    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const type = entry.target.dataset.chart;
        if (entry.isIntersecting) {
          initChart(type);
        } else if (charts[type]) {
          charts[type].destroy();
          delete charts[type];
        }
      });
    }, { root: document.getElementById('sidebar-left'), threshold: 0.1 });
  }

  section.querySelectorAll('.chart-wrapper').forEach(w => observer.observe(w));
}

async function initChart(type) {
  if (charts[type] || !chartLib) return;

  const canvas = document.getElementById(`chart-${type}`);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const commonOpts = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 400, easing: 'easeOutQuart' },
    plugins: { legend: { display: false } },
    interaction: { mode: 'nearest', intersect: false },
  };

  const data = await fetchDataset(CONFIG.DATA_URLS.colombia);
  const features = data.features;

  if (type === 'dsi') {
    const bins = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    const hist = bins.slice(0, -1).map((b, i) =>
      features.filter(f => f.properties.dsi >= b && f.properties.dsi < bins[i + 1]).length
    );
    charts.dsi = new chartLib(ctx, {
      type: 'bar',
      data: {
        labels: bins.slice(0, -1).map(b => b + '-' + (b + 10)),
        datasets: [{
          data: hist,
          backgroundColor: bins.slice(0, -1).map(b => getDSIColor(b + 5)),
          borderRadius: 3,
          barPercentage: 0.8,
        }],
      },
      options: {
        ...commonOpts,
        scales: {
          x: { ticks: { font: { size: 8 }, maxRotation: 0 }, grid: { display: false } },
          y: { ticks: { font: { size: 8 } }, grid: { color: 'rgba(255,255,255,0.05)' } },
        },
      },
    });
  } else if (type === 'ranking') {
    const sorted = features.map(f => ({
      n: f.properties.name,
      dsi: f.properties.dsi,
    })).sort((a, b) => b.dsi - a.dsi);
    const top5 = sorted.slice(0, 5);
    const bot5 = sorted.slice(-5);
    charts.ranking = new chartLib(ctx, {
      type: 'bar',
      data: {
        labels: [...top5.map(d => d.n), ...bot5.map(d => d.n)],
        datasets: [{
          data: [...top5.map(d => d.dsi), ...bot5.map(d => d.dsi)],
          backgroundColor: [...top5.map(() => '#22c55e'), ...bot5.map(() => '#ef4444')],
          borderRadius: 3,
          barPercentage: 0.7,
        }],
      },
      options: {
        indexAxis: 'y',
        ...commonOpts,
        scales: {
          x: { ticks: { font: { size: 8 } }, grid: { color: 'rgba(255,255,255,0.05)' } },
          y: { ticks: { font: { size: 7 } }, grid: { display: false } },
        },
      },
    });
  } else if (type === 'scatter') {
    const pts = features.map(f => ({
      x: f.properties.gdpCapita,
      y: f.properties.dsi,
      n: f.properties.name,
    }));
    charts.scatter = new chartLib(ctx, {
      type: 'scatter',
      data: {
        datasets: [{
          data: pts,
          backgroundColor: pts.map(p => getDSIColor(p.y)),
          pointRadius: 4,
          pointHoverRadius: 6,
        }],
      },
      options: {
        ...commonOpts,
        plugins: {
          ...commonOpts.plugins,
          tooltip: {
            callbacks: {
              label: (c) => `${c.raw.n}: GDP $${c.raw.x.toLocaleString()}, DSI ${c.raw.y}`,
            },
          },
        },
        scales: {
          x: {
            title: { display: true, text: 'GDP per capita', font: { size: 8 } },
            ticks: { font: { size: 8 } },
            grid: { color: 'rgba(255,255,255,0.05)' },
          },
          y: {
            title: { display: true, text: 'DSI', font: { size: 8 } },
            ticks: { font: { size: 8 } },
            grid: { color: 'rgba(255,255,255,0.05)' },
          },
        },
      },
    });
  }
}
