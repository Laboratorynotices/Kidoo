/**
 * Типы для слайдов блока Hero
 */

/** Кнопка слайда */
export interface SlideButton {
  text: string;
  link: string;
}

/** Слайд */
export interface Slide {
  image: string;
  title: string;
  name: string;
  description: string;
  btn: SlideButton;
}
