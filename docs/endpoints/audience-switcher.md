# Audience Switcher Endpoint Documentation

## Обзор

Эндпоинт предоставляет текстовый контент для блока **Audience Switcher** (выбор аудитории) на сайте.
Используется для отображения локализованных заголовков и описаний, помогающих пользователю выбрать свою роль (дети, родители, семья и т.д.).

Поддерживается мультиязычность через JSON-файлы, хранящиеся в статике.

---

## URL

```
GET /api/v1/audience-switcher/{language}.json
```

---

## Параметры

| Параметр   | Тип    | Обязательный | Описание               |
| ---------- | ------ | ------------ | ---------------------- |
| `language` | string | Да           | Код языка (ru, de, en) |

---

## Формат ответа

```json
{
  "language": "string",
  "introduceYourself": {
    "title": "string",
    "subtitle": "string",
    "description": "string"
  }
}
```

---

## Поля ответа

### Корневые поля

| Поле       | Тип    | Описание         |
| ---------- | ------ | ---------------- |
| `language` | string | Код языка ответа |

### `introduceYourself`

| Поле          | Тип    | Описание                                                              |
| ------------- | ------ | --------------------------------------------------------------------- |
| `title`       | string | Основной заголовок блока                                              |
| `subtitle`    | string | Подзаголовок (уточняющий вопрос или пояснение)                        |
| `description` | string | Описание, объясняющее зачем выбирать роль и как это влияет на контент |

---

## Примеры

### Запрос

```http
GET /api/v1/audience-switcher/ru.json
```

### Ответ

```json
{
  "language": "ru",
  "introduceYourself": {
    "title": "Представьтесь",
    "subtitle": "Кто вы сегодня на нашей странице?",
    "description": "Выберите свою роль, чтобы мы показали вам наиболее подходящий контент – для детей, для родителей или для всей семьи."
  }
}
```

---

## TypeScript типизация

```ts
interface IntroduceYourself {
  title: string;
  subtitle: string;
  description: string;
}

interface AudienceSwitcherResponse {
  language: string;
  introduceYourself: IntroduceYourself;
}
```

---

## Назначение и логика использования

### UI-назначение

Данные используются для:

- Заголовка блока выбора аудитории
- Объяснения пользователю, зачем нужен выбор роли
- Улучшения персонализации контента на сайте

### Рекомендуемая логика на фронтенде

```ts
fetch(`/api/v1/audience-switcher/${lang}.json`)
  .then((res) => res.json())
  .then((data) => {
    setTitle(data.introduceYourself.title);
    setSubtitle(data.introduceYourself.subtitle);
    setDescription(data.introduceYourself.description);
  });
```

---

## Мультиязычность

Структура JSON **одинакова для всех языков**, меняются только текстовые значения.

### Пример соответствия языков

| Ключ          | Русский                           | Английский                     | Немецкий                              |
| ------------- | --------------------------------- | ------------------------------ | ------------------------------------- |
| `title`       | Представьтесь                     | Introduce Yourself             | Stellen Sie sich vor                  |
| `subtitle`    | Кто вы сегодня на нашей странице? | Who are you today on our site? | Wer sind Sie heute auf unserer Seite? |
| `description` | Выберите свою роль…               | Choose your role…              | Wählen Sie Ihre Rolle…                |

---

## Валидация данных

Рекомендуемая схема валидации:

```ts
const validateAudienceSwitcher = (data) => {
  const errors = [];

  if (!data.language || typeof data.language !== "string") {
    errors.push("language must be a string");
  }

  const intro = data.introduceYourself;
  if (!intro) {
    errors.push("introduceYourself is required");
    return errors;
  }

  ["title", "subtitle", "description"].forEach((field) => {
    if (!intro[field] || typeof intro[field] !== "string") {
      errors.push(`${field} must be a non-empty string`);
    }
  });

  return errors;
};
```

---

## Возможные ошибки

| Код              | Описание          | Решение                                     |
| ---------------- | ----------------- | ------------------------------------------- |
| 404              | Файл не найден    | Проверить поддерживаемые языки (ru, de, en) |
| JSON Parse Error | Некорректный JSON | Проверить синтаксис файла                   |
| Network Error    | Проблема сети     | Проверить доступность статичных файлов      |

---

## Расположение файла

```
public/api/v1/audience-switcher/{language}.json
```
