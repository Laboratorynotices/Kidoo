/**
 * Типы для данных компонента AudienceSwitcher, получаемых с API
 */
import type { AvailableLocale } from "@/i18n";

/**
 * Структура переводов для секции "Introduce Yourself"
 */
export interface IntroduceYourselfTranslations {
  title: string;
  subtitle: string;
  description: string;
}

/**
 * Структура ответа API для компонента AudienceSwitcher
 */
export interface AudienceSwitcherApiResponse {
  language: AvailableLocale;
  introduceYourself: IntroduceYourselfTranslations;
}
