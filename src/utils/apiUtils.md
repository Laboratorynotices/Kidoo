# API Utils

Универсальная утилитарная библиотека для выполнения HTTP-запросов в приложении. Предоставляет типизированные функции-обёртки над стандартным Fetch API с централизованной обработкой ошибок и единообразным интерфейсом для всех API-вызовов.

## Обзор

Модуль `apiUtils.ts` создаёт абстракцию над нативным `fetch` API, добавляя типизацию TypeScript, расширенную обработку ошибок и стандартизированные настройки для всех HTTP-запросов в приложении. Это обеспечивает консистентность в работе с серверным API и упрощает отладку сетевых операций.

## Архитектурные принципы

### Централизованная конфигурация

Все API-запросы используют единый базовый URL, что позволяет легко переключаться между development и production окружениями.

### Типобезопасность

Каждый запрос типизируется через Generic-параметры TypeScript, обеспечивая проверку типов на этапе компиляции.

### Расширенная обработка ошибок

Создаются специализированные объекты ошибок с дополнительной информацией о HTTP-статусах и типах проблем.

## Импорт

```typescript
import { apiRequest, apiGet, getApiUrl, type ApiError } from "@/utils/apiUtils";
```

## Константы

### API_BASE_URL

```typescript
const API_BASE_URL = "/api/v1";
```

Базовый URL для всех API-запросов. При переходе к production API требуется изменить только эту константу. Примеры полных URL:

- `/api/v1/seo/ru.json`
- `/api/v1/menu/de.json`
- `/api/v1/users/profile`

## Типы данных

### ApiError

```typescript
export interface ApiError extends Error {
  status: number;
  statusText: string;
}
```

Расширенный интерфейс ошибки, который содержит дополнительную информацию об HTTP-ответе сервера. Наследует все свойства стандартного объекта `Error` и добавляет:

- `status` - HTTP-статус код (404, 500, 401 и т.д.)
- `statusText` - текстовое описание статуса ("Not Found", "Internal Server Error" и т.д.)

Это позволяет вызывающему коду принимать разные решения в зависимости от типа ошибки.

## Функции

### createApiError

```typescript
const createApiError = (
  status: number,
  statusText: string,
  message: string,
): ApiError
```

**Внутренняя функция** для создания объектов ошибок с расширенной информацией. Не экспортируется из модуля, используется только внутри `apiRequest`.

**Параметры:**

- `status` - HTTP-статус код
- `statusText` - текстовое описание статуса
- `message` - детальное сообщение об ошибке

**Возвращает:** ApiError - объект ошибки с дополнительными свойствами

### getApiUrl

```typescript
export const getApiUrl = (endpoint: string): string
```

Формирует полный URL для API-запроса, объединяя базовый URL с указанным эндпоинтом.

**Параметры:**

- `endpoint` (string) - относительный путь к API-ресурсу (без ведущего слеша)

**Возвращает:** string - полный URL для запроса

**Примеры использования:**

```typescript
const seoUrl = getApiUrl("seo/ru.json");
// Результат: "/api/v1/seo/ru.json"

const userUrl = getApiUrl("users/123");
// Результат: "/api/v1/users/123"

// Неправильно - не добавляйте ведущий слеш
const wrongUrl = getApiUrl("/seo/ru.json");
// Результат: "/api/v1//seo/ru.json" (двойной слеш)
```

### apiRequest

```typescript
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T>
```

Центральная функция для выполнения HTTP-запросов. Является типизированной обёрткой над `fetch` с автоматической обработкой ошибок и стандартизированными заголовками.

**Generic-параметры:**

- `T` - тип ожидаемых данных в ответе

**Параметры:**

- `endpoint` (string) - относительный путь к API-ресурсу
- `options` (RequestInit, опциональный) - дополнительные опции для fetch (методы, заголовки, тело запроса и т.д.)

**Возвращает:** Promise<T> - промис с типизированными данными ответа

**Автоматические настройки:**

- Заголовок `Content-Type: application/json` добавляется по умолчанию
- Пользовательские заголовки объединяются с стандартными
- Автоматическая проверка статуса ответа
- Парсинг JSON-ответа

**Обработка ошибок:**

Функция различает два типа ошибок:

1. **HTTP-ошибки** (статус 4xx/5xx) - создаётся `ApiError` с детальной информацией
2. **Сетевые ошибки** (отсутствие соединения, некорректный JSON) - создаётся стандартный `Error`

**Примеры использования:**

```typescript
// GET-запрос с типизацией
interface UserData {
  id: number;
  name: string;
  email: string;
}

try {
  const user = await apiRequest<UserData>("users/123");
  console.log(`Пользователь: ${user.name}`);
} catch (error) {
  if (error instanceof Error && "status" in error) {
    // Это ApiError с HTTP-информацией
    const apiError = error as ApiError;
    if (apiError.status === 404) {
      console.log("Пользователь не найден");
    } else if (apiError.status >= 500) {
      console.log("Ошибка сервера");
    }
  } else {
    // Сетевая или другая ошибка
    console.log("Проблемы с подключением");
  }
}

// POST-запрос с телом
interface CreateUserRequest {
  name: string;
  email: string;
}

const newUser = await apiRequest<UserData>("users", {
  method: "POST",
  body: JSON.stringify({ name: "John", email: "john@example.com" }),
});

// Пользовательские заголовки
const dataWithAuth = await apiRequest<any>("protected/data", {
  headers: {
    Authorization: "Bearer token123",
    "X-Custom-Header": "value",
  },
});
```

### apiGet

```typescript
export const apiGet = <T>(endpoint: string): Promise<T>
```

Удобная функция-обёртка для выполнения GET-запросов. Является сокращённой формой `apiRequest` с предустановленным методом GET.

**Generic-параметры:**

- `T` - тип ожидаемых данных в ответе

**Параметры:**

- `endpoint` (string) - относительный путь к API-ресурсу

**Возвращает:** Promise<T> - промис с типизированными данными

**Примеры использования:**

```typescript
// Простой GET-запрос
interface SeoData {
  title: string;
  description: string;
}

const seoData = await apiGet<SeoData>("seo/ru.json");

// Эквивалентно:
const seoDataLong = await apiRequest<SeoData>("seo/ru.json", { method: "GET" });
```

**Когда использовать `apiGet` vs `apiRequest`:**

- Используйте `apiGet` для простых GET-запросов без дополнительных параметров
- Используйте `apiRequest` когда нужны пользовательские заголовки, другие HTTP-методы или специальные опции

## Паттерны использования

### Типизация ответов

```typescript
// Определение интерфейсов для API-ответов
interface ApiResponse<T> {
  data: T;
  status: "success" | "error";
  message?: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
}

// Использование с типизацией
const response = await apiGet<ApiResponse<Product[]>>("products");
if (response.status === "success") {
  response.data.forEach((product) => {
    console.log(`${product.name}: $${product.price}`);
  });
}
```

### Обработка различных типов ошибок

```typescript
async function robustApiCall<T>(endpoint: string): Promise<T | null> {
  try {
    return await apiGet<T>(endpoint);
  } catch (error) {
    if (error instanceof Error && "status" in error) {
      const apiError = error as ApiError;

      switch (apiError.status) {
        case 401:
          // Перенаправить на страницу авторизации
          router.push("/login");
          break;
        case 404:
          // Показать сообщение о том, что ресурс не найден
          showNotification("Данные не найдены", "warning");
          break;
        case 500:
          // Показать сообщение о проблемах сервера
          showNotification("Проблемы на сервере, попробуйте позже", "error");
          break;
        default:
          showNotification(`Ошибка: ${apiError.message}`, "error");
      }
    } else {
      // Сетевая ошибка
      showNotification("Проверьте подключение к интернету", "error");
    }

    return null;
  }
}
```

### Создание специализированных API-функций

```typescript
// Создание модуля для работы с пользователями
export class UserAPI {
  static async getUser(id: number): Promise<UserData> {
    return apiGet<UserData>(`users/${id}`);
  }

  static async updateUser(
    id: number,
    data: Partial<UserData>,
  ): Promise<UserData> {
    return apiRequest<UserData>(`users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  static async deleteUser(id: number): Promise<void> {
    return apiRequest<void>(`users/${id}`, {
      method: "DELETE",
    });
  }
}

// Использование
const user = await UserAPI.getUser(123);
await UserAPI.updateUser(123, { name: "New Name" });
```

### Interceptors-подобный функционал

```typescript
// Обёртка для добавления авторизации
export const authenticatedRequest = async <T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> => {
  const token = localStorage.getItem("authToken");

  return apiRequest<T>(endpoint, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
};

// Обёртка для логирования запросов
export const loggedRequest = async <T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> => {
  const startTime = Date.now();
  console.log(`API Request: ${options.method || "GET"} ${getApiUrl(endpoint)}`);

  try {
    const result = await apiRequest<T>(endpoint, options);
    console.log(`API Success: ${Date.now() - startTime}ms`);
    return result;
  } catch (error) {
    console.error(`API Error: ${Date.now() - startTime}ms`, error);
    throw error;
  }
};
```

## Интеграция с другими модулями

### Использование в seoUtils

```typescript
// В seoUtils.ts
import { apiGet } from "./apiUtils";

export const fetchSeo = async (): Promise<SeoResponse> => {
  return apiGet<SeoResponse>(`seo/${i18n.global.locale.value}.json`);
};
```

### Использование в компонентах Vue

```typescript
// В Vue-компоненте
import { ref, onMounted } from "vue";
import { apiGet } from "@/utils/apiUtils";

interface ComponentData {
  items: Array<{ id: number; name: string }>;
}

export default {
  setup() {
    const data = ref<ComponentData | null>(null);
    const loading = ref(false);
    const error = ref<string | null>(null);

    const loadData = async () => {
      loading.value = true;
      error.value = null;

      try {
        data.value = await apiGet<ComponentData>("component-data");
      } catch (err) {
        error.value = err instanceof Error ? err.message : "Неизвестная ошибка";
      } finally {
        loading.value = false;
      }
    };

    onMounted(loadData);

    return { data, loading, error, loadData };
  },
};
```

## Конфигурация и настройка

### Изменение базового URL

Для переключения между окружениями:

```typescript
// В apiUtils.ts для development
const API_BASE_URL = "/api/v1";

// Для production
const API_BASE_URL = "https://api.kidoo.club/v1";

// Или динамически через переменные окружения
const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || "/api/v1";
```

### Добавление глобальных заголовков

```typescript
// Модификация apiRequest для добавления глобальных заголовков
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> => {
  const globalHeaders = {
    "Content-Type": "application/json",
    "X-Client-Version": "1.0.0",
    "X-Request-ID": generateRequestId(),
  };

  // Остальная логика...
};
```

## Ограничения и рекомендации

### Текущие ограничения

1. **Отсутствие retry-логики**: При сетевых сбоях запросы не повторяются автоматически
2. **Нет встроенного кеширования**: Каждый запрос выполняется заново
3. **Простая обработка ошибок**: Нет различения между временными и постоянными ошибками
4. **Отсутствие отмены запросов**: Не поддерживается AbortController для отмены длительных операций

### Рекомендации по использованию

1. **Всегда указывайте типы**: Используйте Generic-параметры для типизации ответов
2. **Обрабатывайте ошибки**: Всегда оборачивайте вызовы в try-catch блоки
3. **Проверяйте статусы**: Используйте различную логику для разных HTTP-статусов
4. **Создавайте обёртки**: Для сложных API создавайте специализированные классы или функции

### Планы по развитию

- Добавление retry-механизмов для временных сбоев
- Интеграция системы кеширования
- Поддержка отмены запросов через AbortController
- Добавление interceptors для запросов и ответов
- Интеграция с системами мониторинга и аналитики

## Отладка и тестирование

### Включение подробного логирования

```typescript
// Временная модификация для отладки
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> => {
  const url = getApiUrl(endpoint);
  console.log(`[API] Request: ${options.method || "GET"} ${url}`, options);

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    console.log(`[API] Response: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      throw createApiError(
        response.status,
        response.statusText,
        `API request failed: ${response.status} ${response.statusText}`,
      );
    }

    const data: T = await response.json();
    console.log(`[API] Data:`, data);
    return data;
  } catch (error) {
    console.error(`[API] Error:`, error);
    throw error;
  }
};
```

### Мокирование для тестов

```typescript
// __mocks__/apiUtils.ts
export const apiGet = jest.fn();
export const apiRequest = jest.fn();
export const getApiUrl = jest.fn((endpoint) => `/api/v1/${endpoint}`);

// В тестах
import { apiGet } from "@/utils/apiUtils";

jest.mock("@/utils/apiUtils");

test("должен загружать SEO данные", async () => {
  const mockSeoData = {
    language: "ru",
    seo: { title: "Test", description: "Test desc", keywords: "test" },
  };

  (apiGet as jest.Mock).mockResolvedValue(mockSeoData);

  const result = await fetchSeo();
  expect(result).toEqual(mockSeoData);
  expect(apiGet).toHaveBeenCalledWith("seo/ru.json");
});
```

## Совместимость

- **TypeScript**: 4.0+
- **Браузеры**: Все современные браузеры с поддержкой fetch API и ES6+
- **Node.js**: 18+ (при использовании в серверной среде)
- **Vue.js**: Не зависит напрямую, но проектируется для использования в Vue-приложениях

## Связанные файлы

- `src/utils/seoUtils.ts` - использует `apiGet` для получения SEO-данных
- `src/i18n.ts` - может использовать API для загрузки переводов
- `public/api/v1/**/*.json` - mock-файлы для development окружения
