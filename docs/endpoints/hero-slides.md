# Hero Slides Endpoint Documentation

## Обзор

Эндпоинт предоставляет список слайдов для секции Hero сайта Kidoo Club с поддержкой мультиязычности.

## URL

```
GET /api/v1/hero-slides/{language}.json
```

### Параметры

| Параметр   | Тип    | Обязательный | Описание               |
| ---------- | ------ | ------------ | ---------------------- |
| `language` | string | Да           | Код языка (ru, de, en) |

## Формат ответа

```json
{
  "language": "string",
  "slides": [
    {
      "image": "string",
      "title": "string",
      "name": "string",
      "description": "string",
      "btn": {
        "text": "string",
        "link": "string"
      }
    }
  ]
}
```

### Поля ответа

| Поле                   | Тип    | Описание                      |
| ---------------------- | ------ | ----------------------------- |
| `language`             | string | Код языка ответа              |
| `slides`               | array  | Массив слайдов Hero секции    |
| `slides[].image`       | string | Путь к изображению слайда     |
| `slides[].title`       | string | Основной заголовок слайда     |
| `slides[].name`        | string | Название/подзаголовок слайда  |
| `slides[].description` | string | Описание слайда               |
| `slides[].btn`         | object | Объект кнопки слайда          |
| `slides[].btn.text`    | string | Текст кнопки                  |
| `slides[].btn.link`    | string | Ссылка для перехода по кнопке |

## Примеры

### Запрос

```http
GET /api/v1/hero-slides/ru.json
```

### Ответ

```json
{
  "language": "ru",
  "slides": [
    {
      "image": "hero1.jpg",
      "title": "Активные игры на свежем воздухе",
      "name": "Футбольные забавы",
      "description": "Присоединяйтесь к нашим веселым футбольным занятиям на зеленой лужайке! Развиваем командный дух, физическую активность и радость движения.",
      "btn": {
        "text": "Записаться на занятие",
        "link": "#contact"
      }
    },
    {
      "image": "hero2.jpg",
      "title": "Зимние приключения в горах",
      "name": "Лыжные занятия",
      "description": "Обучаем детей катанию на горных лыжах в безопасной и дружелюбной атмосфере. Профессиональные инструкторы и современное оборудование.",
      "btn": {
        "text": "Узнать расписание",
        "link": "#services"
      }
    },
    {
      "image": "hero3.jpg",
      "title": "Зимние радости для малышей",
      "name": "Катание на санках",
      "description": "Безопасное и увлекательное катание на санках для самых маленьких участников. Создаем незабываемые зимние воспоминания!",
      "btn": {
        "text": "Присоединиться",
        "link": "#portfolio"
      }
    }
  ]
}
```

## TypeScript типизация

```typescript
interface SlideButton {
  text: string;
  link: string;
}

interface Slide {
  image: string;
  title: string;
  name: string;
  description: string;
  btn: SlideButton;
}

interface HeroSlidesResponse {
  language: string;
  slides: Slide[];
}
```

## Возможные ошибки

| Код              | Описание          | Решение                                     |
| ---------------- | ----------------- | ------------------------------------------- |
| 404              | Файл не найден    | Проверить поддерживаемые языки (ru, de, en) |
| JSON Parse Error | Некорректный JSON | Проверить синтаксис файла                   |
| Network Error    | Проблема сети     | Проверить доступность статичных файлов      |

---

_Файлы:_

- `public/api/v1/hero-slides/{language}.json`
