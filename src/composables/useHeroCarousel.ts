import {
  ref,
  onMounted,
  onUnmounted,
  computed,
  type Ref,
  type ComputedRef,
} from "vue";

interface UseHeroCarouselOptions {
  /** Автоматическая прокрутка слайдов */
  autoplay?: boolean;
  /** Интервал автопрокрутки в миллисекундах */
  autoplayInterval?: number;
  /** Длительность анимации перехода в миллисекундах */
  transitionDuration?: number;
}

interface UseHeroCarouselReturn<T> {
  /** Текущий активный индекс слайда */
  currentIndex: Ref<number>;
  /** Флаг анимации */
  isAnimating: Ref<boolean>;
  /** Прогресс до следующего слайда (0-1) */
  autoplayProgress: Ref<number>;
  /** Упорядоченные слайды для отображения */
  orderedSlides: ComputedRef<Array<{ slide: T; originalIndex: number }>>;
  /** Переход к следующему слайду */
  next: () => void;
  /** Переход к предыдущему слайду */
  prev: () => void;
  /** Пауза автопрокрутки */
  pauseAutoplay: () => void;
  /** Возобновление автопрокрутки */
  resumeAutoplay: () => void;
}

/**
 * Composable для управления Hero каруселью
 *
 * @example
 * ```ts
 * const { currentIndex, orderedSlides, next, prev, autoplayProgress } = useHeroCarousel(slides, {
 *   autoplay: true,
 *   autoplayInterval: 5000
 * });
 * ```
 */
export function useHeroCarousel<T>(
  slides: Ref<T[]>,
  options: UseHeroCarouselOptions = {},
): UseHeroCarouselReturn<T> {
  const {
    autoplay = true,
    autoplayInterval = 5000,
    transitionDuration = 1000,
  } = options;

  // Реактивные состояния
  const currentIndex = ref(0);
  const isAnimating = ref(false);
  const autoplayProgress = ref(0);

  let autoplayTimer: ReturnType<typeof setInterval> | null = null;
  let isAutoplayPaused = false;
  let progressAnimationFrame: number | null = null;
  let progressStartTime = 0;

  // Вычисляем упорядоченные слайды - циклически сдвигаем массив
  const orderedSlides = computed(() => {
    const slidesList = slides.value;

    if (!slidesList || slidesList.length === 0) {
      return [];
    }

    const total = slidesList.length;
    const result = [];

    // Циклически переставляем слайды: текущий индекс уходит в начало (position 0 - невидимый)
    for (let i = 0; i < total; i++) {
      const actualIndex = (currentIndex.value + i) % total;
      result.push({
        slide: slidesList[actualIndex],
        originalIndex: actualIndex,
      });
    }

    return result;
  });

  /**
   * Обновление прогресса через requestAnimationFrame
   */
  const updateProgress = () => {
    if (!autoplay) {
      return;
    }

    // Если анимация идет или пауза - не обновляем прогресс
    if (isAutoplayPaused || isAnimating.value) {
      progressAnimationFrame = requestAnimationFrame(updateProgress);
      return;
    }

    const elapsed = Date.now() - progressStartTime;
    autoplayProgress.value = Math.min(elapsed / autoplayInterval, 1);

    progressAnimationFrame = requestAnimationFrame(updateProgress);
  };

  /**
   * Сброс прогресса
   */
  const resetProgress = () => {
    progressStartTime = Date.now();
    autoplayProgress.value = 0;
  };

  /**
   * Переход к следующему слайду
   */
  const next = () => {
    const slidesList = slides.value;
    if (isAnimating.value || !slidesList || slidesList.length === 0) return;

    isAnimating.value = true;
    currentIndex.value = (currentIndex.value + 1) % slidesList.length;

    // Сбрасываем прогресс при переходе
    resetProgress();

    setTimeout(() => {
      isAnimating.value = false;
    }, transitionDuration);
  };

  /**
   * Переход к предыдущему слайду
   */
  const prev = () => {
    const slidesList = slides.value;
    if (isAnimating.value || !slidesList || slidesList.length === 0) return;

    isAnimating.value = true;
    currentIndex.value =
      currentIndex.value === 0 ? slidesList.length - 1 : currentIndex.value - 1;

    // Сбрасываем прогресс при переходе
    resetProgress();

    setTimeout(() => {
      isAnimating.value = false;
    }, transitionDuration);
  };

  /**
   * Запуск автопрокрутки
   */
  const startAutoplay = () => {
    if (!autoplay || autoplayTimer) return;

    // Сбрасываем прогресс и запускаем его обновление
    resetProgress();
    progressAnimationFrame = requestAnimationFrame(updateProgress);

    autoplayTimer = setInterval(() => {
      if (!isAutoplayPaused) {
        next();
      }
    }, autoplayInterval);
  };

  /**
   * Остановка автопрокрутки
   */
  const stopAutoplay = () => {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
    if (progressAnimationFrame) {
      cancelAnimationFrame(progressAnimationFrame);
      progressAnimationFrame = null;
    }
    autoplayProgress.value = 0;
  };

  /**
   * Пауза автопрокрутки (без сброса таймера)
   */
  const pauseAutoplay = () => {
    isAutoplayPaused = true;
  };

  /**
   * Возобновление автопрокрутки
   */
  const resumeAutoplay = () => {
    isAutoplayPaused = false;
    // При возобновлении сбрасываем прогресс
    resetProgress();
  };

  // Обработка клавиатуры
  const handleKeydown = (event: KeyboardEvent) => {
    switch (event.key) {
      case "ArrowLeft":
        prev();
        pauseAutoplay();
        setTimeout(resumeAutoplay, autoplayInterval);
        break;
      case "ArrowRight":
        next();
        pauseAutoplay();
        setTimeout(resumeAutoplay, autoplayInterval);
        break;
    }
  };

  // Lifecycle hooks
  onMounted(() => {
    startAutoplay();
    window.addEventListener("keydown", handleKeydown);
  });

  onUnmounted(() => {
    stopAutoplay();
    window.removeEventListener("keydown", handleKeydown);
  });

  return {
    currentIndex,
    isAnimating,
    autoplayProgress,
    orderedSlides,
    next,
    prev,
    pauseAutoplay,
    resumeAutoplay,
  };
}
