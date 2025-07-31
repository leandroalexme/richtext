import { MyTextbox } from '../engine/MyTextbox';
import type { TextboxProps } from '../engine/MyTextbox';
import type { MyFabricObject } from '../engine/MyFabricObject';

// Tipo que combina as propriedades do MyFabricObject com TextboxProps
type FullTextboxProps = TextboxProps & Pick<MyFabricObject, 'left' | 'top' | 'width' | 'height' | 'fill'>;

/**
 * Opções para renderização do textbox
 */
export interface RenderTextboxOptions {
  text: string;
  x: number;
  y: number;
  width: number;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string | number;
  fontStyle?: string;
  fill?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  lineHeight?: number;
  charSpacing?: number;
  minWidth?: number;
  splitByGrapheme?: boolean;
}

/**
 * Opções para exportação SVG
 */
export interface SVGExportOptions {
  includeWrapper?: boolean;
  includePosition?: boolean;
  includeBounds?: boolean;
}

/**
 * Função principal para renderizar um textbox com quebra de linha automática
 * 
 * @param ctx - Contexto 2D do canvas
 * @param options - Opções de configuração do texto
 * 
 * @example
 * ```typescript
 * renderMyTextbox(ctx, {
 *   text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
 *   x: 100,
 *   y: 100,
 *   width: 300,
 *   fontSize: 16,
 *   fontFamily: 'Arial',
 *   fill: 'black'
 * });
 * ```
 */
export function renderMyTextbox(
  ctx: CanvasRenderingContext2D,
  options: RenderTextboxOptions
): void {
  const {
    text,
    x,
    y,
    width,
    fontSize = 40,
    fontFamily = 'Arial',
    fontWeight = 'normal',
    fontStyle = 'normal',
    fill = 'black',
    textAlign = 'left',
    lineHeight = 1.16,
    charSpacing = 0,
    minWidth = 20,
    splitByGrapheme = false
  } = options;

  // Criar uma instância do MyTextbox
  const textbox = new MyTextbox(text, {
    left: x,
    top: y,
    width: width,
    fontSize: fontSize,
    fontFamily: fontFamily,
    fontWeight: fontWeight,
    fontStyle: fontStyle,
    fill: fill,
    textAlign: textAlign,
    lineHeight: lineHeight,
    charSpacing: charSpacing,
    minWidth: minWidth,
    splitByGrapheme: splitByGrapheme
  } as Partial<FullTextboxProps>);

  // Renderizar o textbox
  textbox.render(ctx);
}

/**
 * Função para exportar textbox como SVG
 * 
 * @param options - Opções de configuração do texto
 * @param svgOptions - Opções específicas para exportação SVG
 * @returns String SVG representando o textbox
 * 
 * @example
 * ```typescript
 * const svg = exportTextboxAsSVG({
 *   text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
 *   x: 100,
 *   y: 100,
 *   width: 300,
 *   fontSize: 16,
 *   fontFamily: 'Arial',
 *   fill: 'black'
 * });
 * console.log(svg);
 * ```
 */
export function exportTextboxAsSVG(
  options: RenderTextboxOptions,
  svgOptions: SVGExportOptions = {}
): string {
  const {
    text,
    x,
    y,
    width,
    fontSize = 40,
    fontFamily = 'Arial',
    fontWeight = 'normal',
    fontStyle = 'normal',
    fill = 'black',
    textAlign = 'left',
    lineHeight = 1.16,
    charSpacing = 0,
    minWidth = 20,
    splitByGrapheme = false
  } = options;

  // Criar uma instância do MyTextbox
  const textbox = new MyTextbox(text, {
    left: x,
    top: y,
    width: width,
    fontSize: fontSize,
    fontFamily: fontFamily,
    fontWeight: fontWeight,
    fontStyle: fontStyle,
    fill: fill,
    textAlign: textAlign,
    lineHeight: lineHeight,
    charSpacing: charSpacing,
    minWidth: minWidth,
    splitByGrapheme: splitByGrapheme
  } as Partial<FullTextboxProps>);

  // Exportar como SVG
  return textbox.toSVG(svgOptions);
}

/**
 * Versão simplificada para casos básicos
 */
export function renderSimpleTextbox(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  width: number,
  fontSize: number = 16
): void {
  renderMyTextbox(ctx, {
    text,
    x,
    y,
    width,
    fontSize,
    fontFamily: 'Arial',
    fill: 'black'
  });
}

/**
 * Versão simplificada para exportação SVG
 */
export function exportSimpleTextboxAsSVG(
  text: string,
  x: number,
  y: number,
  width: number,
  fontSize: number = 16,
  svgOptions: SVGExportOptions = {}
): string {
  return exportTextboxAsSVG({
    text,
    x,
    y,
    width,
    fontSize,
    fontFamily: 'Arial',
    fill: 'black'
  }, svgOptions);
}

/**
 * Classe utilitária para criar e reutilizar textboxes
 */
export class TextboxRenderer {
  private textboxes: Map<string, MyTextbox> = new Map();

  /**
   * Cria ou atualiza um textbox com ID
   */
  createOrUpdate(id: string, options: RenderTextboxOptions): MyTextbox {
    let textbox = this.textboxes.get(id);
    
    if (!textbox) {
      textbox = new MyTextbox(options.text, {
        left: options.x,
        top: options.y,
        width: options.width,
        fontSize: options.fontSize || 40,
        fontFamily: options.fontFamily || 'Arial',
        fontWeight: options.fontWeight || 'normal',
        fontStyle: options.fontStyle || 'normal',
        fill: options.fill || 'black',
        textAlign: options.textAlign || 'left',
        lineHeight: options.lineHeight || 1.16,
        charSpacing: options.charSpacing || 0,
        minWidth: options.minWidth || 20,
        splitByGrapheme: options.splitByGrapheme || false
      } as Partial<FullTextboxProps>);
      this.textboxes.set(id, textbox);
    } else {
      textbox.set({
        text: options.text,
        left: options.x,
        top: options.y,
        width: options.width,
        fontSize: options.fontSize || textbox.fontSize,
        fontFamily: options.fontFamily || textbox.fontFamily,
        fontWeight: options.fontWeight || textbox.fontWeight,
        fontStyle: options.fontStyle || textbox.fontStyle,
        fill: options.fill || textbox.fill,
        textAlign: options.textAlign || textbox.textAlign,
        lineHeight: options.lineHeight || textbox.lineHeight,
        charSpacing: options.charSpacing || textbox.charSpacing,
        minWidth: options.minWidth || textbox.minWidth,
        splitByGrapheme: options.splitByGrapheme !== undefined ? options.splitByGrapheme : textbox.splitByGrapheme
      } as Partial<FullTextboxProps>);
    }

    return textbox;
  }

  /**
   * Renderiza um textbox por ID
   */
  render(ctx: CanvasRenderingContext2D, id: string): void {
    const textbox = this.textboxes.get(id);
    if (textbox) {
      textbox.render(ctx);
    }
  }

  /**
   * Exporta um textbox como SVG por ID
   */
  exportAsSVG(id: string, svgOptions: SVGExportOptions = {}): string {
    const textbox = this.textboxes.get(id);
    if (textbox) {
      return textbox.toSVG(svgOptions);
    }
    return '';
  }

  /**
   * Renderiza todos os textboxes
   */
  renderAll(ctx: CanvasRenderingContext2D): void {
    for (const textbox of this.textboxes.values()) {
      textbox.render(ctx);
    }
  }

  /**
   * Exporta todos os textboxes como um único SVG
   */
  exportAllAsSVG(svgOptions: SVGExportOptions = {}): string {
    const svgElements: string[] = [];
    
    for (const textbox of this.textboxes.values()) {
      const svg = textbox.toSVG({ ...svgOptions, includeWrapper: false });
      if (svg) {
        svgElements.push(svg);
      }
    }
    
    if (svgOptions.includeWrapper !== false) {
      return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">\n${svgElements.join('\n')}\n</svg>`;
    }
    
    return svgElements.join('\n');
  }

  /**
   * Remove um textbox
   */
  remove(id: string): boolean {
    return this.textboxes.delete(id);
  }

  /**
   * Limpa todos os textboxes
   */
  clear(): void {
    this.textboxes.clear();
  }

  /**
   * Obtém um textbox por ID
   */
  get(id: string): MyTextbox | undefined {
    return this.textboxes.get(id);
  }
} 