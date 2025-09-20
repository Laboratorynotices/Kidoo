import i18n from "@/i18n";
import type { AvailableLocale } from "@/i18n";
import { apiGet } from "./apiUtils";

// Константы API
const SEO_ENDPOINT = "seo";

// Типы
interface SeoItem {
  title: string;
  description: string;
  keywords: string;
}

interface SeoResponse {
  language: AvailableLocale;
  seo: SeoItem;
}

/**
 * Обновляет мета-тег или создает его, если не существует
 */
export const updateMetaTag = (name: string, content: string): void => {
  let metaTag = document.querySelector<HTMLMetaElement>(`meta[name='${name}']`);

  if (!metaTag) {
    metaTag = document.createElement("meta");
    metaTag.name = name;
    document.head.appendChild(metaTag);
  }

  metaTag.content = content;
};

/**
 * API функция для получения SEO данных
 */
export const fetchSeo = async (): Promise<SeoResponse> => {
  return apiGet<SeoResponse>(
    `${SEO_ENDPOINT}/${i18n.global.locale.value}.json`,
  );
};

/**
 * Обновляет SEO теги на основе API-ответа и актуальной локали в i18n
 * Вызывается при смене языка в i18n конфигурации
 */
export const updateSEO = async (): Promise<void> => {
  try {
    const data = await fetchSeo();

    // Заголовок страницы
    document.title = data.seo.title;

    // <meta name="description">
    updateMetaTag("description", data.seo.description);

    // <meta name="keywords">
    updateMetaTag("keywords", data.seo.keywords);

    // Установка языка в <html lang="">
    document.documentElement.setAttribute("lang", i18n.global.locale.value);
  } catch (error) {
    console.error("Failed to update SEO tags:", error);
  }
};
