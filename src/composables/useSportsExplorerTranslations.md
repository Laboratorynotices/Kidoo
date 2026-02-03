# useSportsExplorerTranslations

Композабл для централизованного управления переводами компонента **SportsExplorer**, получаемыми из API.
Обеспечивает автоматическую синхронизацию с системой интернационализации, кэширование данных и удобный доступ к переводам через реактивные `computed`-свойства.

---

## Обзор

`useSportsExplorerTranslations` отвечает за загрузку и хранение переводов компонента SportsExplorer из API в зависимости от текущей локали приложения.

Ключевые возможности:

- **Автоматическое кэширование** переводов по локалям
- **Интеграция с vue-i18n** — обновление данных при смене языка
- **Глобальное реактивное состояние** — единый источник данных для всего приложения
- **Типобезопасность** — строгая проверка локалей и структуры API-ответа

---

## Импорт и использование

```ts
import { useSportsExplorerTranslations } from "@/composables/useSportsExplorerTranslations";

const {
  isLoading,
  currentTranslations,
  loadError,
  sportsExplorer,
  syncWithI18n,
  clearCache,
} = useSportsExplorerTranslations();
```

---

## Типы данных

Композабл работает со следующими типами:

```ts
import type { AvailableLocale } from "@/i18n";
import type { SportsExplorerApiResponse } from "@/types/sportsExplorer";

// AvailableLocale — список поддерживаемых локалей приложения
// SportsExplorerApiResponse — структура ответа API с переводами SportsExplorer
```

---

## API

### Состояния

- **`isLoading: ComputedRef<boolean>`**
  Флаг загрузки переводов из API.
  **Значение:** `true` во время запроса, `false` — в остальное время.

- **`currentTranslations: ComputedRef<SportsExplorerApiResponse | null>`**
  Текущие загруженные переводы для активной локали.
  **Значение по умолчанию:** `null`

- **`loadError: ComputedRef<string | null>`**
  Сообщение об ошибке при загрузке переводов.
  **Значение:** `null` при успешной загрузке или строка с описанием ошибки.

---

### Computed-свойства

#### `sportsExplorer: ComputedRef<SportsExplorerApiResponse["sportsExplorer"] | null>`

Возвращает секцию `sportsExplorer` из текущих загруженных переводов.

**Пример использования:**

```ts
const { sportsExplorer } = useSportsExplorerTranslations();
```

```vue
<template>
  <section v-if="sportsExplorer">
    <h1>{{ sportsExplorer.title }}</h1>
    <p>{{ sportsExplorer.description }}</p>
  </section>
</template>
```

---

## Основные методы

### `loadTranslations(targetLocale: AvailableLocale): Promise<void>`

Загружает переводы для указанной локали из API.
Использует кэш для предотвращения повторных запросов.

#### Поведение:

1. Проверяет наличие данных в кэше
2. Если переводы есть — использует их без запроса к API
3. Если нет — выполняет HTTP-запрос
4. Сохраняет результат в кэш
5. Обновляет `currentTranslations`
6. При ошибке заполняет `loadError` и логирует её в консоль

**Пример:**

```ts
const { loadTranslations, loadError } = useSportsExplorerTranslations();

await loadTranslations("en");

if (loadError.value) {
  console.error("Ошибка загрузки переводов");
}
```

---

### `syncWithI18n(): Promise<void>`

Синхронизирует переводы с текущей локалью из `vue-i18n`.

- Проверяет валидность локали
- Загружает переводы через `loadTranslations`
- Используется для **первичной инициализации**

**Типичное использование:**

```ts
import { onMounted } from "vue";
import { useSportsExplorerTranslations } from "@/composables/useSportsExplorerTranslations";

const { syncWithI18n } = useSportsExplorerTranslations();

onMounted(async () => {
  await syncWithI18n();
});
```

---

### `clearCache(): void`

Очищает глобальный кэш переводов и сбрасывает `currentTranslations`.

**Пример:**

```ts
const { clearCache } = useSportsExplorerTranslations();

// Очистка при logout или смене окружения
clearCache();
```

---

## Автоматическая синхронизация локали

Композабл автоматически отслеживает изменения локали из `vue-i18n`:

```ts
watch(
  () => locale.value,
  async (newLocale) => {
    if (isValidLocale(newLocale as string)) {
      await loadTranslations(newLocale as AvailableLocale);
    }
  },
  { immediate: false },
);
```

### Важно

- `immediate: false` — переводы **не загружаются автоматически** при первом использовании
- Для начальной загрузки необходимо вручную вызвать `syncWithI18n()`

---

## Примеры использования

### Инициализация при монтировании

```vue
<script setup lang="ts">
import { onMounted } from "vue";
import { useSportsExplorerTranslations } from "@/composables/useSportsExplorerTranslations";

const { isLoading, sportsExplorer, syncWithI18n } =
  useSportsExplorerTranslations();

onMounted(async () => {
  await syncWithI18n();
});
</script>

<template>
  <div v-if="isLoading">Загрузка...</div>

  <div v-else-if="sportsExplorer">
    <h1>{{ sportsExplorer.title }}</h1>
  </div>
</template>
```

---

### Обработка ошибок

```vue
<script setup lang="ts">
import { useSportsExplorerTranslations } from "@/composables/useSportsExplorerTranslations";

const { loadError, syncWithI18n } = useSportsExplorerTranslations();

const retry = async () => {
  await syncWithI18n();
};
</script>

<template>
  <div v-if="loadError">
    <p>Ошибка: {{ loadError }}</p>
    <button @click="retry">Повторить</button>
  </div>
</template>
```

---

### Ручная смена языка

```ts
import { useI18n } from "vue-i18n";
import { useSportsExplorerTranslations } from "@/composables/useSportsExplorerTranslations";

const { locale } = useI18n();
const { loadTranslations } = useSportsExplorerTranslations();

const switchToGerman = async () => {
  await loadTranslations("de");
  locale.value = "de";
};
```

---

## Кэширование

### Механизм

```ts
const translationsCache = createCache<SportsExplorerApiResponse>();
```

**Особенности:**

- Глобальный кэш на всё приложение
- Один запрос на одну локаль
- Мгновенное переключение между уже загруженными языками

---

### Принудительное обновление данных

```ts
const { clearCache, loadTranslations } = useSportsExplorerTranslations();

const forceRefresh = async (locale: AvailableLocale) => {
  clearCache();
  await loadTranslations(locale);
};
```

---

## Интеграция с API

### Эндпоинт

```ts
const SPORTS_EXPLORER_ENDPOINT = "sports-explorer";

// Итоговый путь:
// sports-explorer/{locale}.json
// Пример: sports-explorer/en.json
```

---

### Обработка ошибок API

```ts
try {
  const data = await apiGet<SportsExplorerApiResponse>(endpoint);
} catch (error) {
  loadError.value =
    error instanceof Error
      ? error.message
      : "Failed to load SportsExplorer translations";

  console.error(
    `Error loading translations for locale ${targetLocale}:`,
    error,
  );
}
```

- Предыдущие данные **не затираются**
- `isLoading` корректно сбрасывается
- Ошибка логируется с указанием локали

---

## Технические детали

### Глобальное состояние

Все `ref` объявлены **вне функции композабла**:

```ts
const isLoading = ref(false);
const currentTranslations = ref<SportsExplorerApiResponse | null>(null);
const loadError = ref<string | null>(null);
```

**Преимущества:**

- Единый источник данных
- Нет дублирующих API-запросов
- Согласованное состояние между компонентами

---

### Read-only API

Экспортируемые значения обёрнуты в `computed`:

```ts
return {
  isLoading: computed(() => isLoading.value),
  currentTranslations: computed(() => currentTranslations.value),
  loadError: computed(() => loadError.value),
};
```

Это защищает внутреннее состояние от прямой мутации.

---

## Связанная документация

- **vue-i18n** — система интернационализации
- **apiUtils** — утилиты работы с API
- **cacheUtils** — механизм глобального кэширования
- **useAudienceSwitcherTranslations** — аналогичный паттерн для другого компонента

---

## Отличия от useI18n

- `useI18n` — статические переводы, загружаемые локально
- `useSportsExplorerTranslations` — **динамические переводы из API** для конкретного UI-модуля
