import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
const resources = {
  en: {
    translation: {
      "ADHAM GIS AI": "ADHAM GIS AI",
      "Search countries, cities, regions...": "Search countries, cities, regions...",
      "Layers": "Layers",
      "Analytical": "Analytical",
      "Population Density": "Population Density",
      "GDP per Capita": "GDP per Capita",
      "DSI Score": "DSI Score",
      "ML Clusters": "ML Clusters",
      "Operational": "Operational",
      "Cities": "Cities",
      "Heatmap": "Heatmap",
      "Transport Corridors": "Transport Corridors",
      "Rivers": "Rivers",
      "Elevation Zones": "Elevation Zones",
      "Export": "Export",
      "Measure": "Measure",
      "Research": "Research",
      "Time Series": "Time Series",
      "Base Maps": "Base Maps",
      "Filters": "Filters",
      "AI Chat": "AI Chat",
      "Settings": "Settings",
      "Download Data": "Download Data",
      "Save Project": "Save Project",
      "Load Project": "Load Project"
    }
  },
  ar: {
    translation: {
      "ADHAM GIS AI": "نظام أدهم الجغرافي الذكي",
      "Search countries, cities, regions...": "ابحث عن دول، مدن، مناطق...",
      "Layers": "الطبقات",
      "Analytical": "تحليلية",
      "Population Density": "الكثافة السكانية",
      "GDP per Capita": "ناتج محلي للفرد",
      "DSI Score": "مؤشر التنمية",
      "ML Clusters": "التجميع الذكي",
      "Operational": "تشغيلية",
      "Cities": "المدن",
      "Heatmap": "الخريطة الحرارية",
      "Transport Corridors": "ممرات النقل",
      "Rivers": "الأنهار",
      "Elevation Zones": "مناطق الارتفاع",
      "Export": "تصدير",
      "Measure": "قياس",
      "Research": "أبحاث",
      "Time Series": "السلاسل الزمنية",
      "Base Maps": "الخرائط الأساسية",
      "Filters": "فلاتر",
      "AI Chat": "محادثة ذكية",
      "Settings": "إعدادات",
      "Download Data": "تحميل البيانات",
      "Save Project": "حفظ المشروع",
      "Load Project": "تحميل مشروع"
    }
  },
  es: {
    translation: {
      "ADHAM GIS AI": "ADHAM GIS AI",
      "Search countries, cities, regions...": "Buscar países, ciudades, regiones...",
      "Layers": "Capas",
      "Analytical": "Analítico",
      "Population Density": "Densidad Poblacional",
      "GDP per Capita": "PIB per Cápita",
      "DSI Score": "Índice DSI",
      "ML Clusters": "Agrupamiento ML",
      "Operational": "Operacional",
      "Cities": "Ciudades",
      "Heatmap": "Mapa de Calor",
      "Transport Corridors": "Corredores de Transporte",
      "Rivers": "Ríos",
      "Elevation Zones": "Zonas de Elevación",
      "Export": "Exportar",
      "Measure": "Medir",
      "Research": "Investigación",
      "Time Series": "Series Temporales",
      "Base Maps": "Mapas Base",
      "Filters": "Filtros",
      "AI Chat": "Chat IA",
      "Settings": "Configuración",
      "Download Data": "Descargar Datos",
      "Save Project": "Guardar Proyecto",
      "Load Project": "Cargar Proyecto"
    }
  }
};
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'ar', 'es'],
    interpolation: { escapeValue: false }
  });
export default i18n;
