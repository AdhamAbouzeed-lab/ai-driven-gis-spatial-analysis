import fs from 'fs';
import https from 'https';

console.log('🌍 Downloading real boundaries (please wait)...');
https.get('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json', (res) => {
  let rawData = '';
  res.on('data', (chunk) => { rawData += chunk; });
  res.on('end', () => {
    try {
      const world = JSON.parse(rawData);
      const latam = new Set(['Argentina','Bolivia','Brazil','Chile','Colombia','Costa Rica','Cuba','Dominican Republic','Ecuador','El Salvador','Guatemala','Guyana','Haiti','Honduras','Jamaica','Mexico','Nicaragua','Panama','Paraguay','Peru','Suriname','Trinidad and Tobago','Uruguay','Venezuela','Belize']);
      const wb = {
        'Argentina': {pop:45773884, gdp:641102, capital:'Buenos Aires', area:2780400},
        'Bolivia': {pop:12224670, gdp:45853, capital:'Sucre', area:1098581},
        'Brazil': {pop:216422446, gdp:2126811, capital:'Brasília', area:8515767},
        'Chile': {pop:19629590, gdp:337182, capital:'Santiago', area:756102},
        'Colombia': {pop:52085168, gdp:363165, capital:'Bogotá', area:1141748},
        'Costa Rica': {pop:5212173, gdp:75229, capital:'San José', area:51100},
        'Cuba': {pop:11194449, gdp:107351, capital:'Havana', area:109884},
        'Dominican Republic': {pop:11332972, gdp:121421, capital:'Santo Domingo', area:48671},
        'Ecuador': {pop:18190484, gdp:118880, capital:'Quito', area:283561},
        'El Salvador': {pop:6364943, gdp:34567, capital:'San Salvador', area:21041},
        'Guatemala': {pop:18092026, gdp:97386, capital:'Guatemala City', area:108889},
        'Guyana': {pop:813847, gdp:16688, capital:'Georgetown', area:214969},
        'Haiti': {pop:11724181, gdp:21159, capital:'Port-au-Prince', area:27750},
        'Honduras': {pop:10593798, gdp:34567, capital:'Tegucigalpa', area:112492},
        'Jamaica': {pop:2825544, gdp:20022, capital:'Kingston', area:10991},
        'Mexico': {pop:128900000, gdp:1788893, capital:'Mexico City', area:1964375},
        'Nicaragua': {pop:7046310, gdp:17367, capital:'Managua', area:130373},
        'Panama': {pop:4468087, gdp:78367, capital:'Panama City', area:75417},
        'Paraguay': {pop:6861524, gdp:42956, capital:'Asunción', area:406752},
        'Peru': {pop:34352719, gdp:267518, capital:'Lima', area:1285216},
        'Suriname': {pop:623236, gdp:4267, capital:'Paramaribo', area:163820},
        'Trinidad and Tobago': {pop:1534937, gdp:29608, capital:'Port of Spain', area:5130},
        'Uruguay': {pop:3423108, gdp:73723, capital:'Montevideo', area:176215},
        'Venezuela': {pop:28838499, gdp:102300, capital:'Caracas', area:916445},
        'Belize': {pop:410825, gdp:3237, capital:'Belmopan', area:22966}
      };
      const features = world.features.filter(f => latam.has(f.properties.name)).map(f => {
        const n = f.properties.name;
        const d = wb[n] || {};
        return {
          type: 'Feature',
          properties: {
            id: f.id || n.substring(0,3).toUpperCase(),
            name: n,
            pop_est: d.pop || 0,
            area_km2: d.area || 0,
            capital: d.capital || 'N/A',
            gdp_md_est: d.gdp || 0,
            pop_density: d.area ? Math.round(d.pop / d.area) : 0
          },
          geometry: f.geometry
        };
      });
      fs.writeFileSync('public/latamCountries.json', JSON.stringify({ type: 'FeatureCollection', metadata: { source: 'Natural Earth + World Bank 2023', countries: features.length }, features }, null, 2));
      console.log('✅ SUCCESS! Created real boundaries for ' + features.length + ' countries.');
      console.log('🚀 Now press Ctrl+Shift+R in your browser!');
    } catch (e) { console.error('❌ Error:', e.message); }
  });
}).on('error', e => console.error('❌ Download failed:', e.message));
