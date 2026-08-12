const TRANSLATIONS = {
  es: {
    live: 'EN VIVO', population: 'Población', departments: 'Deptos', accuracy: 'Precisión',
    search_placeholder: 'Buscar región, país, ciudad...', layers: 'Capas', data_layers: 'Capas de Datos',
    dsi_layer: 'Índice DSI', gdp_layer: 'PIB per cápita', pop_layer: 'Densidad Poblacional',
    cluster_layer: 'Clusters K-Means', basemaps: 'Mapas Base', streets: 'Calles', satellite: 'Satélite',
    terrain: 'Terreno', dark: 'Oscuro', analytics: 'Análisis', dsi_distribution: 'Distribución DSI',
    top_bottom: 'Top / Bottom 5', gdp_correlation: 'PIB vs DSI', export: 'Exportar', details: 'Detalles',
    select_region: 'Selecciona una región en el mapa',
    ai_welcome: '¡Hola! Soy tu asistente GIS-AI. Puedo analizar datos de desarrollo, predecir tendencias hasta 2050, o responder preguntas sobre cualquier región de América Latina. ¿En qué puedo ayudarte?',
    ask_placeholder: 'Pregunta algo sobre desarrollo, PIB, población...', mobile_analytics: 'Análisis Rápido',
    loading: 'Cargando datos espaciales...', region: 'Región', capital: 'Capital', area: 'Área',
    density: 'Densidad', gdp_capita: 'PIB per cápita', total_gdp: 'PIB Total', growth: 'Crecimiento',
    dsi_score: 'Puntuación DSI', tier: 'Nivel', cluster: 'Cluster', high: 'Alto', medium: 'Medio', low: 'Bajo',
    close: 'Cerrar', compare: 'Comparar', forecast_2030: 'Pronóstico 2030', forecast_2040: 'Pronóstico 2040',
    forecast_2050: 'Pronóstico 2050', what_if: 'Análisis What-if', anomaly: 'Detección de anomalías',
    report: 'Generar informe', countries: 'Países', country: 'País', continent: 'América Latina'
  },
  en: {
    live: 'LIVE', population: 'Population', departments: 'Depts', accuracy: 'Accuracy',
    search_placeholder: 'Search region, country, city...', layers: 'Layers', data_layers: 'Data Layers',
    dsi_layer: 'DSI Index', gdp_layer: 'GDP per capita', pop_layer: 'Population Density',
    cluster_layer: 'K-Means Clusters', basemaps: 'Basemaps', streets: 'Streets', satellite: 'Satellite',
    terrain: 'Terrain', dark: 'Dark', analytics: 'Analytics', dsi_distribution: 'DSI Distribution',
    top_bottom: 'Top / Bottom 5', gdp_correlation: 'GDP vs DSI', export: 'Export', details: 'Details',
    select_region: 'Select a region on the map',
    ai_welcome: 'Hello! I am your GIS-AI assistant. I can analyze development data, predict trends up to 2050, or answer questions about any region in Latin America. How can I help you?',
    ask_placeholder: 'Ask about development, GDP, population...', mobile_analytics: 'Quick Analytics',
    loading: 'Loading spatial data...', region: 'Region', capital: 'Capital', area: 'Area',
    density: 'Density', gdp_capita: 'GDP per capita', total_gdp: 'Total GDP', growth: 'Growth',
    dsi_score: 'DSI Score', tier: 'Tier', cluster: 'Cluster', high: 'High', medium: 'Medium', low: 'Low',
    close: 'Close', compare: 'Compare', forecast_2030: '2030 Forecast', forecast_2040: '2040 Forecast',
    forecast_2050: '2050 Forecast', what_if: 'What-if Analysis', anomaly: 'Anomaly Detection',
    report: 'Generate Report', countries: 'Countries', country: 'Country', continent: 'Latin America'
  },
  pt: {
    live: 'AO VIVO', population: 'População', departments: 'Deptos', accuracy: 'Precisão',
    search_placeholder: 'Pesquisar região, país, cidade...', layers: 'Camadas', data_layers: 'Camadas de Dados',
    dsi_layer: 'Índice DSI', gdp_layer: 'PIB per capita', pop_layer: 'Densidade Populacional',
    cluster_layer: 'Clusters K-Means', basemaps: 'Mapas Base', streets: 'Ruas', satellite: 'Satélite',
    terrain: 'Terreno', dark: 'Escuro', analytics: 'Análise', dsi_distribution: 'Distribuição DSI',
    top_bottom: 'Top / Bottom 5', gdp_correlation: 'PIB vs DSI', export: 'Exportar', details: 'Detalhes',
    select_region: 'Selecione uma região no mapa',
    ai_welcome: 'Olá! Sou seu assistente GIS-AI. Posso analisar dados de desenvolvimento, prever tendências até 2050, ou responder perguntas sobre qualquer região da América Latina. Como posso ajudar?',
    ask_placeholder: 'Pergunte sobre desenvolvimento, PIB, população...', mobile_analytics: 'Análise Rápida',
    loading: 'Carregando dados espaciais...', region: 'Região', capital: 'Capital', area: 'Área',
    density: 'Densidade', gdp_capita: 'PIB per capita', total_gdp: 'PIB Total', growth: 'Crescimento',
    dsi_score: 'Pontuação DSI', tier: 'Nível', cluster: 'Cluster', high: 'Alto', medium: 'Médio', low: 'Baixo',
    close: 'Fechar', compare: 'Comparar', forecast_2030: 'Previsão 2030', forecast_2040: 'Previsão 2040',
    forecast_2050: 'Previsão 2050', what_if: 'Análise What-if', anomaly: 'Detecção de anomalias',
    report: 'Gerar relatório', countries: 'Países', country: 'País', continent: 'América Latina'
  },
  fr: {
    live: 'EN DIRECT', population: 'Population', departments: 'Dépts', accuracy: 'Précision',
    search_placeholder: 'Rechercher région, pays, ville...', layers: 'Couches', data_layers: 'Couches de Données',
    dsi_layer: 'Indice DSI', gdp_layer: 'PIB par habitant', pop_layer: 'Densité de Population',
    cluster_layer: 'Clusters K-Means', basemaps: 'Fonds de Carte', streets: 'Rues', satellite: 'Satellite',
    terrain: 'Terrain', dark: 'Sombre', analytics: 'Analytique', dsi_distribution: 'Distribution DSI',
    top_bottom: 'Top / Bottom 5', gdp_correlation: 'PIB vs DSI', export: 'Exporter', details: 'Détails',
    select_region: 'Sélectionnez une région sur la carte',
    ai_welcome: "Bonjour! Je suis votre assistant GIS-AI. Je peux analyser des données de développement, prédire des tendances jusqu'en 2050, ou répondre à des questions sur n'importe quelle région d'Amérique latine. Comment puis-je vous aider?",
    ask_placeholder: 'Demandez le développement, PIB, population...', mobile_analytics: 'Analyse Rapide',
    loading: 'Chargement des données spatiales...', region: 'Région', capital: 'Capitale', area: 'Superficie',
    density: 'Densité', gdp_capita: 'PIB par habitant', total_gdp: 'PIB Total', growth: 'Croissance',
    dsi_score: 'Score DSI', tier: 'Niveau', cluster: 'Cluster', high: 'Élevé', medium: 'Moyen', low: 'Faible',
    close: 'Fermer', compare: 'Comparer', forecast_2030: 'Prévision 2030', forecast_2040: 'Prévision 2040',
    forecast_2050: 'Prévision 2050', what_if: 'Analyse What-if', anomaly: "Détection d'anomalies",
    report: 'Générer rapport', countries: 'Pays', country: 'Pays', continent: 'Amérique latine'
  }
};

let currentLang = 'es';

export function setLang(lang) {
  if (!TRANSLATIONS[lang]) return;
  currentLang = lang;
  updateDOM();
}

export function getLang() {
  return currentLang;
}

export function t(key) {
  return TRANSLATIONS[currentLang]?.[key] ?? TRANSLATIONS.en?.[key] ?? key;
}

function updateDOM() {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const k = el.getAttribute('data-i18n');
    const val = t(k);
    if (val) el.textContent = val;
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const k = el.getAttribute('data-i18n-placeholder');
    const val = t(k);
    if (val) el.placeholder = val;
  });
  const langBtn = document.getElementById('btn-lang');
  if (langBtn) langBtn.textContent = currentLang.toUpperCase();
}

export function initI18n() {
  updateDOM();
}
