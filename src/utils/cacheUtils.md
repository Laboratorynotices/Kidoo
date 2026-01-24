# Cache Utils

Универсальная утилита для кэширования данных в приложении. Предоставляет простой и типобезопасный механизм хранения данных любого типа с поддержкой TypeScript generics и полным набором операций для управления кэшем.

## Обзор

Модуль `cacheUtils.ts` создаёт легковесную систему кэширования на основе нативного JavaScript `Map`, добавляя удобный API и полную типизацию TypeScript. Это позволяет эффективно хранить временные данные в памяти приложения, избегая повторных вычислений или запросов к серверу.

## Архитектурные принципы

### Типобезопасность

Каждый экземпляр кэша строго типизируется через Generic-параметры, что предотвращает ошибки типов на этапе компиляции.

### Простота использования

Минималистичный API с интуитивно понятными методами делает работу с кэшем максимально простой и предсказуемой.

### Производительность

Использование нативного `Map` обеспечивает O(1) сложность для основных операций (get, set, has, delete).

## Импорт

```typescript
import { createCache } from "@/utils/cacheUtils";
```

## Функции

### createCache

```typescript
export const createCache = <T>() => {
  // ...
};
```

Фабричная функция для создания нового экземпляра кэша с заданным типом данных.

**Generic-параметры:**

- `T` - тип данных, которые будут храниться в кэше

**Возвращает:** объект с методами для работы с кэшем

**Внутренняя реализация:**

Использует `Map<string, T>` для эффективного хранения пар ключ-значение, где ключ всегда является строкой, а значение имеет тип `T`.

## Методы кэша

### get

```typescript
get(key: string): T | undefined
```

Извлекает значение из кэша по указанному ключу.

**Параметры:**

- `key` (string) - уникальный идентификатор для получения данных

**Возвращает:** T | undefined - сохранённое значение или `undefined`, если ключ не найден

**Примеры использования:**

```typescript
const cache = createCache<string>();
cache.set("username", "Alice");

const username = cache.get("username");
// Результат: 'Alice'

const missing = cache.get("email");
// Результат: undefined

// Проверка существования перед использованием
const token = cache.get("authToken");
if (token) {
  console.log(`Токен найден: ${token}`);
} else {
  console.log("Токен отсутствует");
}
```

### set

```typescript
set(key: string, value: T): void
```

Сохраняет значение в кэше под указанным ключом. Если ключ уже существует, старое значение будет полностью заменено новым.

**Параметры:**

- `key` (string) - уникальный идентификатор для сохранения данных
- `value` (T) - данные для сохранения в кэше

**Возвращает:** void

**Примеры использования:**

```typescript
const cache = createCache<number>();

// Первичное сохранение
cache.set("counter", 42);

// Обновление существующего значения
cache.set("counter", 100);
// Значение 42 будет перезаписано на 100

// Сохранение сложных объектов
interface UserData {
  id: number;
  name: string;
  roles: string[];
}

const userCache = createCache<UserData>();
userCache.set("user:123", {
  id: 123,
  name: "Bob",
  roles: ["admin", "editor"],
});
```

### has

```typescript
has(key: string): boolean
```

Проверяет наличие ключа в кэше без извлечения самого значения.

**Параметры:**

- `key` (string) - ключ для проверки

**Возвращает:** boolean - `true`, если ключ существует, иначе `false`

**Примеры использования:**

```typescript
const cache = createCache<string>();
cache.set("sessionId", "xyz789");

if (cache.has("sessionId")) {
  console.log("Сессия активна");
} else {
  console.log("Сессия отсутствует");
}

// Использование для условного кэширования
if (!cache.has("expensiveData")) {
  const data = performExpensiveCalculation();
  cache.set("expensiveData", data);
}
```

### delete

```typescript
delete(key: string): boolean
```

Удаляет запись из кэша по указанному ключу.

**Параметры:**

- `key` (string) - ключ записи для удаления

**Возвращает:** boolean - `true`, если запись была удалена, `false`, если ключ не существовал

**Примеры использования:**

```typescript
const cache = createCache<string>();
cache.set("tempData", "temporary value");

const wasDeleted = cache.delete("tempData");
// Результат: true

const notFound = cache.delete("tempData");
// Результат: false (уже удалён)

// Безопасное удаление с проверкой
if (cache.delete("oldToken")) {
  console.log("Старый токен успешно удалён");
}
```

### clear

```typescript
clear(): void
```

Полностью очищает кэш, удаляя все сохранённые записи. После выполнения этого метода кэш становится пустым.

**Возвращает:** void

**Примеры использования:**

```typescript
const cache = createCache<string>();
cache.set("key1", "value1");
cache.set("key2", "value2");
cache.set("key3", "value3");

console.log(cache.size()); // 3

cache.clear();

console.log(cache.size()); // 0
console.log(cache.has("key1")); // false

// Использование при выходе пользователя
function logout() {
  userCache.clear();
  sessionCache.clear();
  console.log("Все кэши очищены");
}
```

### size

```typescript
size(): number
```

Возвращает текущее количество записей в кэше.

**Возвращает:** number - количество пар ключ-значение в кэше

**Примеры использования:**

```typescript
const cache = createCache<number>();

console.log(cache.size()); // 0

cache.set("x", 1);
cache.set("y", 2);
cache.set("z", 3);

console.log(cache.size()); // 3

cache.delete("x");

console.log(cache.size()); // 2

// Проверка лимита кэша
if (cache.size() > 100) {
  console.warn("Кэш превысил оптимальный размер");
  cache.clear();
}
```

### keys

```typescript
keys(): string[]
```

Возвращает массив всех ключей, хранящихся в кэше. Порядок ключей соответствует порядку их добавления в кэш.

**Возвращает:** string[] - массив строковых ключей

**Примеры использования:**

```typescript
const cache = createCache<string>();
cache.set("user:1", "Alice");
cache.set("user:2", "Bob");
cache.set("user:3", "Charlie");

const allKeys = cache.keys();
// Результат: ['user:1', 'user:2', 'user:3']

// Итерация по всем записям
allKeys.forEach((key) => {
  const value = cache.get(key);
  console.log(`${key}: ${value}`);
});

// Фильтрация ключей
const userKeys = cache.keys().filter((key) => key.startsWith("user:"));

// Массовое удаление по паттерну
cache
  .keys()
  .filter((key) => key.startsWith("temp:"))
  .forEach((key) => cache.delete(key));
```

## Паттерны использования

### Кэширование строк

```typescript
const stringCache = createCache<string>();

// Сохранение пользовательских токенов
stringCache.set("accessToken", "eyJhbGciOiJIUzI1NiIs...");
stringCache.set("refreshToken", "dGhpcyBpcyBhIHJlZnJl...");

// Получение токена
const token = stringCache.get("accessToken");
if (token) {
  // Использовать токен для API-запросов
}
```

### Кэширование объектов

```typescript
interface Product {
  id: number;
  name: string;
  price: number;
  inStock: boolean;
}

const productCache = createCache<Product>();

// Сохранение продуктов
productCache.set("product:101", {
  id: 101,
  name: "Laptop",
  price: 999.99,
  inStock: true,
});

// Получение и использование
const laptop = productCache.get("product:101");
if (laptop && laptop.inStock) {
  console.log(`${laptop.name} доступен за $${laptop.price}`);
}
```

### Кэширование массивов

```typescript
const arrayCache = createCache<number[]>();

// Сохранение результатов вычислений
arrayCache.set("fibonacci:10", [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]);
arrayCache.set("primes:20", [2, 3, 5, 7, 11, 13, 17, 19]);

// Получение кэшированных данных
const fibonacci = arrayCache.get("fibonacci:10");
if (fibonacci) {
  console.log(`Сумма: ${fibonacci.reduce((a, b) => a + b, 0)}`);
}
```

### Кэширование результатов функций

```typescript
interface CalculationResult {
  value: number;
  timestamp: number;
}

const resultCache = createCache<CalculationResult>();

function expensiveCalculation(input: number): number {
  const cacheKey = `calc:${input}`;

  // Проверяем кэш
  if (resultCache.has(cacheKey)) {
    const cached = resultCache.get(cacheKey)!;
    console.log("Возвращаем из кэша");
    return cached.value;
  }

  // Выполняем вычисление
  console.log("Выполняем новое вычисление");
  const result = input * input * Math.random();

  // Сохраняем в кэш
  resultCache.set(cacheKey, {
    value: result,
    timestamp: Date.now(),
  });

  return result;
}

// Первый вызов - вычисление
expensiveCalculation(42); // "Выполняем новое вычисление"

// Второй вызов - из кэша
expensiveCalculation(42); // "Возвращаем из кэша"
```

### Кэширование с TTL (Time To Live)

```typescript
interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

function createTTLCache<T>(ttlMs: number) {
  const cache = createCache<CacheEntry<T>>();

  return {
    set(key: string, value: T): void {
      cache.set(key, {
        value,
        expiresAt: Date.now() + ttlMs,
      });
    },

    get(key: string): T | undefined {
      const entry = cache.get(key);

      if (!entry) return undefined;

      // Проверяем срок действия
      if (Date.now() > entry.expiresAt) {
        cache.delete(key);
        return undefined;
      }

      return entry.value;
    },

    has(key: string): boolean {
      const value = this.get(key);
      return value !== undefined;
    },

    delete: cache.delete.bind(cache),
    clear: cache.clear.bind(cache),
    size: cache.size.bind(cache),
  };
}

// Использование кэша с TTL
const sessionCache = createTTLCache<string>(30 * 60 * 1000); // 30 минут

sessionCache.set("user:session", "active");

// Через 30 минут
setTimeout(
  () => {
    console.log(sessionCache.get("user:session")); // undefined
  },
  30 * 60 * 1000,
);
```

### Многоуровневое кэширование

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

class UserCache {
  private memoryCache = createCache<User>();

  async getUser(id: number): Promise<User | null> {
    const cacheKey = `user:${id}`;

    // Уровень 1: Проверяем память
    if (this.memoryCache.has(cacheKey)) {
      console.log("Из памяти");
      return this.memoryCache.get(cacheKey)!;
    }

    // Уровень 2: Проверяем localStorage
    const localData = localStorage.getItem(cacheKey);
    if (localData) {
      console.log("Из localStorage");
      const user = JSON.parse(localData);
      this.memoryCache.set(cacheKey, user);
      return user;
    }

    // Уровень 3: Запрос к API
    console.log("Из API");
    const user = await this.fetchUserFromAPI(id);

    if (user) {
      this.memoryCache.set(cacheKey, user);
      localStorage.setItem(cacheKey, JSON.stringify(user));
    }

    return user;
  }

  private async fetchUserFromAPI(id: number): Promise<User | null> {
    // Имитация API-запроса
    return { id, name: "John Doe", email: "john@example.com" };
  }

  invalidate(id: number): void {
    const cacheKey = `user:${id}`;
    this.memoryCache.delete(cacheKey);
    localStorage.removeItem(cacheKey);
  }
}
```

### Кэш с лимитом размера (LRU)

```typescript
function createLRUCache<T>(maxSize: number) {
  const cache = createCache<T>();
  const accessOrder: string[] = [];

  return {
    get(key: string): T | undefined {
      const value = cache.get(key);

      if (value !== undefined) {
        // Обновляем порядок доступа
        const index = accessOrder.indexOf(key);
        if (index > -1) {
          accessOrder.splice(index, 1);
        }
        accessOrder.push(key);
      }

      return value;
    },

    set(key: string, value: T): void {
      // Если превышен лимит, удаляем самый старый элемент
      if (!cache.has(key) && cache.size() >= maxSize) {
        const oldestKey = accessOrder.shift();
        if (oldestKey) {
          cache.delete(oldestKey);
        }
      }

      cache.set(key, value);

      // Обновляем порядок доступа
      const index = accessOrder.indexOf(key);
      if (index > -1) {
        accessOrder.splice(index, 1);
      }
      accessOrder.push(key);
    },

    has: cache.has.bind(cache),
    delete(key: string): boolean {
      const index = accessOrder.indexOf(key);
      if (index > -1) {
        accessOrder.splice(index, 1);
      }
      return cache.delete(key);
    },
    clear(): void {
      cache.clear();
      accessOrder.length = 0;
    },
    size: cache.size.bind(cache),
  };
}

// Использование LRU кэша
const lruCache = createLRUCache<string>(3);

lruCache.set("a", "value1");
lruCache.set("b", "value2");
lruCache.set("c", "value3");
lruCache.set("d", "value4"); // 'a' будет удалено

console.log(lruCache.has("a")); // false
console.log(lruCache.has("d")); // true
```

## Интеграция с другими модулями

### Использование в apiUtils

```typescript
// Кэширование API-ответов
import { createCache } from "@/utils/cacheUtils";
import { apiGet } from "@/utils/apiUtils";

const apiCache = createCache<any>();

export async function cachedApiGet<T>(
  endpoint: string,
  cacheDuration: number = 5 * 60 * 1000, // 5 минут
): Promise<T> {
  const cacheKey = `api:${endpoint}`;

  if (apiCache.has(cacheKey)) {
    return apiCache.get(cacheKey) as T;
  }

  const data = await apiGet<T>(endpoint);
  apiCache.set(cacheKey, data);

  // Автоматическая очистка через cacheDuration
  setTimeout(() => {
    apiCache.delete(cacheKey);
  }, cacheDuration);

  return data;
}
```

### Использование в компонентах Vue

```typescript
// В Vue Composition API
import { ref, computed } from "vue";
import { createCache } from "@/utils/cacheUtils";

// Глобальный кэш для компонента
const componentCache = createCache<any>();

export function useDataCache<T>(key: string) {
  const data = ref<T | null>(null);
  const loading = ref(false);

  const loadData = async (fetcher: () => Promise<T>) => {
    // Проверяем кэш
    if (componentCache.has(key)) {
      data.value = componentCache.get(key) as T;
      return;
    }

    loading.value = true;
    try {
      const result = await fetcher();
      data.value = result;
      componentCache.set(key, result);
    } finally {
      loading.value = false;
    }
  };

  const invalidate = () => {
    componentCache.delete(key);
    data.value = null;
  };

  return { data, loading, loadData, invalidate };
}

// Использование в компоненте
const { data, loading, loadData, invalidate } = useDataCache<User[]>("users");

onMounted(() => {
  loadData(() => apiGet<User[]>("users"));
});
```

### Кэширование переводов (i18n)

```typescript
import { createCache } from "@/utils/cacheUtils";

interface Translation {
  [key: string]: string;
}

const translationCache = createCache<Translation>();

export async function loadTranslations(locale: string): Promise<Translation> {
  const cacheKey = `i18n:${locale}`;

  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }

  const translations = await import(`@/locales/${locale}.json`);
  translationCache.set(cacheKey, translations);

  return translations;
}
```

## Производительность

### Сложность операций

Все основные операции имеют O(1) сложность благодаря использованию `Map`:

- `get(key)`: O(1)
- `set(key, value)`: O(1)
- `has(key)`: O(1)
- `delete(key)`: O(1)
- `size()`: O(1)
- `clear()`: O(n), где n - количество элементов
- `keys()`: O(n), создание массива из всех ключей

### Рекомендации по оптимизации

1. **Ограничивайте размер кэша**: Используйте LRU или другие стратегии для предотвращения неограниченного роста
2. **Очищайте устаревшие данные**: Реализуйте TTL для автоматического удаления старых записей
3. **Избегайте хранения больших объектов**: Кэшируйте только необходимые данные
4. **Используйте осмысленные ключи**: Структурированные ключи типа `user:123`, `product:456` упрощают управление

## Ограничения и рекомендации

### Текущие ограничения

1. **Отсутствие персистентности**: Данные хранятся только в памяти и теряются при перезагрузке страницы
2. **Нет встроенного TTL**: Устаревшие данные не удаляются автоматически
3. **Отсутствие лимита размера**: Кэш может расти неограниченно
4. **Нет синхронизации**: Изменения в одном экземпляре не отражаются в других

### Рекомендации по использованию

1. **Используйте типизацию**: Всегда указывайте тип данных через Generic-параметр
2. **Проверяйте существование**: Используйте `has()` перед `get()` или проверяйте на `undefined`
3. **Управляйте размером**: Реализуйте стратегии очистки для больших кэшей
4. **Документируйте ключи**: Используйте константы или перечисления для ключей кэша

### Когда не следует использовать

- Для долгосрочного хранения данных (используйте localStorage/IndexedDB)
- Для больших объёмов данных (>100MB)
- Для данных, требующих синхронизации между вкладками
- Для критически важных данных, которые нельзя потерять

## Отладка и тестирование

### Логирование операций кэша

```typescript
function createDebugCache<T>(name: string) {
  const cache = createCache<T>();

  return {
    get(key: string): T | undefined {
      const value = cache.get(key);
      console.log(
        `[${name}] GET ${key}:`,
        value !== undefined ? "HIT" : "MISS",
      );
      return value;
    },

    set(key: string, value: T): void {
      console.log(`[${name}] SET ${key}`);
      cache.set(key, value);
    },

    delete(key: string): boolean {
      const result = cache.delete(key);
      console.log(`[${name}] DELETE ${key}:`, result ? "SUCCESS" : "NOT_FOUND");
      return result;
    },

    has: cache.has.bind(cache),
    clear: cache.clear.bind(cache),
    size: cache.size.bind(cache),
    keys: cache.keys.bind(cache),
  };
}
```

### Модульные тесты

```typescript
import { createCache } from "@/utils/cacheUtils";

describe("cacheUtils", () => {
  test("должен сохранять и получать значения", () => {
    const cache = createCache<string>();
    cache.set("key", "value");
    expect(cache.get("key")).toBe("value");
  });

  test("должен возвращать undefined для несуществующих ключей", () => {
    const cache = createCache<string>();
    expect(cache.get("missing")).toBeUndefined();
  });

  test("должен перезаписывать существующие значения", () => {
    const cache = createCache<number>();
    cache.set("count", 1);
    cache.set("count", 2);
    expect(cache.get("count")).toBe(2);
  });

  test("должен корректно работать метод has", () => {
    const cache = createCache<string>();
    expect(cache.has("key")).toBe(false);
    cache.set("key", "value");
    expect(cache.has("key")).toBe(true);
  });

  test("должен удалять значения", () => {
    const cache = createCache<string>();
    cache.set("key", "value");
    expect(cache.delete("key")).toBe(true);
    expect(cache.delete("key")).toBe(false);
    expect(cache.has("key")).toBe(false);
  });

  test("должен очищать весь кэш", () => {
    const cache = createCache<number>();
    cache.set("a", 1);
    cache.set("b", 2);
    cache.clear();
    expect(cache.size()).toBe(0);
  });

  test("должен возвращать корректный размер", () => {
    const cache = createCache<string>();
    expect(cache.size()).toBe(0);
    cache.set("a", "1");
    cache.set("b", "2");
    expect(cache.size()).toBe(2);
  });

  test("должен возвращать массив ключей", () => {
    const cache = createCache<number>();
    cache.set("x", 1);
    cache.set("y", 2);
    cache.set("z", 3);
    expect(cache.keys()).toEqual(["x", "y", "z"]);
  });
});
```

## Совместимость

- **TypeScript**: 4.0+
- **Браузеры**: Все современные браузеры с поддержкой ES6+ и Map
- **Node.js**: 12+ (при использовании в серверной среде)
- **Vue.js**: Не зависит напрямую, но проектируется для использования в Vue-приложениях

## Связанные файлы

- `src/utils/apiUtils.ts` - может использовать кэш для оптимизации API-запросов
- `src/utils/seoUtils.ts` - может кэшировать SEO-данные
- `src/i18n.ts` - может кэшировать переводы
