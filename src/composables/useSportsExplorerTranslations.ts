/**
 * Композабл для работы с переводами компонента SportsExplorer из API
 */
import { ref, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import { apiGet } from "@/utils/apiUtils";
import { createCache } from "@/utils/cacheUtils";
import { isValidLocale, type AvailableLocale } from "@/i18n";
import type { SportsExplorerApiResponse } from "@/types/sportsExplorer";

// Константы API
const SPORTS_EXPLORER_ENDPOINT = "sports-explorer";

// Глобальный кэш для хранения загруженных переводов
const translationsCache = createCache<SportsExplorerApiResponse>();

// Глобальное состояние
const isLoading = ref(false);
const currentTranslations = ref<SportsExplorerApiResponse | null>(null);
const loadError = ref<string | null>(null);

export const useSportsExplorerTranslations = () => {
  const { locale } = useI18n();

  /**
   * Загружает переводы для указанной локали из API
   */
  const loadTranslations = async (
    targetLocale: AvailableLocale,
  ): Promise<void> => {
    // Проверяем кэш
    const cached = translationsCache.get(targetLocale);
    if (cached) {
      currentTranslations.value = cached;
      loadError.value = null;
      return;
    }

    isLoading.value = true;
    loadError.value = null;

    try {
      // Формируем эндпоинт с расширением .json
      const endpoint = `${SPORTS_EXPLORER_ENDPOINT}/${targetLocale}.json`;
      const data = await apiGet<SportsExplorerApiResponse>(endpoint);

      translationsCache.set(targetLocale, data);
      currentTranslations.value = data;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to load SportsExplorer translations";

      loadError.value = errorMessage;
      console.error(
        `Error loading translations for locale ${targetLocale}:`,
        error,
      );
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Синхронизирует переводы с текущей локалью i18n
   */
  const syncWithI18n = async (): Promise<void> => {
    const currentLocale = locale.value as string;

    if (!isValidLocale(currentLocale)) {
      console.warn(`Invalid locale from i18n: ${currentLocale}`);
      return;
    }

    await loadTranslations(currentLocale);
  };

  /**
   * Очищает кэш переводов
   */
  const clearCache = (): void => {
    translationsCache.clear();
    currentTranslations.value = null;
  };

  /**
   * Контент Sports Explorer
   */
  const sportsExplorer = computed(() => {
    return currentTranslations.value?.sportsExplorer ?? null;
  });

  // Автоматически загружаем переводы при смене языка
  watch(
    () => locale.value,
    async (newLocale) => {
      if (isValidLocale(newLocale as string)) {
        await loadTranslations(newLocale as AvailableLocale);
      }
    },
    { immediate: false },
  );

  return {
    isLoading: computed(() => isLoading.value),
    currentTranslations: computed(() => currentTranslations.value),
    loadError: computed(() => loadError.value),
    sportsExplorer,
    syncWithI18n,
    clearCache,
  };
};
