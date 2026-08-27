const fs = require('fs');
const https = require('https');
console.log('Downloading...');
https.get('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json', (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    try {
      const w = JSON.parse(data);
      const names = ['Argentina','Bolivia','Brazil','Chile','Colombia','Costa Rica','Cuba','Dominican Republic','Ecuador','El Salvador','Guatemala','Guyana','Haiti','Honduras','Jamaica','Mexico','Nicaragua','Panama','Paraguay','Peru','Suriname','Trinidad and Tobago','Uruguay','Venezuela','Belize'];
      const wb = {'Argentina':{p:45773884,g:641102,c:'Buenos Aires',a:2780400},'Bolivia':{p:12224670,g:45853,c:'Sucre',a:1098581},'Brazil':{p:216422446,g:2126811,c:'Brasilia',a:8515767},'Chile':{p:19629590,g:337182,c:'Santiago',a:756102},'Colombia':{p:52085168,g:363165,c:'Bogota',a:1141748},'Costa Rica':{p:5212173,g:75229,c:'San Jose',a:51100},'Cuba':{p:11194449,g:107351,c:'Havana',a:109884},'Dominican Republic':{p:11332972,g:121421,c:'Santo Domingo',a:48671},'Ecuador':{p:18190484,g:118880,c:'Quito',a:283561},'El Salvador':{p:6364943,g:34567,c:'San Salvador',a:21041},'Guatemala':{p:18092026,g:97386,c:'Guatemala City',a:108889},'Guyana':{p:813847,g:16688,c:'Georgetown',a:214969},'Haiti':{p:11724181,g:21159,c:'Port-au-Prince',a:27750},'Honduras':{p:10593798,g:34567,c:'Tegucigalpa',a:112492},'Jamaica':{p:2825544,g:20022,c:'Kingston',a:10991},'Mexico':{p:128900000,g:1788893,c:'Mexico City',a:1964375},'Nicaragua':{p:7046310,g:17367,c:'Managua',a:130373},'Panama':{p:4468087,g:78367,c:'Panama City',a:75417},'Paraguay':{p:6861524,g:42956,c:'Asuncion',a:406752},'Peru':{p:34352719,g:267518,c:'Lima',a:1285216},'Suriname':{p:623236,g:4267,c:'Paramaribo',a:163820},'Trinidad and Tobago':{p:1534937,g:29608,c:'Port of Spain',a:5130},'Uruguay':{p:3423108,g:73723,c:'Montevideo',a:176215},'Venezuela':{p:28838499,g:102300,c:'Caracas',a:916445},'Belize':{p:410825,g:3237,c:'Belmopan',a:22966}};
      const feats = w.features.filter(f => names.includes(f.properties.name)).map(f => {
        const n = f.properties.name, d = wb[n] || {};
        return { type: 'Feature', properties: { id: f.id || n.substring(0,3).toUpperCase(), name: n, pop_est: d.p || 0, area_km2: d.a || 0, capital: d.c || 'N/A', gdp_md_est: d.g || 0, pop_density: d.a ? Math.round(d.p / d.a) : 0 }, geometry: f.geometry };
      });
      fs.writeFileSync('public/latamCountries.json', JSON.stringify({ type: 'FeatureCollection', metadata: { source: 'Natural Earth + World Bank 2023', countries: feats.length }, features: feats }, null, 2));
      console.log('SUCCESS: Created ' + feats.length + ' countries with REAL boundaries');
    } catch (e) { console.error('Error:', e.message); }
  });
}).on('error', e => console.error('Failed:', e.message));
