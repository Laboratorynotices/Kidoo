import { useDynamicComponents } from "./useDynamicComponents";
import { useLayoutConfig } from "./useLayoutConfig";

/**
 * Главный композабл для управления динамическим layout
 * Объединяет обнаружение компонентов и получение их конфигурации
 */
export function useLayout() {
  // Шаг 1: Обнаруживаем доступные компоненты
  const { availableComponents, resolveComponent } = useDynamicComponents();

  // Шаг 2: Настраиваем работу с API конфигурацией
  const { configs, isLoading, fetchConfigs, visibleSections } =
    useLayoutConfig(availableComponents);

  return {
    // Основное для рендеринга
    visibleSections, // Массив секций для отображения
    resolveComponent, // Функция для получения компонента по имени

    // Управление состоянием
    fetchConfigs, // Загрузить конфигурацию для темы
    isLoading, // Индикатор загрузки

    // Для дебага (опционально)
    availableComponents, // Список всех найденных компонентов
    configs, // Сырые конфиги
  };
}

// Re-export для прямого доступа если понадобится
export { useDynamicComponents } from "./useDynamicComponents";
export { useLayoutConfig } from "./useLayoutConfig";
