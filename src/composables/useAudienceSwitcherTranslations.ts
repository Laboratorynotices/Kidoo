/**
 * Композабл для работы с переводами компонента AudienceSwitcher из API
 */
import { ref, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import { apiGet } from "@/utils/apiUtils";
import { createCache } from "@/utils/cacheUtils";
import { isValidLocale, type AvailableLocale } from "@/i18n";
import type { AudienceSwitcherApiResponse } from "@/types/audienceSwitcher";

// Константы API
const AUDIENCE_SWITCHER_ENDPOINT = "audience-switcher";

// Глобальный кэш для хранения загруженных переводов
const translationsCache = createCache<AudienceSwitcherApiResponse>();

// Глобальное состояние
const isLoading = ref(false);
const currentTranslations = ref<AudienceSwitcherApiResponse | null>(null);
const loadError = ref<string | null>(null);

export const useAudienceSwitcherTranslations = () => {
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
      // Формируем эндпоинт с расширением .json (как в useSeo)
      const endpoint = `${AUDIENCE_SWITCHER_ENDPOINT}/${targetLocale}.json`;
      const data = await apiGet<AudienceSwitcherApiResponse>(endpoint);

      translationsCache.set(targetLocale, data);
      currentTranslations.value = data;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to load AudienceSwitcher translations";

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
   * Переводы секции "Introduce Yourself"
   */
  const introduceYourself = computed(() => {
    return currentTranslations.value?.introduceYourself ?? null;
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
    introduceYourself,
    syncWithI18n,
    clearCache,
  };
};
