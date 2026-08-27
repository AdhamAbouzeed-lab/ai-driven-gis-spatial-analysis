import i18n from "i18next";
import { initReactI18next } from "react-i18next";
const resources = {
  en: {
    translation: {
      brand: "ADHAM GIS AI",
      hero: "Understand the World Through Spatial Intelligence.",
      exploreMap: "Explore the Map",
      askAI: "Ask AI",
      createProject: "Create Project",
      exploreData: "Explore Data",
      workspace: "Workspace",
      content: "Content",
      explore: "Explore",
      develop: "Develop",
      organization: "Organization",
      map: "Map",
      data: "Data",
      analysis: "Analysis",
      workflows: "Workflows",
      aiLab: "AI Lab",
      projects: "Projects",
      dashboards: "Dashboards",
      reports: "Reports",
      compare: "Compare",
      settings: "Settings",
      team: "Team",
      developer: "Developer"
    }
  },
  ar: {
    translation: {
      brand: "ADHAM GIS AI",
      hero: "افهم العالم من خلال الذكاء المكاني.",
      exploreMap: "استكشف الخريطة",
      askAI: "اسأل الذكاء الاصطناعي",
      createProject: "إنشاء مشروع",
      exploreData: "استكشف البيانات",
      workspace: "مساحة العمل",
      content: "المحتوى",
      explore: "استكشاف",
      develop: "التطوير",
      organization: "المؤسسة",
      map: "الخريطة",
      data: "البيانات",
      analysis: "التحليل",
      workflows: "سير العمل",
      aiLab: "مختبر الذكاء الاصطناعي",
      projects: "المشروعات",
      dashboards: "لوحات المعلومات",
      reports: "التقارير",
      compare: "مقارنة",
      settings: "الإعدادات",
      team: "الفريق",
      developer: "المطور"
    }
  },
  es: {
    translation: {
      brand: "ADHAM GIS AI",
      hero: "Comprende el mundo mediante inteligencia espacial.",
      exploreMap: "Explorar el mapa",
      askAI: "Preguntar a la IA",
      createProject: "Crear proyecto",
      exploreData: "Explorar datos",
      workspace: "Espacio de trabajo",
      content: "Contenido",
      explore: "Explorar",
      develop: "Desarrollar",
      organization: "Organización",
      map: "Mapa",
      data: "Datos",
      analysis: "Análisis",
      workflows: "Flujos de trabajo",
      aiLab: "Laboratorio IA",
      projects: "Proyectos",
      dashboards: "Paneles",
      reports: "Informes",
      compare: "Comparar",
      settings: "Configuración",
      team: "Equipo",
      developer: "Desarrollador"
    }
  }
};
i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("adham.language") || "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false }
});
export function setLanguage(language) {
  localStorage.setItem("adham.language", language);
  i18n.changeLanguage(language);
  document.documentElement.lang = language;
  document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
}
setLanguage(i18n.language);
export default i18n;
