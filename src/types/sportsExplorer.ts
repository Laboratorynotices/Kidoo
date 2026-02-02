/**
 * Типы для компонента SportsExplorer
 */

/**
 * Информация об одном виде спорта
 */
export interface Sport {
  /** Эмодзи для визуального представления */
  emoji: string;
  /** Название вида спорта */
  name: string;
  /** Забавный факт или описание */
  funFact: string;
}

/**
 * Заключительный блок
 */
export interface Closing {
  /** Текст заключительной фразы */
  text: string;
  /** Список иконок */
  icons: string[];
}

/**
 * Контент секции Sports Explorer
 */
export interface SportsExplorerContent {
  /** Иконка секции */
  icon: string;
  /** Заголовок секции */
  title: string;
  /** Описание секции */
  description: string;
  /** Список видов спорта */
  sports: Sport[];
  /** Заключительный блок */
  closing: Closing;
}

/**
 * Полный ответ API для SportsExplorer
 */
export interface SportsExplorerApiResponse {
  /** Код языка */
  language: string;
  /** Контент Sports Explorer */
  sportsExplorer: SportsExplorerContent;
}
