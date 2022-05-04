/**
<<<<<<< HEAD
 * The way to handle the situation where wrapped text is too tall to fit in the height.
 */
export enum OverflowMode {
  /** Overflow when the text is too tall */
  Overflow = 0,
  /** Truncate with height when the text is too tall */
=======
 * Text horizontal overflow.
 */
export enum TextHorizontalOverflow {
  Overflow = 0,
  Wrap = 1
}

/**
 * Text vertical overflow.
 */
export enum TextVerticalOverflow {
  Overflow = 0,
>>>>>>> fc710ceab08bbcd405260b1e2a781593c4708e13
  Truncate = 1
}
