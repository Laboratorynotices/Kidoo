import type { InjectionKey, Ref } from "vue";

/**
 * Интерфейс методов управления Hero каруселью
 */
export interface HeroCarouselControls {
  /** Переход к следующему слайду */
  next: () => void;
  /** Переход к предыдущему слайду */
  prev: () => void;
  /** Пауза автопрокрутки */
  pauseAutoplay: () => void;
  /** Возобновление автопрокрутки */
  resumeAutoplay: () => void;
  /** Прогресс до следующего слайда (0-1) */
  autoplayProgress: Ref<number>;
}

/**
 * Типизированный ключ для provide/inject
 * Обеспечивает type-safety при использовании inject
 */
export const HERO_CAROUSEL_KEY: InjectionKey<HeroCarouselControls> =
  Symbol("heroCarousel");
