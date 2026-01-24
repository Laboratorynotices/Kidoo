/**
 * Универсальная утилита для кэширования данных
 *
 * Этот модуль предоставляет простую и типобезопасную систему кэширования,
 * которая может хранить данные любого типа с использованием TypeScript generics.
 */

/**
 * Создаёт кэш для хранения данных любого типа
 *
 * @template T - Тип данных, которые будут храниться в кэше
 *
 * @returns Объект с методами для работы с кэшем
 *
 * @example
 * // Создание кэша для хранения строк
 * const stringCache = createCache<string>();
 * stringCache.set('user', 'John Doe');
 * console.log(stringCache.get('user')); // 'John Doe'
 *
 * @example
 * // Создание кэша для хранения объектов
 * interface User {
 *   id: number;
 *   name: string;
 * }
 * const userCache = createCache<User>();
 * userCache.set('user:1', { id: 1, name: 'Alice' });
 *
 * @example
 * // Создание кэша для хранения массивов
 * const arrayCache = createCache<number[]>();
 * arrayCache.set('scores', [10, 20, 30]);
 */
export const createCache = <T>() => {
  // Внутреннее хранилище на основе Map для эффективного хранения пар ключ-значение
  const cache = new Map<string, T>();

  return {
    /**
     * Получает значение из кэша по ключу
     *
     * @param key - Уникальный идентификатор для получения данных
     * @returns Сохранённое значение или undefined, если ключ не найден
     *
     * @example
     * const cache = createCache<string>();
     * cache.set('name', 'Alice');
     * const name = cache.get('name'); // 'Alice'
     * const missing = cache.get('age'); // undefined
     */
    get(key: string): T | undefined {
      return cache.get(key);
    },

    /**
     * Сохраняет значение в кэше под указанным ключом
     *
     * Если ключ уже существует, старое значение будет заменено новым.
     *
     * @param key - Уникальный идентификатор для сохранения данных
     * @param value - Данные для сохранения в кэше
     * @returns void
     *
     * @example
     * const cache = createCache<number>();
     * cache.set('count', 42);
     * cache.set('count', 100); // Перезапишет значение 42 на 100
     */
    set(key: string, value: T): void {
      cache.set(key, value);
    },

    /**
     * Проверяет наличие ключа в кэше
     *
     * @param key - Ключ для проверки
     * @returns true, если ключ существует в кэше, иначе false
     *
     * @example
     * const cache = createCache<string>();
     * cache.set('token', 'abc123');
     * console.log(cache.has('token')); // true
     * console.log(cache.has('missing')); // false
     */
    has(key: string): boolean {
      return cache.has(key);
    },

    /**
     * Удаляет запись из кэша по ключу
     *
     * @param key - Ключ записи для удаления
     * @returns true, если запись была удалена, false если ключ не существовал
     *
     * @example
     * const cache = createCache<string>();
     * cache.set('temp', 'data');
     * const deleted = cache.delete('temp'); // true
     * const notFound = cache.delete('temp'); // false (уже удалён)
     */
    delete(key: string): boolean {
      return cache.delete(key);
    },

    /**
     * Очищает весь кэш, удаляя все сохранённые записи
     *
     * @returns void
     *
     * @example
     * const cache = createCache<string>();
     * cache.set('a', 'value1');
     * cache.set('b', 'value2');
     * console.log(cache.size()); // 2
     * cache.clear();
     * console.log(cache.size()); // 0
     */
    clear(): void {
      cache.clear();
    },

    /**
     * Возвращает количество записей в кэше
     *
     * @returns Число записей в кэше
     *
     * @example
     * const cache = createCache<number>();
     * console.log(cache.size()); // 0
     * cache.set('x', 1);
     * cache.set('y', 2);
     * console.log(cache.size()); // 2
     */
    size(): number {
      return cache.size;
    },

    /**
     * Возвращает массив всех ключей, хранящихся в кэше
     *
     * @returns Массив строковых ключей
     *
     * @example
     * const cache = createCache<string>();
     * cache.set('user:1', 'Alice');
     * cache.set('user:2', 'Bob');
     * cache.set('user:3', 'Charlie');
     * const allKeys = cache.keys(); // ['user:1', 'user:2', 'user:3']
     *
     * // Полезно для итерации по всем записям
     * allKeys.forEach(key => {
     *   console.log(`${key}: ${cache.get(key)}`);
     * });
     */
    keys(): string[] {
      return Array.from(cache.keys());
    },
  };
};
