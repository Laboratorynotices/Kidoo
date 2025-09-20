/**
 * Универсальная утилита для API-запросов
 */

// Константы API
const API_BASE_URL = "/api/v1";

export interface ApiError extends Error {
  status: number;
  statusText: string;
}

/**
 * Создает ошибку API с дополнительной информацией
 */
const createApiError = (
  status: number,
  statusText: string,
  message: string,
): ApiError => {
  const error = new Error(message) as ApiError;
  error.status = status;
  error.statusText = statusText;
  return error;
};

/**
 * Получение полного API URL
 */
export const getApiUrl = (endpoint: string): string =>
  `${API_BASE_URL}/${endpoint}`;

/**
 * Универсальная функция для выполнения API-запросов
 * @param endpoint - Эндпоинт API (без базового URL)
 * @param options - Опции для fetch (по умолчанию GET-запрос)
 * @returns Промис с типизированными данными
 */
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> => {
  try {
    const url = getApiUrl(endpoint);
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw createApiError(
        response.status,
        response.statusText,
        `API request failed: ${response.status} ${response.statusText}`,
      );
    }

    const data: T = await response.json();
    return data;
  } catch (error) {
    // Если это уже ApiError, пробрасываем дальше
    if (error instanceof Error && "status" in error) {
      throw error;
    }

    // Для других ошибок (сеть, парсинг JSON и т.д.)
    throw new Error(
      `Network or parsing error: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
};

/**
 * Вспомогательные функции для популярных HTTP-методов
 */
export const apiGet = <T>(endpoint: string): Promise<T> =>
  apiRequest<T>(endpoint, { method: "GET" });
