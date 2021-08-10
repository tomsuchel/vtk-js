export const VerticalTextAlignment = {
  TOP: 'TOP',
  BOTTOM: 'BOTTOM',
  MIDDLE: 'MIDDLE',
};

/**
 * fontSize can be a number or a string representing a size in px
 * @param {Number|String} fontSize
 * @returns Number representing the fontSize in pixels
 */
export function fontSizeToPixels(fontProperties) {
  if (fontProperties != null && fontProperties.fontSize) {
    if (typeof fontProperties.fontSize === 'string') {
      if (fontProperties.fontSize.slice(-2) === 'px') {
        return parseInt(fontProperties.fontSize, 10);
      }
    } else {
      return fontProperties.fontSize;
    }
  }
  return 16;
}

export default VerticalTextAlignment;
