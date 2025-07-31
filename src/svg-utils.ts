/**
 * Utilitários para geração de SVG
 */

/**
 * Escapa caracteres especiais para usar em SVG
 */
export function escapeSVGText(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Converte um valor numérico para string com unidade
 */
export function toSVGUnit(value: number, unit: string = 'px'): string {
  return `${value}${unit}`;
}

/**
 * Gera atributos SVG a partir de um objeto
 */
export function attributesToSVG(attributes: Record<string, string | number | boolean | undefined>): string {
  const parts: string[] = [];
  
  for (const [key, value] of Object.entries(attributes)) {
    if (value !== undefined && value !== null) {
      if (typeof value === 'boolean') {
        if (value) {
          parts.push(key);
        }
      } else {
        parts.push(`${key}="${String(value)}"`);
      }
    }
  }
  
  return parts.join(' ');
}

/**
 * Cria uma tag SVG completa
 */
export function createSVGElement(
  tagName: string, 
  attributes: Record<string, string | number | boolean | undefined> = {},
  content: string = '',
  selfClosing: boolean = false
): string {
  const attrs = attributesToSVG(attributes);
  const attrsStr = attrs ? ` ${attrs}` : '';
  
  if (selfClosing) {
    return `<${tagName}${attrsStr} />`;
  }
  
  if (content) {
    return `<${tagName}${attrsStr}>${content}</${tagName}>`;
  }
  
  return `<${tagName}${attrsStr}></${tagName}>`;
}

/**
 * Interface para opções de criação de SVG wrapper
 */
export interface SVGWrapperOptions {
  width?: number;
  height?: number;
  viewBox?: string;
  xmlns?: string;
  className?: string;
  style?: string;
}

/**
 * Cria um wrapper SVG completo
 */
export function createSVGWrapper(
  content: string,
  options: SVGWrapperOptions = {}
): string {
  const {
    width,
    height,
    viewBox,
    xmlns = 'http://www.w3.org/2000/svg',
    className,
    style
  } = options;

  const attributes: Record<string, string | number | undefined> = {
    xmlns,
    width,
    height,
    viewBox,
    class: className,
    style
  };

  return createSVGElement('svg', attributes, content);
}

/**
 * Converte propriedades de fonte para atributos SVG
 */
export function fontPropsToSVG(props: {
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string | number;
  fontStyle?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}): Record<string, string | number | undefined> {
  const {
    fontFamily,
    fontSize,
    fontWeight,
    fontStyle,
    fill,
    stroke,
    strokeWidth
  } = props;

  return {
    'font-family': fontFamily,
    'font-size': fontSize,
    'font-weight': fontWeight,
    'font-style': fontStyle,
    'fill': fill,
    'stroke': stroke,
    'stroke-width': strokeWidth
  };
}

/**
 * Calcula a posição X baseada no alinhamento do texto
 */
export function getTextAnchorForAlignment(textAlign: string): string {
  switch (textAlign) {
    case 'center':
      return 'middle';
    case 'right':
      return 'end';
    case 'left':
    default:
      return 'start';
  }
}

/**
 * Calcula o offset X baseado no alinhamento e largura
 */
export function getXOffsetForAlignment(textAlign: string, width: number): number {
  switch (textAlign) {
    case 'center':
      return width / 2;
    case 'right':
      return width;
    case 'left':
    default:
      return 0;
  }
}

/**
 * Converte lineHeight em unidades dy para SVG
 */
export function lineHeightToDy(lineHeight: number, _fontSize: number, isFirstLine: boolean = false): string {
  if (isFirstLine) {
    return '0em';
  }
  return `${lineHeight}em`;
}

/**
 * Cria uma tag tspan para uma linha de texto
 */
export function createTextSpan(
  text: string,
  attributes: Record<string, string | number | undefined> = {}
): string {
  const escapedText = escapeSVGText(text);
  return createSVGElement('tspan', attributes, escapedText);
}

/**
 * Cria um grupo SVG com transformação
 */
export function createSVGGroup(
  content: string,
  transform?: string,
  attributes: Record<string, string | number | undefined> = {}
): string {
  const groupAttributes = {
    ...attributes,
    transform
  };
  
  return createSVGElement('g', groupAttributes, content);
} 