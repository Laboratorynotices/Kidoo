import { ref, computed } from "vue";
import { apiGet } from "@/utils/apiUtils";

interface SectionConfig {
  order: number;
  visible: boolean;
  props?: Record<string, unknown>;
}

type BatchResponse = Record<string, SectionConfig>;

/**
 * Композабл для получения конфигурации layout через API
 */
export function useLayoutConfig(availableComponents: string[]) {
  const configs = ref<BatchResponse>({});
  const isLoading = ref(false);

  /**
   * Загрузить конфигурацию для указанной темы
   */
  const fetchConfigs = async (theme: string) => {
    isLoading.value = true;

    // TODO: обработка ошибок
    // TODO: race conditions при быстрой смене темы

    try {
      // Используем apiGet для корректной в разных средах работы с базовым URL
      const allConfigs = await apiGet<BatchResponse>(
        `layout/batch-${theme}.json`,
      );

      // Фильтруем только те компоненты, которые реально существуют
      configs.value = Object.fromEntries(
        Object.entries(allConfigs).filter(([name]) =>
          availableComponents.includes(name),
        ),
      ) as BatchResponse;
    } catch (error) {
      console.error("Failed to fetch layout config:", error);
      // TODO: fallback конфигурация
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Computed: видимые секции, отсортированные по порядку
   */
  const visibleSections = computed(() => {
    return Object.entries(configs.value)
      .filter(([_, config]) => config.visible)
      .sort((a, b) => a[1].order - b[1].order)
      .map(([name, config]) => ({
        name,
        order: config.order,
        visible: config.visible,
        props: config.props || {},
      }));
  });

  return {
    configs, // Сырые конфиги из API
    isLoading, // Состояние загрузки
    fetchConfigs, // Метод для загрузки
    visibleSections, // Готовые данные для рендеринга
  };
}
