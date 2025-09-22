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
export const loadLocaleMessages = async (
  locale: AvailableLocale,
): Promise<void> => {
  const messages = await import(`./locales/${locale}.json`);
  i18n.global.setLocaleMessage(locale, messages.default);
};

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
export const setLocale = async (locale: AvailableLocale): Promise<void> => {
  if (!i18n.global.availableLocales.includes(locale)) {
    await loadLocaleMessages(locale);
  }
  i18n.global.locale.value = locale;
  // Сохраняет выбор пользователя в localStorage
  localStorage.setItem("locale", locale);
  // Обновляем SEO атрибуты
  await updateSEO();
};

/**
 * Возвращает следующую локаль из списка SUPPORT_LOCALES
 * с учётом циклического перехода (после последней идёт первая).
 *
 * Алгоритм:
 * 1. Находим индекс текущей локали
 * 2. Прибавляем 1 и берём остаток от деления на длину массива
 * 3. Возвращаем локаль по новому индексу
 */
export const getNextLocale = (): AvailableLocale => {
  // Вычисляем индекс следующей локали в массиве SUPPORT_LOCALES
  const newLocaleIndex: number =
    // Получаем индекс текущей локали в массиве SUPPORT_LOCALES
    (SUPPORT_LOCALES.indexOf(i18n.global.locale.value as AvailableLocale) +
      // Увеличиваем индекс на 1 для перехода к следующей локали
      1) %
    // Модульное деление для циклического перехода
    SUPPORT_LOCALES.length;

  // Получаем новую локаль по вычисленному индексу
  return SUPPORT_LOCALES[newLocaleIndex] as AvailableLocale;
};

/**
 * Переключает активную локаль на следующую из списка SUPPORT_LOCALES.
 *
 * Используется для кнопки/триггера смены языка.
 *
 * Пример последовательности: de → ru → en → de → ...
 */
export const switchLocale = async (): Promise<void> => {
  // Устанавливаем новую локаль
  await setLocale(getNextLocale());
};

/**
 * Экспорт экземпляра i18n как модуль по умолчанию
 * Используется для подключения интернационализации к Vue приложению
 *
 * Пример использования:
 * import i18n from './i18n';
 * app.use(i18n);
 */
export default i18n;
