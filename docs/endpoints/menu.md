# Menu Endpoint Documentation

## Обзор

Эндпоинт предоставляет структуру навигационного меню сайта Kidoo Club с поддержкой мультиязычности и настраиваемого порядка пунктов.

## URL

```
GET /api/v1/menu/{language}.json
```

### Параметры

| Параметр   | Тип    | Обязательный | Описание               |
| ---------- | ------ | ------------ | ---------------------- |
| `language` | string | Да           | Код языка (ru, de, en) |

## Формат ответа

```json
{
  "language": "string",
  "menu": [
    {
      "id": "string",
      "title": "string",
      "url": "string",
      "order": "number"
    }
  ]
}
```

### Поля ответа

| Поле           | Тип    | Описание                             |
| -------------- | ------ | ------------------------------------ |
| `language`     | string | Код языка ответа                     |
| `menu`         | array  | Массив пунктов меню                  |
| `menu[].id`    | string | Уникальный идентификатор пункта меню |
| `menu[].title` | string | Отображаемый текст пункта меню       |
| `menu[].url`   | string | URL или якорь для навигации          |
| `menu[].order` | number | Порядок отображения (по возрастанию) |

## Примеры

### Запрос

```http
GET /api/v1/menu/ru.json
```

### Ответ

```json
{
  "language": "ru",
  "menu": [
    {
      "id": "home",
      "title": "Главная",
      "url": "#home",
      "order": 1
    },
    {
      "id": "services",
      "title": "Услуги",
      "url": "#services",
      "order": 2
    },
    {
      "id": "portfolio",
      "title": "Портфолио",
      "url": "#portfolio",
      "order": 3
    },
    {
      "id": "contact",
      "title": "Связаться с нами",
      "url": "#contact",
      "order": 4
    }
  ]
}
```

## TypeScript типизация

```typescript
interface MenuItem {
  id: string;
  title: string;
  url: string;
  order: number;
}

interface MenuResponse {
  language: string;
  menu: MenuItem[];
}
```

## Логика навигации

### Типы URL

Эндпоинт поддерживает различные типы навигации:

| Тип           | Пример                | Описание                         |
| ------------- | --------------------- | -------------------------------- |
| Якорь         | `#home`               | Прокрутка к элементу на странице |
| Внутренний    | `/about`              | Роутинг внутри приложения        |
| Внешний       | `https://example.com` | Внешние ссылки                   |
| Относительный | `./contact`           | Относительные пути               |

### Рекомендуемая обработка

```javascript
const handleNavigation = (menuItem) => {
  const { url } = menuItem;

  if (url.startsWith("#")) {
    // Якорная навигация
    scrollToAnchor(url);
  } else if (url.startsWith("/")) {
    // Внутренняя навигация (Vue Router)
    router.push(url);
  } else if (url.startsWith("http")) {
    // Внешняя ссылка
    window.open(url, "_blank");
  } else {
    // Относительная навигация
    router.push(url);
  }
};
```

## Мультиязычность

Структура меню идентична для всех языков, различаются только заголовки:

### Соответствие пунктов меню

| ID          | Русский          | Немецкий         | Английский |
| ----------- | ---------------- | ---------------- | ---------- |
| `home`      | Главная          | Startseite       | Home       |
| `services`  | Услуги           | Dienstleistungen | Services   |
| `portfolio` | Портфолио        | Portfolio        | Portfolio  |
| `contact`   | Связаться с нами | Kontakt          | Contact Us |

## Валидация данных

Рекомендуемая схема валидации:

```javascript
const validateMenuItem = (item) => {
  const errors = [];

  if (!item.id || typeof item.id !== "string") {
    errors.push("ID is required and must be a string");
  }

  if (!item.title || typeof item.title !== "string") {
    errors.push("Title is required and must be a string");
  }

  if (!item.url || typeof item.url !== "string") {
    errors.push("URL is required and must be a string");
  }

  if (typeof item.order !== "number" || item.order < 1) {
    errors.push("Order must be a positive number");
  }

  return errors;
};
```

## Возможные ошибки

| Код              | Описание          | Решение                                     |
| ---------------- | ----------------- | ------------------------------------------- |
| 404              | Файл не найден    | Проверить поддерживаемые языки (ru, de, en) |
| JSON Parse Error | Некорректный JSON | Проверить синтаксис файла                   |
| Network Error    | Проблема сети     | Проверить доступность статичных файлов      |

---

_Файл: `public/api/v1/menu/{language}.json`_
