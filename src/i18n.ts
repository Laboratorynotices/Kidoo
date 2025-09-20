import { createI18n } from "vue-i18n";
import { updateSEO } from "@/utils/seoUtils";

/**
 * Массив поддерживаемых языковых локалей в приложении
 * - "de" - немецкий
 * - "ru" - русский
 * - "en" - английский
 *
 * Используется `as const` для создания readonly tuple типа,
 * что позволяет TypeScript точно знать все возможные значения
 */
export const SUPPORT_LOCALES = ["de", "ru", "en"] as const;

/**
 * Тип для доступных локалей, извлекаемый из массива SUPPORT_LOCALES
 * Это union тип: "de" | "ru" | "en"
 * Обеспечивает типобезопасность при работе с локалями
 */
export type AvailableLocale = (typeof SUPPORT_LOCALES)[number];

/**
 * Локаль по умолчанию для приложения
 * Установлена немецкая локаль как основная
 */
export const DEFAULT_LOCALE: AvailableLocale = "de";

/**
 * Создание экземпляра Vue I18n для интернационализации
 *
 * Конфигурация:
 * - legacy: false - использует Composition API вместо старого API
 * - locale: DEFAULT_LOCALE - устанавливает текущую локаль
 * - fallbackLocale: DEFAULT_LOCALE - локаль для отката при отсутствии переводов
 * - messages: {} - изначально пустой объект, переводы загружаются динамически
 * - globalInjection: true - делает $t функцию доступной глобально в шаблонах
 */
const i18n = createI18n({
  legacy: false,
  locale: DEFAULT_LOCALE,
  fallbackLocale: DEFAULT_LOCALE,
  messages: {}, // изначально пусто
  globalInjection: true,
});

/**
 * Асинхронная функция для загрузки сообщений локализации
 *
 * @param locale - локаль для загрузки (de, ru, en)
 *
 * Выполняет:
 * 1. Динамический импорт JSON файла с переводами из папки ./locales/
 * 2. Регистрацию загруженных сообщений в глобальном экземпляре i18n
 *
 * Используется динамический импорт для code splitting -
 * переводы загружаются только когда нужны, а не все сразу
 */
export async function loadLocaleMessages(locale: AvailableLocale) {
  const messages = await import(`./locales/${locale}.json`);
  i18n.global.setLocaleMessage(locale, messages.default);
}

/**
 * Асинхронная функция для установки новой локали
 *
 * @param locale - локаль для установки
 *
 * Алгоритм работы:
 * 1. Проверяет, загружена ли уже локаль в i18n
 * 2. Если не загружена - загружает переводы через loadLocaleMessages
 * 3. Устанавливает новую активную локаль в i18n
 * 4. Сохраняет выбор пользователя в localStorage для персистентности
 * 5. Обновляет SEO атрибуты
 *
 * Это обеспечивает ленивую загрузку переводов и сохранение настроек между сессиями
 */
export async function setLocale(locale: AvailableLocale) {
  if (!i18n.global.availableLocales.includes(locale)) {
    await loadLocaleMessages(locale);
  }
  i18n.global.locale.value = locale;
  // Сохраняет выбор пользователя в localStorage
  localStorage.setItem("locale", locale);
  // Обновляем SEO атрибуты
  await updateSEO();
}

/**
 * Функция для циклического переключения между поддерживаемыми локалями
 *
 * Алгоритм:
 * 1. Находит индекс текущей локали в массиве SUPPORT_LOCALES
 * 2. Вычисляет следующий индекс с помощью модульного деления (циклический переход)
 * 3. Получает следующую локаль по вычисленному индексу
 * 4. Устанавливает новую локаль через setLocale
 *
 * Пример: de -> ru -> en -> de -> ru -> ...
 *
 * Полезно для кнопки переключения языков в UI
 */
export async function switchLocale() {
  const newLocaleIndex =
    // Получаем индекс текущей локали в массиве SUPPORT_LOCALES
    (SUPPORT_LOCALES.indexOf(i18n.global.locale.value as AvailableLocale) +
      // Увеличиваем индекс на 1 для перехода к следующей локали
      1) %
    // Модульное деление для циклического перехода
    SUPPORT_LOCALES.length;

  // Получаем новую локаль по вычисленному индексу
  const newLocale = SUPPORT_LOCALES[newLocaleIndex] as AvailableLocale;
  // Устанавливаем новую локаль
  await setLocale(newLocale);
}

/**
 * Экспорт экземпляра i18n как модуль по умолчанию
 * Используется для подключения интернационализации к Vue приложению
 *
 * Пример использования:
 * import i18n from './i18n';
 * app.use(i18n);
 */
export default i18n;
