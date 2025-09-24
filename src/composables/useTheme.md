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

---

## Импорт и использование

```typescript
import { useTheme } from "@/composables/useTheme";

const {
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

- **`isChildModeActive: Ref<boolean>`**
  Флаг активности детского режима

- **`isParentModeActive: Ref<boolean>`**
  Флаг активности родительского режима

---

### Основные методы

#### `setTheme(type: BodyMode): void`

Применяет тему напрямую, обновляет `data-theme`, сохраняет выбор в `localStorage` и синхронизирует флаги.

#### `getStoredTheme(): BodyMode | null`

Возвращает тему из `localStorage` или `null`, если её нет.

#### `initTheme(): void`

Инициализирует тему при старте приложения: извлекает её из `localStorage` и применяет.

---

### Методы для работы с флагами

#### `toggleChildFlag(): void`

Инвертирует флаг детского режима и пересчитывает тему.

#### `toggleParentFlag(): void`

Инвертирует флаг родительского режима и пересчитывает тему.

#### `toggleFlag(type: "child" | "parent"): void`

Универсальный метод переключения флагов.

---

### Вспомогательные методы

(обычно не нужны напрямую, но могут пригодиться при расширении)

- **`applyCurrentTheme()`** — вычисляет тему из комбинации флагов и применяет её.
- **`ensureAtLeastOneModeActive()`** — предотвращает ситуацию, когда оба флага выключены (в этом случае включаются оба → семейная тема).
- **`updateSwitchStatesFromTheme(theme: BodyMode)`** — выставляет флаги в соответствии с темой.

---

## Интеграция с CSS

Для применения тем можно использовать CSS-варианты (например, в Tailwind):

```css
@variant child ([data-theme="child"] &);
@variant parent ([data-theme="parent"] &);
```

`family` используется как базовая тема без атрибутов.

---

## Примеры использования

### Инициализация темы

```typescript
import { onMounted } from "vue";
import { useTheme } from "@/composables/useTheme";

const { initTheme } = useTheme();

onMounted(() => {
  initTheme();
});
```

---

### Переключатель тем с флагами

```vue
<script setup lang="ts">
import { useTheme } from "@/composables/useTheme";

const {
  isChildModeActive,
  isParentModeActive,
  toggleChildFlag,
  toggleParentFlag,
} = useTheme();
</script>

<template>
  <div>
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

### Установка темы напрямую

```typescript
const { setTheme } = useTheme();

setTheme("child"); // принудительно включить детскую
setTheme("parent"); // принудительно включить родительскую
setTheme("family"); // вернуться к базовой
```

---

## Рекомендации по расширению

- Добавить валидацию значений из `localStorage`.
- Расширять список тем через `BodyMode` и соответствующую CSS-логику.
- При необходимости синхронизировать состояние между вкладками через `storage`-событие.
