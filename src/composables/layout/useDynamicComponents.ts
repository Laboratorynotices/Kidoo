/**
 * Композабл для автоматического обнаружения компонентов
 * Сканирует папку @/components/dynamic/ и создаёт "карту" map компонентов
 */
export function useDynamicComponents() {
  // Автоматически находим все .vue файлы в папке dynamic, в подпапках не ищем
  const componentModules = import.meta.glob("@/components/dynamic/*.vue", {
    // Загружаем компоненты сразу
    eager: true,
  });

  // Извлекаем имена компонентов из путей файлов
  const availableComponents = Object.keys(componentModules)
    .map((path) => {
      // '@/components/dynamic/HeroSection.vue' -> 'HeroSection'
      return path.split("/").pop()?.replace(".vue", "") || "";
    })
    .filter(Boolean);

  // Создаём map: имя компонента -> компонент
  const componentMap = Object.fromEntries(
    Object.entries(componentModules).map(([path, module]) => {
      const name = path.split("/").pop()?.replace(".vue", "");
      return [name, (module as any).default];
    }),
  );

  /**
   * Получить компонент по имени
   */
  const resolveComponent = (name: string) => componentMap[name];

  return {
    availableComponents, // ['HeroSection', 'AboutSection', ...]
    componentMap, // { HeroSection: Component, ... }
    resolveComponent, // (name) => Component
  };
}
