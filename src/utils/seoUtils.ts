import i18n from "@/i18n";

/**
 * Константы для ключей переводов SEO
 */
const SEO_KEYS = {
  TITLE: "seo.title",
  DESCRIPTION: "seo.description",
  KEYWORDS: "seo.keywords",
} as const;

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
 * Обновляет SEO теги на основе текущих переводов i18n
 * Вызывается при смене языка в i18n конфигурации
 */
export const updateSEO = (): void => {
  // Заголовок страницы
  document.title = i18n.global.t(SEO_KEYS.TITLE);

  // <meta name="description">
  updateMetaTag("description", i18n.global.t(SEO_KEYS.DESCRIPTION));

  // <meta name="keywords">
  updateMetaTag("keywords", i18n.global.t(SEO_KEYS.KEYWORDS));

  // Установка языка в <html lang="">
  document.documentElement.setAttribute("lang", i18n.global.locale.value);
};

/**
 * Обновляет SEO с кастомными ключами переводов
 * Полезно для страниц с индивидуальными SEO данными
 */
export const updateSEOWithKeys = (
  titleKey: string = SEO_KEYS.TITLE,
  descriptionKey: string = SEO_KEYS.DESCRIPTION,
  keywordsKey: string = SEO_KEYS.KEYWORDS,
): void => {
  document.title = i18n.global.t(titleKey);
  updateMetaTag("description", i18n.global.t(descriptionKey));
  updateMetaTag("keywords", i18n.global.t(keywordsKey));
  document.documentElement.setAttribute("lang", i18n.global.locale.value);
};
