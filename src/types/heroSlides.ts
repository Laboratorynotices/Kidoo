import type { Slide } from "./heroSlideItem";

/** Ответ сервера при запросе херо */
export interface HeroSlidesResponse {
  language: string;
  slides: Slide[];
}
