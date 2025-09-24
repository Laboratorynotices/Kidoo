# SEO Endpoint Documentation

## Обзор

Эндпоинт предоставляет SEO метаданные для страниц сайта Kidoo Club, включая заголовки, описания и ключевые слова, оптимизированные для поисковых систем.

## URL

```
GET /api/v1/seo/{language}.json
```

### Параметры

| Параметр   | Тип    | Обязательный | Описание               |
| ---------- | ------ | ------------ | ---------------------- |
| `language` | string | Да           | Код языка (ru, de, en) |

## Формат ответа

```json
{
  "language": "string",
  "seo": {
    "title": "string",
    "description": "string",
    "keywords": "string"
  }
}
```

### Поля ответа

| Поле              | Тип    | Описание                                    |
| ----------------- | ------ | ------------------------------------------- |
| `language`        | string | Код языка ответа                            |
| `seo`             | object | Объект с SEO данными                        |
| `seo.title`       | string | Заголовок страницы для `<title>` тега       |
| `seo.description` | string | Описание для `<meta name="description">`    |
| `seo.keywords`    | string | Ключевые слова для `<meta name="keywords">` |

## Примеры

### Запрос

```http
GET /api/v1/seo/ru.json
```

### Ответ

```json
{
  "language": "ru",
  "seo": {
    "title": "Сеть детских спортивных клубов в Германии, Австрии и Швейцарии | Kidoo Club",
    "description": "Kidoo Club — это круглогодичный спорт для детей 4–14 лет. Футбол, плавание, лыжи, скалолазание, рафтинг и десятки других активностей. Один абонемент — сотни возможностей в Германии, Австрии и Швейцарии.",
    "keywords": "детский спортивный клуб Германия Австрия Швейцария, спорт для детей, секции для детей, детский фитнес, детский футбол, детские лыжи, активный отдых для детей, клуб для детей DACH"
  }
}
```

## TypeScript типизация

```typescript
interface SEOResponse {
  language: string;
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
}
```

## Мультиязычность

SEO данные адаптированы для каждого региона:

### Русский (ru)

- Ориентирован на русскоязычных пользователей
- Подчеркивает присутствие в DACH регионе

### Немецкий (de)

- Адаптирован для немецкоговорящих стран
- Акцент на местных особенностях

### Английский (en)

- Международная аудитория
- Универсальные формулировки

## SEO Рекомендации

### Оптимальная длина

- **Title**: 50-60 символов
- **Description**: 150-160 символов
- **Keywords**: 10-15 ключевых фраз

### Рекомендуемое применение

```html
<!DOCTYPE html>
<html lang="ru">
  <head>
    <title>{{ seoData.title }}</title>
    <meta name="description" content="{{ seoData.description }}" />
    <meta name="keywords" content="{{ seoData.keywords }}" />

    <!-- Open Graph для социальных сетей -->
    <meta property="og:title" content="{{ seoData.title }}" />
    <meta property="og:description" content="{{ seoData.description }}" />
    <meta property="og:type" content="website" />
  </head>
</html>
```

## Возможные ошибки

| Код           | Описание       | Решение                                     |
| ------------- | -------------- | ------------------------------------------- |
| 404           | Файл не найден | Проверить поддерживаемые языки (ru, de, en) |
| Network Error | Проблема сети  | Проверить доступность статичных файлов      |

---

_Файл: `public/api/v1/seo/{language}.json`_
