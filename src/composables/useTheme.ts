/**
 * Композабл для управления темами оформления приложения
 *
 * @description Предоставляет функциональность для работы с различными режимами
 * отображения (детский, семейный, родительский) включая сохранение выбора
 * пользователя в localStorage и применение соответствующих CSS-атрибутов
 */

import type { BodyMode } from "@/types/theme";
import { ref } from "vue";

// Общие реактивные состояния для флагов режимов
const isChildModeActive = ref(true);
const isParentModeActive = ref(true);

// Реактивная переменная для текущей темы
const currentTheme = ref<BodyMode>("family");

/**
 * Хук для работы с темами приложения
 *
 * @returns {Object} Объект с методами для управления темами
 */
export const useTheme = () => {
  // Ключ для сохранения выбора темы в localStorage
  const STORAGE_KEY = "palette";

  /**
   * Устанавливает тему оформления приложения
   *
   * @param {BodyMode} type - Тип темы для применения
   * @description Метод выполняет следующие действия:
   * 1. Очищает предыдущие атрибуты темы с элемента <html>
   * 2. Устанавливает новый атрибут data-theme для режимов 'child' и 'parent'
   * 3. Для режима 'family' атрибут не устанавливается (базовая тема)
   * 4. Сохраняет выбор пользователя в localStorage для последующих сессий
   */
  const setTheme = (type: BodyMode): void => {
    // Получаем ссылку на корневой элемент документа
    const html = document.documentElement;

    // Очищаем предыдущие атрибуты темы
    html.removeAttribute("data-theme");

    // Применяем атрибут темы только для специфических режимов
    // Семейный режим использует базовое оформление без дополнительных атрибутов
    if (type === "child" || type === "parent") {
      html.setAttribute("data-theme", type);
    }

    // Сохраняет выбор пользователя в localStorage для восстановления при следующем визите
    localStorage.setItem(STORAGE_KEY, type);

    // Обновляем состояния флагов на основе установленной темы
    updateSwitchStatesFromTheme(type);
  };

  /**
   * Получает сохраненную тему из localStorage
   *
   * @returns {BodyMode | null} Сохраненная тема или null, если ничего не сохранено
   * @description Извлекает ранее выбранную пользователем тему из локального хранилища
   */
  const getStoredTheme = (): BodyMode | null => {
    const stored = localStorage.getItem(STORAGE_KEY);
    // Приводим к типу BodyMode, предполагая что в storage сохранены только валидные значения
    return stored as BodyMode | null;
  };

  /**
   * Инициализирует тему при загрузке приложения
   *
   * @description Восстанавливает ранее выбранную пользователем тему
   * из localStorage. Если сохраненной темы нет, используется базовая тема
   */
  const initTheme = () => {
    const storedTheme = getStoredTheme();

    // Применяем сохраненную тему, если она существует
    if (storedTheme) {
      setTheme(storedTheme);
      // Восстанавливаем состояния флагов на основе темы
      updateSwitchStatesFromTheme(storedTheme);
    }
  };

  /**
   * Обновляет состояния флагов на основе текущей темы
   */
  const updateSwitchStatesFromTheme = (theme: BodyMode): void => {
    switch (theme) {
      case "child":
        isChildModeActive.value = true;
        isParentModeActive.value = false;
        break;
      case "parent":
        isChildModeActive.value = false;
        isParentModeActive.value = true;
        break;
      case "family":
        isChildModeActive.value = true;
        isParentModeActive.value = true;
        break;
    }
  };

  /**
   * Сбрасывает флаги, если оба выключены
   */
  const ensureAtLeastOneModeActive = (): void => {
    if (!isChildModeActive.value && !isParentModeActive.value) {
      isChildModeActive.value = true;
      isParentModeActive.value = true;
    }
  };

  /**
   * Определяет и применяет тему на основе текущего состояния флагов
   *
   * @description Логика выбора темы:
   * - Если активен только детский флаг → детская тема
   * - Если активен только родительский флаг → родительская тема
   * - Если активны оба флага → семейная тема
   */
  const applyCurrentTheme = (): void => {
    if (!isChildModeActive.value && isParentModeActive.value) {
      setTheme("parent");
    } else if (isChildModeActive.value && !isParentModeActive.value) {
      setTheme("child");
    } else {
      setTheme("family");
    }
  };

  /**
   * Переключает указанный флаг и применяет соответствующую тему
   */
  const toggleFlag = (flagType: "child" | "parent"): void => {
    if (flagType === "child") {
      isChildModeActive.value = !isChildModeActive.value;
    } else {
      isParentModeActive.value = !isParentModeActive.value;
    }

    ensureAtLeastOneModeActive();
    applyCurrentTheme();
  };

  /**
   * Переключает флаг детского режима
   */
  const toggleChildFlag = (): void => {
    toggleFlag("child");
  };

  /**
   * Переключает флаг родительского режима
   */
  const toggleParentFlag = (): void => {
    toggleFlag("parent");
  };

  // Возвращаем публичный API композабла
  return {
    // Состояния (флаги)
    isChildModeActive,
    isParentModeActive,

    /**
     * Устанавливает новую тему и сохраняет выбор
     */
    setTheme,
    currentTheme,

    /**
     * Инициализирует тему из сохраненных данных
     */
    initTheme,

    /**
     * Получает текущую сохраненную тему
     */
    getStoredTheme,

    // Методы для переключения флагов
    toggleFlag,
    toggleChildFlag,
    toggleParentFlag,

    // Вспомогательные методы (можно не экспортировать, если не нужны извне)
    ensureAtLeastOneModeActive,
    applyCurrentTheme,
    updateSwitchStatesFromTheme,
  };
};
