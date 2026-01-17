# Система динамической загрузки компонентов

Комплексная система для автоматического обнаружения, конфигурирования и рендеринга компонентов на основе данных из API.

---

## Обзор системы

Система динамической загрузки компонентов состоит из трёх взаимосвязанных композаблов:

1. **`useDynamicComponents`** - автоматическое обнаружение компонентов в файловой системе
2. **`useLayoutConfig`** - получение и обработка конфигурации из API
3. **`useLayout`** - главный композабл, объединяющий всю функциональность

### Архитектура

```
┌─────────────────────────────────────────────────────┐
│                    useLayout                        │
│   (фасад для всей системы)                          │
└──────────────┬──────────────────────┬───────────────┘
               │                      │
               ▼                      ▼
┌──────────────────────────┐  ┌─────────────────────┐
│  useDynamicComponents    │  │  useLayoutConfig    │
│  (обнаружение)           │  │  (конфигурация)     │
└──────────────────────────┘  └─────────────────────┘
```

### Принцип работы

1. **Инициализация**: `useDynamicComponents` сканирует папку `src/components/dynamic/` и создаёт карту доступных компонентов
2. **Запрос конфигурации**: `useLayoutConfig` отправляет batch-запрос к API с текущей темой
3. **Фильтрация**: API-ответ фильтруется - остаются только существующие компоненты
4. **Рендеринг**: Компоненты отображаются согласно полученной конфигурации (порядок, видимость, пропсы)

---

## useDynamicComponents

Композабл для автоматического обнаружения компонентов в директории `src/components/dynamic/`.

### Импорт

```typescript
import { useDynamicComponents } from "@/composables/layout/useDynamicComponents";
// или
import { useDynamicComponents } from "@/composables/layout";
```

### Возвращаемые значения

```typescript
{
  availableComponents: string[],      // Массив имён найденных компонентов
  componentMap: Record<string, any>,  // Map: имя → компонент
  resolveComponent: (name: string) => Component | undefined
}
```

### Описание полей

#### `availableComponents`

Массив строк с именами всех обнаруженных компонентов.

**Пример:**

```typescript
const { availableComponents } = useDynamicComponents();
console.log(availableComponents);
// ['HeroSection', 'AboutSection', 'ContactSection']
```

#### `componentMap`

Объект-словарь, где ключ - имя компонента, значение - сам компонент.

**Пример:**

```typescript
const { componentMap } = useDynamicComponents();
const HeroComponent = componentMap["HeroSection"];
```

#### `resolveComponent(name: string)`

Функция для получения компонента по имени. Возвращает `undefined`, если компонент не найден.

**Пример:**

```typescript
const { resolveComponent } = useDynamicComponents();
const component = resolveComponent("HeroSection");
if (component) {
  // Компонент существует
}
```

### Механизм обнаружения

Используется функция Vite `import.meta.glob` с параметром `eager: true`:

```typescript
const componentModules = import.meta.glob("@/components/dynamic/*.vue", {
  eager: true,
});
```

**Особенности:**

- Поиск только в корне папки `dynamic/`, без рекурсии в подпапки
- Все компоненты загружаются сразу (eager loading)
- Имя компонента извлекается из имени файла без расширения `.vue`

### Ограничения

- ❌ Не ищет компоненты в подпапках `dynamic/`
- ❌ Работает только с `.vue` файлами
- ❌ Имена файлов должны соответствовать стандарту PascalCase
- ✅ Компоненты загружаются при старте приложения (может увеличить размер бандла)

### Примеры использования

#### Базовое использование

```typescript
import { useDynamicComponents } from "@/composables/layout";

const { availableComponents, resolveComponent } = useDynamicComponents();

// Проверка наличия компонента
if (availableComponents.includes("HeroSection")) {
  const hero = resolveComponent("HeroSection");
}
```

#### Отладка

```typescript
const { availableComponents, componentMap } = useDynamicComponents();

console.log("Найдено компонентов:", availableComponents.length);
console.log("Список:", availableComponents);
console.log("Детали:", Object.keys(componentMap));
```

---

## useLayoutConfig

Композабл для получения конфигурации layout через API и управления состоянием загрузки.

### Импорт

```typescript
import { useLayoutConfig } from "@/composables/layout/useLayoutConfig";
// или
import { useLayoutConfig } from "@/composables/layout";
```

### Зависимости

Композабл использует утилиту `apiGet` из `@/utils/apiUtils` для выполнения API-запросов. Это обеспечивает:

- Правильное формирование URL с учётом базового пути (`__APP_BASE__`)
- Корректную работу на GitHub Pages
- Централизованную обработку ошибок
- Типобезопасность запросов

### Сигнатура

```typescript
function useLayoutConfig(availableComponents: string[]): {
  configs: Ref<BatchResponse>;
  isLoading: Ref<boolean>;
  fetchConfigs: (theme: string) => Promise<void>;
  visibleSections: ComputedRef<SectionData[]>;
};
```

### Параметры

#### `availableComponents: string[]`

Массив имён компонентов, полученный из `useDynamicComponents`. Используется для фильтрации API-ответа.

### Возвращаемые значения

#### `configs: Ref<BatchResponse>`

Реактивный объект с конфигурацией всех компонентов, полученной из API.

**Структура:**

```typescript
type BatchResponse = Record<string, SectionConfig>;

interface SectionConfig {
  order: number; // Порядок отображения (1, 2, 3...)
  visible: boolean; // Показывать ли компонент
  props?: Record<string, unknown>; // Пропсы для компонента
}
```

**Пример:**

```typescript
{
  "HeroSection": {
    order: 1,
    visible: true,
    props: { title: "Добро пожаловать" }
  },
  "AboutSection": {
    order: 2,
    visible: false
  }
}
```

#### `isLoading: Ref<boolean>`

Флаг состояния загрузки. `true` во время выполнения запроса к API.

**Использование:**

```typescript
const { isLoading } = useLayoutConfig(components);

// В шаблоне
<div v-if="isLoading">Загрузка...</div>
```

#### `fetchConfigs(theme: string): Promise<void>`

Асинхронная функция для загрузки конфигурации для указанной темы. Использует `apiGet` для корректной работы с базовым путём приложения.

**Параметры:**

- `theme` - название темы (`"child"`, `"family"`, `"parent"`)

**Пример:**

```typescript
const { fetchConfigs } = useLayoutConfig(availableComponents);

await fetchConfigs("family");
// Запрос будет отправлен к: {__APP_BASE__}/api/v1/layout/batch-family.json
```

#### `visibleSections: ComputedRef<SectionData[]>`

Computed-свойство, возвращающее массив видимых секций, отсортированных по порядку.

**Структура элемента:**

```typescript
interface SectionData {
  name: string; // Имя компонента
  order: number; // Порядковый номер
  visible: boolean; // Видимость (всегда true в этом массиве)
  props: Record<string, unknown>; // Пропсы компонента
}
```

**Пример:**

```typescript
const { visibleSections } = useLayoutConfig(components);

console.log(visibleSections.value);
// [
//   { name: 'HeroSection', order: 1, visible: true, props: {} },
//   { name: 'AboutSection', order: 2, visible: true, props: { theme: 'dark' } }
// ]
```

### Логика работы

1. **Запрос к API**: Отправляется GET-запрос через `apiGet('layout/batch-${theme}.json')`
2. **Автоматическое формирование URL**: `apiGet` использует базовый путь из `__APP_BASE__`
3. **Фильтрация**: Оставляются только компоненты из списка `availableComponents`
4. **Валидация**: `apiGet` автоматически проверяет статус ответа
5. **Обновление состояния**: Данные сохраняются в `configs`
6. **Автоматическая сортировка**: `visibleSections` пересчитывается автоматически

**Важно:** Использование `apiGet` вместо прямого `fetch` критично для работы на GitHub Pages, где приложение может быть развёрнуто не в корне домена.

### Обработка ошибок

**Текущая реализация:**

```typescript
try {
  const allConfigs = await apiGet<BatchResponse>(`layout/batch-${theme}.json`);
  // обработка данных...
} catch (error) {
  console.error("Failed to fetch layout config:", error);
  // TODO: fallback конфигурация
}
```

Утилита `apiGet` автоматически обрабатывает:

- HTTP ошибки (404, 500 и т.д.) → выбрасывает `ApiError` с полями `status` и `statusText`
- Сетевые ошибки → выбрасывает стандартный `Error`
- Ошибки парсинга JSON → выбрасывает `Error` с описанием проблемы

**Рекомендации по улучшению:**

- Добавить fallback-конфигурацию для офлайн-режима
- Реализовать retry-логику при сетевых ошибках
- Добавить toast-уведомления для пользователя
- Различать типы ошибок через `instanceof ApiError`

### Известные ограничения (TODO)

- ⚠️ Отсутствует обработка race conditions при быстрой смене тем
- ⚠️ Нет кеширования конфигураций
- ⚠️ Нет fallback-конфигурации при ошибках

### Примеры использования

#### Базовая загрузка

```typescript
import { useDynamicComponents } from "@/composables/layout";
import { useLayoutConfig } from "@/composables/layout";

const { availableComponents } = useDynamicComponents();
const { fetchConfigs, visibleSections, isLoading } =
  useLayoutConfig(availableComponents);

// Загрузка конфигурации
await fetchConfigs("family");

// Использование данных
console.log("Видимые секции:", visibleSections.value);
```

#### Отображение индикатора загрузки

```vue
<script setup lang="ts">
import { useDynamicComponents, useLayoutConfig } from "@/composables/layout";

const { availableComponents } = useDynamicComponents();
const { isLoading, fetchConfigs } = useLayoutConfig(availableComponents);

const loadTheme = async (theme: string) => {
  await fetchConfigs(theme);
};
</script>

<template>
  <div v-if="isLoading" class="loader">Загрузка компонентов...</div>
  <div v-else>
    <!-- Контент -->
  </div>
</template>
```

#### Реакция на изменение конфигурации

```typescript
import { watch } from "vue";

const { visibleSections } = useLayoutConfig(availableComponents);

watch(visibleSections, (newSections) => {
  console.log("Конфигурация обновлена:", newSections.length, "секций");
  // Можно выполнить дополнительные действия
});
```

---

## useLayout

Главный композабл-фасад, объединяющий функциональность `useDynamicComponents` и `useLayoutConfig`.

### Импорт

```typescript
import { useLayout } from "@/composables/layout";
```

### Возвращаемые значения

```typescript
{
  // Основное для рендеринга
  visibleSections: ComputedRef<SectionData[]>,
  resolveComponent: (name: string) => Component | undefined,

  // Управление состоянием
  fetchConfigs: (theme: string) => Promise<void>,
  isLoading: Ref<boolean>,

  // Для отладки
  availableComponents: string[],
  configs: Ref<BatchResponse>
}
```

### Описание полей

Все поля наследуются из базовых композаблов. Основные для работы:

#### `visibleSections`

Массив секций для отображения (отфильтрованный, отсортированный).

#### `resolveComponent(name: string)`

Функция получения компонента по имени.

#### `fetchConfigs(theme: string)`

Загрузка конфигурации для темы.

#### `isLoading`

Индикатор загрузки.

### Примеры использования

#### Интеграция в App.vue

```vue
<script setup lang="ts">
import { onMounted } from "vue";
import { useTheme } from "@/composables/useTheme";
import { useLayout } from "@/composables/layout";

const { currentTheme, initTheme } = useTheme();
const { visibleSections, resolveComponent, fetchConfigs, isLoading } =
  useLayout();

onMounted(async () => {
  initTheme();
  await fetchConfigs(currentTheme.value);
});
</script>

<template>
  <div v-if="isLoading">Загрузка...</div>

  <component
    v-for="section in visibleSections"
    :key="section.name"
    :is="resolveComponent(section.name)"
    v-bind="section.props"
  />
</template>
```

#### Смена темы с перезагрузкой конфигурации

```typescript
import { useTheme } from "@/composables/useTheme";
import { useLayout } from "@/composables/layout";

const { setTheme } = useTheme();
const { fetchConfigs } = useLayout();

const changeTheme = async (newTheme: "child" | "family" | "parent") => {
  setTheme(newTheme);
  await fetchConfigs(newTheme);
};
```

#### Отладка системы

```typescript
const { availableComponents, visibleSections, configs, isLoading } =
  useLayout();

console.log("Доступно компонентов:", availableComponents.length);
console.log("Видимых секций:", visibleSections.value.length);
console.log("Сырая конфигурация:", configs.value);
console.log("Статус загрузки:", isLoading.value);
```

---

## Структура API-ответа

### Формат запроса

```
GET /api/v1/layout/batch-{theme}.json
```

Где `{theme}` - одно из значений: `child`, `family`, `parent`.

### Формат ответа

```json
{
  "ComponentName1": {
    "order": 1,
    "visible": true,
    "props": {
      "title": "Заголовок",
      "theme": "dark"
    }
  },
  "ComponentName2": {
    "order": 2,
    "visible": false
  }
}
```

### Поля конфигурации

| Поле      | Тип       | Обязательное | Описание                            |
| --------- | --------- | ------------ | ----------------------------------- |
| `order`   | `number`  | ✅           | Порядок отображения (меньше = выше) |
| `visible` | `boolean` | ✅           | Показывать компонент или нет        |
| `props`   | `object`  | ❌           | Пропсы для передачи в компонент     |

### Примеры конфигураций

#### Базовая конфигурация (batch-family.json)

```json
{
  "HeroSection": {
    "order": 1,
    "visible": true
  },
  "AboutSection": {
    "order": 2,
    "visible": true
  },
  "ContactSection": {
    "order": 3,
    "visible": true
  }
}
```

#### Конфигурация с пропсами (batch-child.json)

```json
{
  "HeroSection": {
    "order": 1,
    "visible": true,
    "props": {
      "variant": "playful",
      "showAnimation": true
    }
  },
  "GamesSection": {
    "order": 2,
    "visible": true,
    "props": {
      "difficulty": "easy"
    }
  }
}
```

#### Частично скрытые компоненты (batch-parent.json)

```json
{
  "HeroSection": {
    "order": 1,
    "visible": true
  },
  "GamesSection": {
    "order": 2,
    "visible": false
  },
  "EducationSection": {
    "order": 3,
    "visible": true
  }
}
```

---

## Полный пример интеграции

### Структура компонентов

```
src/
├── components/
│   └── dynamic/
│       ├── HeroSection.vue
│       ├── AboutSection.vue
│       └── ContactSection.vue
├── composables/
│   └── layout/
│       ├── useDynamicComponents.ts
│       ├── useLayoutConfig.ts
│       └── index.ts
└── App.vue
```

### Реализация App.vue

```vue
<script setup lang="ts">
import { onMounted, watch } from "vue";
import { useTheme } from "@/composables/useTheme";
import { useLayout } from "@/composables/layout";
import type { BodyMode } from "@/types/theme";

import HeaderApp from "@/components/header/HeaderApp.vue";

const { currentTheme, setTheme, initTheme } = useTheme();
const {
  visibleSections,
  resolveComponent,
  fetchConfigs,
  isLoading,
  availableComponents,
} = useLayout();

// Инициализация при монтировании
onMounted(async () => {
  console.log("Найдено компонентов:", availableComponents.length);

  initTheme();
  await fetchConfigs(currentTheme.value);

  console.log("Загружено секций:", visibleSections.value.length);
});

// Обработчик смены темы
const handleThemeChange = async (theme: BodyMode) => {
  setTheme(theme);
  await fetchConfigs(theme);
};

// Отслеживание изменений для аналитики
watch(visibleSections, (sections) => {
  console.log(`Отображается ${sections.length} секций`);
});
</script>

<template>
  <HeaderApp />

  <!-- Индикатор загрузки -->
  <div v-if="isLoading" class="loading-skeleton">
    <div class="skeleton-item" v-for="n in 3" :key="n"></div>
  </div>

  <!-- Динамический рендеринг секций -->
  <component
    v-else
    v-for="section in visibleSections"
    :key="section.name"
    :is="resolveComponent(section.name)"
    v-bind="section.props"
  />

  <!-- Переключатель тем -->
  <nav class="theme-switcher">
    <button @click="handleThemeChange('child')" :disabled="isLoading">
      {{ $t("child") }}
    </button>
    <button @click="handleThemeChange('family')" :disabled="isLoading">
      {{ $t("family") }}
    </button>
    <button @click="handleThemeChange('parent')" :disabled="isLoading">
      {{ $t("parents") }}
    </button>
  </nav>
</template>

<style scoped>
.loading-skeleton {
  padding: 2rem;
}

.skeleton-item {
  height: 200px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  margin-bottom: 1rem;
  border-radius: 8px;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
```

---

## Рекомендации по использованию

### ✅ Лучшие практики

1. **Всегда используйте `useLayout`** вместо прямого использования `useDynamicComponents` и `useLayoutConfig`
2. **Показывайте индикаторы загрузки** при `isLoading === true`
3. **Обрабатывайте ошибки** при загрузке конфигурации
4. **Используйте TypeScript** для типобезопасности пропсов
5. **Называйте файлы компонентов в PascalCase** для согласованности

### ⚠️ Распространённые ошибки

1. **Забыть await при fetchConfigs**

   ```typescript
   // ❌ Неправильно
   fetchConfigs(theme);

   // ✅ Правильно
   await fetchConfigs(theme);
   ```

2. **Использовать несуществующие компоненты в API**
   - Система автоматически отфильтрует их, но лучше следить за синхронизацией

3. **Не проверять isLoading перед рендерингом**

   ```vue
   <!-- ❌ Неправильно -->
   <component :is="resolveComponent(name)" />

   <!-- ✅ Правильно -->
   <div v-if="!isLoading">
     <component :is="resolveComponent(name)" />
   </div>
   ```

---

## Планы развития

### Краткосрочные улучшения

- [ ] Добавить fallback-конфигурацию при ошибках API
- [ ] Реализовать skeleton loaders
- [ ] Добавить обработку race conditions
- [ ] Кеширование конфигураций в localStorage

### Долгосрочные улучшения

- [ ] Переход на ленивую загрузку компонентов (lazy loading)
- [ ] Интеграция с реальным API вместо статических JSON
- [ ] Система A/B тестирования конфигураций
- [ ] Персонализация на основе пользовательских данных
- [ ] Поддержка вложенных компонентов в dynamic/
- [ ] Предпросмотр конфигураций в админ-панели

---

## Связанная документация

- [useTheme](/docs/composables/useTheme.md) - Управление цветовыми темами
- [apiUtils](/docs/utils/apiUtils.md) - Утилиты для работы с API
- [Структура проекта](/docs/project-structure.md) - Организация файлов
- [API Reference](/docs/api-reference.md) - Спецификация API эндпоинтов
- [GitHub Pages Deploy](/docs/deploy/github-pages.md) - Особенности деплоя

---

## Troubleshooting

### Компонент не отображается

**Проблема:** Компонент есть в API-ответе, но не рендерится.

**Решение:**

1. Проверьте, что файл компонента существует в `src/components/dynamic/`
2. Убедитесь, что имя файла совпадает с именем в API (с учётом регистра)
3. Проверьте, что `visible: true` в конфигурации
4. Посмотрите в консоли вывод `availableComponents`

### Ошибка "Failed to fetch layout config"

**Проблема:** Не удаётся загрузить конфигурацию.

**Решение:**

1. Проверьте наличие файла `/public/api/v1/layout/batch-{theme}.json`
2. Убедитесь, что JSON валиден (используйте линтер)
3. Проверьте сетевую вкладку в DevTools
4. Убедитесь, что `__APP_BASE__` правильно настроен в `vite.config.ts`
5. Для GitHub Pages проверьте, что `base` в конфиге соответствует названию репозитория

**Пример конфигурации для GitHub Pages:**

```typescript
// vite.config.ts
export default defineConfig({
  base: "/your-repo-name/", // важно для корректных путей
  // ...
});
```

### Компоненты в неправильном порядке

**Проблема:** Секции отображаются не в том порядке, что в API.

**Решение:**

1. Проверьте значения `order` в API-ответе (меньше = выше)
2. Убедитесь, что все компоненты имеют числовое значение `order`
3. Проверьте `visibleSections.value` в консоли

### Пропсы не передаются в компонент

**Проблема:** Компонент не получает пропсы из конфигурации.

**Решение:**

1. Убедитесь, что используете `v-bind="section.props"`
2. Проверьте структуру `props` в API-ответе
3. Проверьте определение пропсов в самом компоненте
