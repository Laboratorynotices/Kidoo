# useTheme

Композабл для централизованного управления цветовыми темами в Vue.js-приложении с автоматическим сохранением пользовательских предпочтений.

## Обзор

`useTheme` позволяет переключать режимы оформления интерфейса (детский, семейный, родительский), управляя атрибутом `data-theme` на корневом HTML-элементе (`<html>`). Это обеспечивает применение соответствующих CSS-стилей без перезагрузки страницы и с возможностью восстановления выбора пользователя между сессиями.

## Импорт и использование

```typescript
import { useTheme } from "@/composables/useTheme";

const { setTheme, initTheme, getStoredTheme } = useTheme();
```

## Типы данных

Композабл работает с типом `BodyMode`:

```typescript
type BodyMode = "child" | "family" | "parent";
```

- `child` — детский режим
- `family` — семейный режим (базовый, не требует установки атрибута `data-theme`)
- `parent` — родительский режим

## API методы

### `setTheme(type: BodyMode): void`

Устанавливает тему приложения и сохраняет выбор в `localStorage`.

**Алгоритм работы:**

1. Получает ссылку на `<html>`.
2. Очищает атрибут `data-theme`.
3. Устанавливает `data-theme="child"` или `data-theme="parent"`.
   Для семейного режима атрибут не добавляется.
4. Сохраняет выбранную тему в `localStorage` по ключу `"palette"`.

**Пример:**

```typescript
setTheme("child"); // активировать детскую тему
setTheme("parent"); // активировать родительскую тему
setTheme("family"); // вернуться к базовой теме
```

---

### `getStoredTheme(): BodyMode | null`

Возвращает тему, сохранённую в `localStorage`, или `null`, если её нет.

**Особенности:**

- Данные извлекаются напрямую без встроенной валидации.
- Если в `localStorage` записано некорректное значение, оно всё равно будет приведено к `BodyMode | null`.

**Пример:**

```typescript
const theme = getStoredTheme();
console.log(theme); // "child" | "family" | "parent" | null
```

---

### `initTheme(): void`

Инициализирует тему при загрузке приложения.

**Алгоритм работы:**

1. Извлекает тему через `getStoredTheme()`.
2. Если тема найдена, вызывает `setTheme()`.
3. Если нет — остаётся базовая (`family`).

**Рекомендуемое размещение:**

```typescript
import { onMounted } from "vue";
import { useTheme } from "@/composables/useTheme";

const { initTheme } = useTheme();

onMounted(() => {
  initTheme();
});
```

---

## Интеграция с CSS

Для работы с темами требуется настройка CSS-вариантов (например, с Tailwind):

```css
@variant child ([data-theme="child"] &);
@variant parent ([data-theme="parent"] &);
```

Семейная тема (`family`) применяется как базовая, без атрибутов.

---

## Примеры использования

### Компонент с переключателем тем

```vue
<script setup lang="ts">
import { onMounted } from "vue";
import { useTheme } from "@/composables/useTheme";

const { setTheme, initTheme } = useTheme();

onMounted(() => {
  initTheme();
});
</script>

<template>
  <div>
    <button @click="setTheme('child')">Детская</button>
    <button @click="setTheme('family')">Семейная</button>
    <button @click="setTheme('parent')">Родительская</button>
  </div>
</template>
```

### Получение текущей темы

```typescript
const { getStoredTheme } = useTheme();

const current = getStoredTheme();
console.log(current); // "child" | "family" | "parent" | null
```

---

## Рекомендации по расширению

- **Валидация localStorage**: стоит добавить проверку на корректность значений перед применением.
- **Новые темы**: для расширения достаточно обновить `BodyMode`, CSS-варианты и логику в `setTheme()`.
- **Синхронизация вкладок**: текущая версия не отслеживает изменения темы в других вкладках.

---

## Ограничения

- Требуется поддержка `localStorage`.
- При повреждённых данных в `localStorage` может вернуться некорректное значение — рекомендуется добавить дополнительную проверку.
