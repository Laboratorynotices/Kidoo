# SEO Utils Documentation

Утилитарный модуль для управления SEO-данными в многоязычном приложении Vue.js с поддержкой Vue I18n.

## Обзор

Модуль `seoUtils.ts` предоставляет функции для динамического обновления мета-тегов и других SEO-элементов при изменении языка интерфейса. Основная цель - обеспечить корректное отображение локализованных SEO-данных для поисковых систем.

## Импорт

```typescript
import { updateSEO, updateSEOWithKeys, updateMetaTag } from "@/utils/seoUtils";
```

## Константы

### SEO_KEYS

```typescript
const SEO_KEYS = {
  TITLE: "seo.title",
  DESCRIPTION: "seo.description",
  KEYWORDS: "seo.keywords",
} as const;
```

Константы для стандартных ключей переводов SEO-данных в системе локализации.

## Функции

### updateMetaTag

```typescript
updateMetaTag(name: string, content: string): void
```

Обновляет содержимое существующего мета-тега или создает новый, если тег отсутствует в DOM.

**Параметры:**

- `name` (string) - имя мета-тега (значение атрибута `name`)
- `content` (string) - содержимое мета-тега (значение атрибута `content`)

**Возвращает:** void

**Пример использования:**

```typescript
updateMetaTag("description", "Новое описание страницы");
updateMetaTag("author", "Kidoo Development Team");
```

**Особенности:**

- Автоматически создает мета-тег, если он не существует
- Безопасно работает с любыми именами мета-тегов
- Не вызывает ошибок при повторных вызовах

### updateSEO

```typescript
updateSEO(): void
```

Обновляет все основные SEO-элементы страницы на основе текущих переводов i18n. Использует стандартные ключи из константы `SEO_KEYS`.

**Параметры:** отсутствуют

**Возвращает:** void

**Обновляемые элементы:**

- `document.title` - заголовок страницы
- `<meta name="description">` - описание страницы
- `<meta name="keywords">` - ключевые слова
- `<html lang="">` - атрибут языка документа

**Пример использования:**

```typescript
// Обычно вызывается при смене языка
i18n.global.locale.value = "de";
updateSEO(); // Обновит все SEO-данные на немецкий язык
```

**Зависимости:**

- Требует инициализированного объекта `i18n` из `@/i18n`
- Использует переводы с ключами `seo.title`, `seo.description`, `seo.keywords`

### updateSEOWithKeys

```typescript
updateSEOWithKeys(
  titleKey?: string,
  descriptionKey?: string,
  keywordsKey?: string
): void
```

Расширенная версия `updateSEO` с возможностью указания пользовательских ключей переводов. Полезна для страниц с индивидуальными SEO-данными.

**Параметры:**

- `titleKey` (string, опциональный) - ключ перевода для заголовка. По умолчанию: `"seo.title"`
- `descriptionKey` (string, опциональный) - ключ перевода для описания. По умолчанию: `"seo.description"`
- `keywordsKey` (string, опциональный) - ключ перевода для ключевых слов. По умолчанию: `"seo.keywords"`

**Возвращает:** void

**Пример использования:**

```typescript
// Для главной страницы с стандартными ключами
updateSEOWithKeys();

// Для страницы "О нас" с индивидуальными SEO-данными
updateSEOWithKeys(
  "pages.about.seo.title",
  "pages.about.seo.description",
  "pages.about.seo.keywords",
);

// Обновить только заголовок и описание
updateSEOWithKeys("custom.title", "custom.description");
```

## Интеграция с системой локализации

### Автоматическое обновление при смене языка

```typescript
// В файле src/i18n.ts
import { updateSEO } from "@/utils/seoUtils";

export async function setLocale(locale: AvailableLocale) {
  if (!i18n.global.availableLocales.includes(locale)) {
    await loadLocaleMessages(locale);
  }
  i18n.global.locale.value = locale;
  localStorage.setItem("locale", locale);

  // Автоматическое обновление SEO при смене языка
  updateSEO();
}
```

### Инициализация при загрузке приложения

```typescript
// В файле src/App.vue
import { onMounted } from "vue";
import { updateSEO } from "@/utils/seoUtils";

export default {
  setup() {
    onMounted(() => {
      // Обновление SEO после монтирования приложения
      updateSEO();
    });
  },
};
```

## Требования к файлам локализации

Для корректной работы модуля в файлах переводов должны присутствовать следующие ключи:

```json
{
  "seo.title": "Заголовок страницы",
  "seo.description": "Описание страницы для поисковых систем",
  "seo.keywords": "ключевые, слова, через, запятую"
}
```

## Примеры использования

### Базовое использование

```typescript
import { updateSEO } from "@/utils/seoUtils";

// Простое обновление всех SEO-данных
updateSEO();
```

### Индивидуальные SEO для разных страниц

```typescript
import { updateSEOWithKeys } from "@/utils/seoUtils";

// Роутер-хуки для обновления SEO при навигации
router.afterEach((to) => {
  if (to.name === "home") {
    updateSEO(); // Стандартные ключи
  } else if (to.name === "about") {
    updateSEOWithKeys(
      "pages.about.title",
      "pages.about.description",
      "pages.about.keywords",
    );
  } else if (to.name === "contact") {
    updateSEOWithKeys(
      "pages.contact.title",
      "pages.contact.description",
      // keywords остается стандартным
    );
  }
});
```

### Ручное управление мета-тегами

```typescript
import { updateMetaTag } from "@/utils/seoUtils";

// Добавление дополнительных мета-тегов
updateMetaTag("author", "Kidoo Club");
updateMetaTag("robots", "index,follow");
updateMetaTag("viewport", "width=device-width, initial-scale=1");

// Обновление Open Graph тегов (с property вместо name)
// Примечание: для OG тегов нужна отдельная функция
```

## Ограничения и особенности

1. **Клиентская работа только**: Модуль работает только в браузере и требует наличия объекта `document`

2. **Зависимость от i18n**: Функции `updateSEO` и `updateSEOWithKeys` требуют инициализированного объекта Vue I18n

3. **Отсутствие fallback**: При отсутствии переводов будут отображаться сами ключи переводов

4. **Open Graph теги**: Модуль не поддерживает теги с атрибутом `property` (например, `og:title`), только с `name`

5. **Синхронная работа**: Все операции выполняются синхронно, что может вызвать небольшие задержки при частых обновлениях

## Совместимость

- **Vue.js**: 3.0+
- **Vue I18n**: 9.0+
- **TypeScript**: 4.0+
- **Браузеры**: Все современные браузеры с поддержкой ES6+

## Связанные файлы

- `src/i18n.ts` - конфигурация интернационализации
- `src/locales/*.json` - файлы переводов
