const cities = [
  { name: 'São Paulo', country: 'BRA', population: 12330000, lat: -23.55, lng: -46.63 },
  { name: 'Buenos Aires', country: 'ARG', population: 15370000, lat: -34.60, lng: -58.38 },
  { name: 'Lima', country: 'PER', population: 10720000, lat: -12.05, lng: -77.04 },
  { name: 'Bogotá', country: 'COL', population: 11340000, lat: 4.71, lng: -74.07 },
  { name: 'Santiago', country: 'CHL', population: 7000000, lat: -33.45, lng: -70.67 },
  { name: 'Mexico City', country: 'MEX', population: 21800000, lat: 19.43, lng: -99.13 },
  { name: 'Rio de Janeiro', country: 'BRA', population: 13530000, lat: -22.91, lng: -43.17 },
  { name: 'Brasília', country: 'BRA', population: 4800000, lat: -15.79, lng: -47.88 },
  { name: 'Caracas', country: 'VEN', population: 2935000, lat: 10.48, lng: -66.90 },
  { name: 'Quito', country: 'ECU', population: 2780000, lat: -0.18, lng: -78.47 },
  { name: 'Medellín', country: 'COL', population: 4000000, lat: 6.25, lng: -75.56 },
  { name: 'Córdoba', country: 'ARG', population: 1570000, lat: -31.42, lng: -64.18 },
  { name: 'Guadalajara', country: 'MEX', population: 5270000, lat: 20.67, lng: -103.35 },
  { name: 'Monterrey', country: 'MEX', population: 5340000, lat: 25.68, lng: -100.31 },
  { name: 'Recife', country: 'BRA', population: 4130000, lat: -8.05, lng: -34.87 }
];

const regions = [
  { name: 'Antioquia', country: 'COL', population: 6670000 },
  { name: 'São Paulo', country: 'BRA', population: 46300000 },
  { name: 'Buenos Aires', country: 'ARG', population: 17800000 },
  { name: 'Meta', country: 'COL', population: 1050000 },
  { name: 'Jalisco', country: 'MEX', population: 8350000 },
  { name: 'Minas Gerais', country: 'BRA', population: 21300000 },
  { name: 'Valle del Cauca', country: 'COL', population: 4600000 },
  { name: 'Rio Grande do Sul', country: 'BRA', population: 11420000 }
];

export const searchData = [...cities.map(c => ({ id: `city-${c.name.toLowerCase().replace(/\s+/g, '-')}`, name: c.name, type: 'city', country: c.country, data: { population: c.population }, coordinates: [c.lng, c.lat] })), ...regions.map(r => ({ id: `region-${r.name.toLowerCase().replace(/\s+/g, '-')}`, name: r.name, type: 'region', country: r.country, data: { population: r.population } }))];

export const searchLocations = (query) => {
  if (!query || query.trim() === '') return [];
  const q = query.toLowerCase().trim();
  return searchData.filter(item => item.name.toLowerCase().includes(q) || item.id.toLowerCase().includes(q)).slice(0, 10);
};

export default searchData;
