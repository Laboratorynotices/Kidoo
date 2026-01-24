# useAudienceSwitcherTranslations

Композабл для централизованного управления переводами компонента AudienceSwitcher, получаемыми из API.
Обеспечивает автоматическую синхронизацию с системой интернационализации, кэширование данных и удобный доступ к переводам через реактивные computed-свойства.

---

## Обзор

`useAudienceSwitcherTranslations` загружает переводы для компонента AudienceSwitcher из API-эндпоинта в зависимости от текущей локали приложения.

Ключевые возможности:

- **Автоматическое кэширование** загруженных переводов для минимизации запросов к API
- **Синхронизация с vue-i18n** — переводы автоматически обновляются при смене языка
- **Глобальное состояние** — один экземпляр данных для всего приложения
- **Типобезопасность** — полная поддержка TypeScript с валидацией локалей

---

## Импорт и использование

```typescript
import { useAudienceSwitcherTranslations } from "@/composables/useAudienceSwitcherTranslations";

const {
  isLoading,
  currentTranslations,
  loadError,
  introduceYourself,
  syncWithI18n,
  clearCache,
} = useAudienceSwitcherTranslations();
```

---

## Типы данных

Композабл работает с следующими типами:

```typescript
import type { AvailableLocale } from "@/i18n";
import type { AudienceSwitcherApiResponse } from "@/types/audienceSwitcher";

// AvailableLocale — поддерживаемые локали приложения
// AudienceSwitcherApiResponse — структура ответа API с переводами
```

---

## API

### Состояния

- **`isLoading: ComputedRef<boolean>`**  
  Индикатор процесса загрузки переводов из API.  
  **Значение:** `true` во время выполнения запроса, `false` в остальное время.

- **`currentTranslations: ComputedRef<AudienceSwitcherApiResponse | null>`**  
  Текущие загруженные переводы для активной локали.  
  **Значение по умолчанию:** `null`

- **`loadError: ComputedRef<string | null>`**  
  Сообщение об ошибке при загрузке переводов.  
  **Значение:** `null` при успешной загрузке, строка с описанием ошибки при неудаче.

---

### Computed-свойства

#### `introduceYourself: ComputedRef<IntroduceYourself | null>`

Возвращает переводы секции "Introduce Yourself" из текущих загруженных данных.

**Пример:**

```typescript
const { introduceYourself } = useAudienceSwitcherTranslations();

// Использование в шаблоне
<h2>{{ introduceYourself?.title }}</h2>
```

---

### Основные методы

#### `loadTranslations(targetLocale: AvailableLocale): Promise<void>`

Загружает переводы для указанной локали из API. Использует кэш для предотвращения повторных запросов.

**Поведение:**

1. Проверяет наличие переводов в кэше
2. Если данные закэшированы — возвращает их мгновенно
3. Если данных нет — выполняет API-запрос
4. Сохраняет результат в кэш и обновляет `currentTranslations`
5. При ошибке устанавливает `loadError` и логирует в консоль

**Пример:**

```typescript
import { useAudienceSwitcherTranslations } from "@/composables/useAudienceSwitcherTranslations";

const { loadTranslations, isLoading, loadError } =
  useAudienceSwitcherTranslations();

const changeLanguage = async () => {
  await loadTranslations("de");

  if (loadError.value) {
    console.error("Не удалось загрузить переводы");
  }
};
```

---

#### `syncWithI18n(): Promise<void>`

Синхронизирует переводы с текущей локалью из vue-i18n. Вызывает `loadTranslations` для активной локали.

**Типичное использование:**

```typescript
import { onMounted } from "vue";
import { useAudienceSwitcherTranslations } from "@/composables/useAudienceSwitcherTranslations";

const { syncWithI18n, currentTranslations } = useAudienceSwitcherTranslations();

onMounted(async () => {
  // Загружаем переводы для текущего языка приложения
  await syncWithI18n();

  // После загрузки currentTranslations содержит актуальные данные
  console.log(currentTranslations.value);
});
```

---

#### `clearCache(): void`

Очищает глобальный кэш переводов и сбрасывает `currentTranslations`.

**Пример использования:**

```typescript
const { clearCache } = useAudienceSwitcherTranslations();

// Очистка кэша при logout пользователя
const handleLogout = () => {
  clearCache();
  // ... остальная логика выхода
};
```

---

## Автоматическая синхронизация

Композабл автоматически отслеживает изменения локали через `watch`:

```typescript
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

**Важно:** `immediate: false` означает, что переводы **не загружаются автоматически** при первом вызове композабла. Для начальной загрузки используйте `syncWithI18n()` в `onMounted`.

---

## Примеры использования

### Инициализация при монтировании компонента

```vue
<script setup lang="ts">
import { onMounted } from "vue";
import { useAudienceSwitcherTranslations } from "@/composables/useAudienceSwitcherTranslations";

const { isLoading, introduceYourself, syncWithI18n } =
  useAudienceSwitcherTranslations();

onMounted(async () => {
  await syncWithI18n();
});
</script>

<template>
  <div v-if="isLoading">Загрузка переводов...</div>

  <div v-else-if="introduceYourself">
    <h2>{{ introduceYourself.title }}</h2>
    <p>{{ introduceYourself.description }}</p>
  </div>
</template>
```

---

### Обработка ошибок загрузки

```vue
<script setup lang="ts">
import { useAudienceSwitcherTranslations } from "@/composables/useAudienceSwitcherTranslations";

const { isLoading, loadError, currentTranslations, syncWithI18n } =
  useAudienceSwitcherTranslations();

const retry = async () => {
  await syncWithI18n();
};
</script>

<template>
  <div v-if="isLoading" class="spinner">Загрузка...</div>

  <div v-else-if="loadError" class="error-state">
    <p>Ошибка: {{ loadError }}</p>
    <button @click="retry">Повторить</button>
  </div>

  <div v-else-if="currentTranslations">
    <!-- Основной контент -->
  </div>
</template>
```

---

### Ручное переключение локалей

```typescript
import { useAudienceSwitcherTranslations } from "@/composables/useAudienceSwitcherTranslations";
import { useI18n } from "vue-i18n";

const { loadTranslations } = useAudienceSwitcherTranslations();
const { locale } = useI18n();

const switchToGerman = async () => {
  // Предварительная загрузка переводов
  await loadTranslations("de");

  // Смена локали в i18n (автоматически синхронизируется через watch)
  locale.value = "de";
};
```

---

### Реактивное отслеживание переводов

```typescript
import { watch } from "vue";
import { useAudienceSwitcherTranslations } from "@/composables/useAudienceSwitcherTranslations";

const { introduceYourself } = useAudienceSwitcherTranslations();

watch(introduceYourself, (newTranslations) => {
  if (newTranslations) {
    console.log("Переводы обновлены:", newTranslations.title);
    // Дополнительная логика при смене переводов
  }
});
```

---

## Кэширование

### Механизм кэширования

Композабл использует глобальный кэш через утилиту `createCache`:

```typescript
const translationsCache = createCache<AudienceSwitcherApiResponse>();
```

**Ключевые особенности:**

- Кэш **глобальный** — сохраняется на весь жизненный цикл приложения
- Один запрос на локаль за сессию (если кэш не очищен)
- Быстрое переключение между ранее загруженными языками

### Управление кэшем

```typescript
const { clearCache, loadTranslations } = useAudienceSwitcherTranslations();

// Принудительное обновление переводов
const forceRefresh = async (locale: AvailableLocale) => {
  clearCache();
  await loadTranslations(locale);
};
```

---

## Интеграция с API

### Структура эндпоинта

```typescript
const AUDIENCE_SWITCHER_ENDPOINT = "audience-switcher";

// Итоговый URL формируется как:
// `${AUDIENCE_SWITCHER_ENDPOINT}/${locale}.json`
// Пример: "audience-switcher/en.json"
```

### Обработка ошибок API

При ошибке запроса:

1. Устанавливается `loadError` с описанием проблемы
2. Ошибка логируется в консоль с указанием локали
3. `isLoading` устанавливается в `false`
4. Предыдущие переводы не затираются

```typescript
try {
  const data = await apiGet<AudienceSwitcherApiResponse>(endpoint);
  // ...
} catch (error) {
  const errorMessage =
    error instanceof Error
      ? error.message
      : "Failed to load AudienceSwitcher translations";

  loadError.value = errorMessage;
  console.error(`Error loading translations for locale ${locale}:`, error);
}
```

---

## Рекомендации по расширению

### Добавление новых секций переводов

Если API возвращает дополнительные секции, создайте новые computed-свойства:

```typescript
const footer = computed(() => {
  return currentTranslations.value?.footer ?? null;
});

return {
  // ...
  introduceYourself,
  footer, // Новая секция
};
```

---

### Предзагрузка переводов

Для повышения производительности можно предзагрузить переводы для нескольких языков:

```typescript
const preloadTranslations = async (locales: AvailableLocale[]) => {
  await Promise.all(locales.map((locale) => loadTranslations(locale)));
};

// При инициализации приложения
onMounted(async () => {
  await preloadTranslations(["en", "de", "fr"]);
});
```

---

### Интеграция с системой уведомлений

```typescript
import { useNotifications } from "@/composables/useNotifications";

const { showError } = useNotifications();
const { loadError } = useAudienceSwitcherTranslations();

watch(loadError, (error) => {
  if (error) {
    showError("Не удалось загрузить переводы. Попробуйте позже.");
  }
});
```

---

### Добавление retry-логики

```typescript
const loadWithRetry = async (
  locale: AvailableLocale,
  maxRetries = 3,
): Promise<void> => {
  let attempts = 0;

  while (attempts < maxRetries) {
    await loadTranslations(locale);

    if (!loadError.value) return;

    attempts++;
    await new Promise((resolve) => setTimeout(resolve, 1000 * attempts));
  }

  console.error(`Failed to load translations after ${maxRetries} attempts`);
};
```

---

## Технические детали

### Глобальное состояние

Все реактивные переменные объявлены **вне функции композабла**, что обеспечивает глобальное состояние:

```typescript
const isLoading = ref(false);
const currentTranslations = ref<AudienceSwitcherApiResponse | null>(null);
const loadError = ref<string | null>(null);
```

**Преимущества:**

- Единое состояние для всех компонентов
- Отсутствие дублирования запросов
- Согласованность данных по всему приложению

---

### Валидация локалей

Композабл использует функцию `isValidLocale` для проверки корректности локали перед загрузкой:

```typescript
if (!isValidLocale(currentLocale)) {
  console.warn(`Invalid locale from i18n: ${currentLocale}`);
  return;
}
```

Это предотвращает ошибки при некорректных значениях локали.

---

### Computed vs Ref

Экспортируемые свойства обернуты в `computed` для предотвращения прямого изменения:

```typescript
return {
  isLoading: computed(() => isLoading.value),
  currentTranslations: computed(() => currentTranslations.value),
  // ...
};
```

Это обеспечивает read-only доступ к состоянию вне композабла.

---

## Связанная документация

- [vue-i18n](https://vue-i18n.intlify.dev/) — Библиотека интернационализации
- [apiUtils](/docs/utils/apiUtils.md) — Утилиты для работы с API
- [cacheUtils](/docs/utils/cacheUtils.md) — Утилиты кэширования
- [useSeo](/docs/composables/useSeo.md) — Похожий паттерн загрузки данных из API

---

## Отличия от других композаблов

### vs useSeo

`useSeo` загружает SEO-метаданные, `useAudienceSwitcherTranslations` — переводы UI-компонента. Оба используют схожий паттерн с кэшированием и синхронизацией с локалью.

### vs useI18n

`useI18n` — базовая система переводов из vue-i18n. `useAudienceSwitcherTranslations` — специализированный слой для динамической загрузки переводов конкретного компонента из API.
