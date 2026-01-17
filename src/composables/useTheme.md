# useTheme

Композабл для централизованного управления цветовыми темами в Vue.js-приложении.
Поддерживает переключение режимов оформления (**детский, семейный, родительский**) с сохранением выбора пользователя и удобным управлением через реактивные флаги.

---

## Обзор

`useTheme` управляет атрибутом `data-theme` у корневого элемента (`<html>`), что позволяет применять разные CSS-варианты без перезагрузки страницы.
Тема восстанавливается из `localStorage` между сессиями и синхронизируется с двумя реактивными флагами:

- `isChildModeActive`
- `isParentModeActive`

Комбинации этих флагов определяют текущую тему:

| isChild | isParent | Активная тема |
| ------- | -------- | ------------- |
| ✅      | ❌       | `child`       |
| ❌      | ✅       | `parent`      |
| ✅      | ✅       | `family`      |

**Важно:** Композабл также экспортирует переменную `currentTheme`, которая используется системой динамической загрузки компонентов для получения актуальной конфигурации layout.

---

## Импорт и использование

```typescript
import { useTheme } from "@/composables/useTheme";

const {
  currentTheme,
  isChildModeActive,
  isParentModeActive,
  setTheme,
  initTheme,
  getStoredTheme,
  toggleChildFlag,
  toggleParentFlag,
} = useTheme();
```

---

## Типы данных

Композабл работает с типом `BodyMode`:

```typescript
type BodyMode = "child" | "family" | "parent";
```

---

## API

### Состояния

- **`currentTheme: Ref<BodyMode>`**
  Реактивная переменная, хранящая текущую активную тему. Используется для координации с системой динамической загрузки компонентов. При изменении темы через `setTheme()` или переключение флагов автоматически обновляется.

  **Значение по умолчанию:** `"family"`

- **`isChildModeActive: Ref<boolean>`**
  Флаг активности детского режима

- **`isParentModeActive: Ref<boolean>`**
  Флаг активности родительского режима

---

### Основные методы

#### `setTheme(type: BodyMode): void`

Применяет тему напрямую, обновляет `data-theme`, сохраняет выбор в `localStorage`, синхронизирует флаги и обновляет `currentTheme`.

**Пример:**

```typescript
setTheme("child"); // Устанавливает детскую тему
// currentTheme.value автоматически обновится на "child"
```

#### `getStoredTheme(): BodyMode | null`

Возвращает тему из `localStorage` или `null`, если её нет.

**Пример:**

```typescript
const saved = getStoredTheme();
if (saved) {
  console.log(`Сохранённая тема: ${saved}`);
}
```

#### `initTheme(): void`

Инициализирует тему при старте приложения: извлекает её из `localStorage`, применяет и обновляет `currentTheme`. Если сохранённой темы нет, использует значение по умолчанию (`"family"`).

**Типичное использование:**

```typescript
import { onMounted } from "vue";
import { useTheme } from "@/composables/useTheme";

const { initTheme, currentTheme } = useTheme();

onMounted(() => {
  initTheme();
  // После инициализации currentTheme содержит актуальную тему
});
```

---

### Методы для работы с флагами

#### `toggleChildFlag(): void`

Инвертирует флаг детского режима, пересчитывает тему и обновляет `currentTheme`.

#### `toggleParentFlag(): void`

Инвертирует флаг родительского режима, пересчитывает тему и обновляет `currentTheme`.

#### `toggleFlag(type: "child" | "parent"): void`

Универсальный метод переключения флагов.

**Примечание:** При переключении флагов `currentTheme` автоматически обновляется в соответствии с новой комбинацией флагов.

---

### Вспомогательные методы

(обычно не нужны напрямую, но могут пригодиться при расширении)

- **`applyCurrentTheme()`** — вычисляет тему из комбинации флагов, применяет её и обновляет `currentTheme`.
- **`ensureAtLeastOneModeActive()`** — предотвращает ситуацию, когда оба флага выключены (в этом случае включаются оба → семейная тема).
- **`updateSwitchStatesFromTheme(theme: BodyMode)`** — выставляет флаги в соответствии с темой и обновляет `currentTheme`.

---

## Интеграция с CSS

Для применения тем можно использовать CSS-варианты (например, в Tailwind):

```css
@variant child ([data-theme="child"] &);
@variant parent ([data-theme="parent"] &);
```

`family` используется как базовая тема без атрибутов.

---

## Интеграция с системой динамической загрузки компонентов

Переменная `currentTheme` служит ключом для загрузки соответствующей конфигурации layout через композабл `useLayout`:

```typescript
import { useTheme } from "@/composables/useTheme";
import { useLayout } from "@/composables/layout";

const { currentTheme, setTheme } = useTheme();
const { fetchConfigs } = useLayout();

// При инициализации
onMounted(async () => {
  initTheme();
  await fetchConfigs(currentTheme.value);
});

// При смене темы
const handleThemeChange = async (theme: BodyMode) => {
  setTheme(theme);
  await fetchConfigs(currentTheme.value);
};
```

Такая интеграция обеспечивает синхронизацию визуального оформления и набора отображаемых компонентов.

---

## Примеры использования

### Инициализация темы с загрузкой конфигурации

```typescript
import { onMounted } from "vue";
import { useTheme } from "@/composables/useTheme";
import { useLayout } from "@/composables/layout";

const { currentTheme, initTheme } = useTheme();
const { fetchConfigs } = useLayout();

onMounted(async () => {
  // Восстанавливаем тему
  initTheme();

  // Загружаем конфигурацию компонентов для текущей темы
  await fetchConfigs(currentTheme.value);
});
```

---

### Переключатель тем с флагами

```vue
<script setup lang="ts">
import { useTheme } from "@/composables/useTheme";

const {
  currentTheme,
  isChildModeActive,
  isParentModeActive,
  toggleChildFlag,
  toggleParentFlag,
} = useTheme();
</script>

<template>
  <div>
    <p>Текущая тема: {{ currentTheme }}</p>

    <button @click="toggleChildFlag">
      Детский ({{ isChildModeActive ? "вкл" : "выкл" }})
    </button>
    <button @click="toggleParentFlag">
      Родительский ({{ isParentModeActive ? "вкл" : "выкл" }})
    </button>
  </div>
</template>
```

---

### Установка темы напрямую с обновлением layout

```typescript
import { useTheme } from "@/composables/useTheme";
import { useLayout } from "@/composables/layout";

const { currentTheme, setTheme } = useTheme();
const { fetchConfigs } = useLayout();

const changeToChildTheme = async () => {
  setTheme("child"); // currentTheme.value теперь "child"
  await fetchConfigs(currentTheme.value); // Загружаем конфигурацию для детской темы
};

const changeToParentTheme = async () => {
  setTheme("parent");
  await fetchConfigs(currentTheme.value);
};

const changeToFamilyTheme = async () => {
  setTheme("family");
  await fetchConfigs(currentTheme.value);
};
```

---

### Реактивное отслеживание смены темы

```typescript
import { watch } from "vue";
import { useTheme } from "@/composables/useTheme";

const { currentTheme } = useTheme();

watch(currentTheme, (newTheme, oldTheme) => {
  console.log(`Тема изменена: ${oldTheme} → ${newTheme}`);
  // Здесь можно выполнить дополнительные действия при смене темы
});
```

---

## Рекомендации по расширению

- **Валидация данных из localStorage:** Добавить проверку, что сохранённое значение соответствует типу `BodyMode`, чтобы избежать ошибок при повреждении данных.

- **Синхронизация между вкладками:** Использовать событие `storage` для синхронизации темы между разными вкладками браузера:

  ```typescript
  window.addEventListener("storage", (e) => {
    if (e.key === THEME_KEY && e.newValue) {
      setTheme(e.newValue as BodyMode);
    }
  });
  ```

- **Расширение списка тем:** При добавлении новых тем обновить тип `BodyMode`, логику в `applyCurrentTheme()` и соответствующие CSS-стили.

- **Анимация переходов:** Добавить CSS-transitions для плавной смены тем, используя класс на `<html>` элементе.

- **Координация с API:** При смене темы можно отправлять информацию на сервер для сохранения в профиле пользователя (если есть аутентификация).

---

## Технические детали

### Хранение данных

Тема сохраняется в `localStorage` под ключом, определённым константой `THEME_KEY`. Это позволяет сохранять выбор пользователя между сессиями.

### Реактивность

Все экспортируемые переменные являются реактивными (`Ref<T>`), что обеспечивает автоматическое обновление UI при изменении темы. Переменная `currentTheme` особенно важна для интеграции с другими частями приложения, которым нужно знать актуальную тему.

### Приоритет установки темы

При конфликте между флагами и прямой установкой темы через `setTheme()`:

1. Флаги обновляются в соответствии с установленной темой
2. `currentTheme` всегда отражает реальное состояние `data-theme` атрибута
3. Изменения сохраняются в `localStorage`

---

## Связанная документация

- [useLayout](/docs/composables/useLayout.md) - Система динамической загрузки компонентов
- [useDynamicComponents](/docs/composables/useDynamicComponents.md) - Автоматическое обнаружение компонентов
- [useLayoutConfig](/docs/composables/useLayoutConfig.md) - Управление конфигурацией layout
