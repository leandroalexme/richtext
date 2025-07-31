import { MyFabricObject } from './MyFabricObject';
import {
  createSVGWrapper,
  createSVGGroup,
  createSVGElement,
  createTextSpan,
  fontPropsToSVG,
  getTextAnchorForAlignment,
  getXOffsetForAlignment,
  lineHeightToDy
} from '../utils/svg-utils';
import { getMeasuringContext } from '../utils/fabric-utils';

/**
 * Interface para propriedades de texto
 */
export interface TextProps {
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string | number;
  fontStyle?: string;
  lineHeight?: number;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  charSpacing?: number;
}

/**
 * MyText - Versão simplificada da classe Text do Fabric.js
 * Focada apenas na renderização básica de texto
 */
export class MyText extends MyFabricObject {
  text: string = '';
  fontSize: number = 40;
  fontFamily: string = 'Arial';
  fontWeight: string | number = 'normal';
  fontStyle: string = 'normal';
  lineHeight: number = 1.16;
  textAlign: 'left' | 'center' | 'right' | 'justify' = 'left';
  charSpacing: number = 0;

  // Propriedades internas para cache
  protected _textLines: string[] = [];
  protected _charWidthsCache: Map<string, number> = new Map();

  constructor(text: string = '', options: Partial<TextProps & MyFabricObject> = {}) {
    super(options);
    this.text = text;
    Object.assign(this, options);
    this._splitTextIntoLines();
    this._initDimensions();
  }

  /**
   * Divide o texto em linhas
   */
  protected _splitTextIntoLines(): void {
    this._textLines = this.text.split(/\r?\n/);
  }

  /**
   * Calcula as dimensões do texto
   */
  protected _initDimensions(): void {
    if (!this.text) {
      this.width = 0;
      this.height = 0;
      return;
    }

    const ctx = this._getMeasuringContext();
    this._setTextStyles(ctx);
    
    let maxWidth = 0;
    for (const line of this._textLines) {
      const lineWidth = this._measureLine(line, ctx);
      maxWidth = Math.max(maxWidth, lineWidth);
    }

    this.width = maxWidth;
    this.height = this._textLines.length * this.fontSize * this.lineHeight;
  }

  /**
   * Obtém um contexto para medição de texto (otimizado com canvas compartilhado)
   */
  protected _getMeasuringContext(): CanvasRenderingContext2D {
    return getMeasuringContext();
  }

  /**
   * Define os estilos de texto no contexto
   */
  protected _setTextStyles(ctx: CanvasRenderingContext2D): void {
    ctx.font = `${this.fontStyle} ${this.fontWeight} ${this.fontSize}px ${this.fontFamily}`;
    ctx.fillStyle = this.fill;
    ctx.textAlign = this.textAlign as CanvasTextAlign;
    ctx.textBaseline = 'alphabetic';
  }

  /**
   * Mede uma linha de texto
   */
  protected _measureLine(line: string, ctx: CanvasRenderingContext2D): number {
    if (!line) return 0;
    
    const cacheKey = `${line}-${this.fontSize}-${this.fontFamily}-${this.charSpacing}`;
    if (this._charWidthsCache.has(cacheKey)) {
      return this._charWidthsCache.get(cacheKey)!;
    }

    let width = ctx.measureText(line).width;
    
    // Adicionar espaçamento entre caracteres
    if (this.charSpacing !== 0) {
      width += (line.length - 1) * this.charSpacing;
    }

    this._charWidthsCache.set(cacheKey, width);
    return width;
  }

  /**
   * Renderiza o texto no canvas
   */
  protected _render(ctx: CanvasRenderingContext2D): void {
    if (!this.text || !this._textLines.length) return;

    this._setTextStyles(ctx);

    const lineHeight = this.fontSize * this.lineHeight;
    const startY = this.top + this.fontSize; // baseline

    for (let i = 0; i < this._textLines.length; i++) {
      const line = this._textLines[i];
      const y = startY + (i * lineHeight);
      
      this._renderTextLine(ctx, line, this.left, y);
    }
  }

  /**
   * Renderiza uma linha de texto
   */
  protected _renderTextLine(ctx: CanvasRenderingContext2D, line: string, x: number, y: number): void {
    if (!line) return;

    if (this.charSpacing === 0) {
      // Renderização simples
      ctx.fillText(line, x, y);
    } else {
      // Renderização com espaçamento personalizado
      let currentX = x;
      for (const char of line) {
        ctx.fillText(char, currentX, y);
        currentX += ctx.measureText(char).width + this.charSpacing;
      }
    }
  }

  /**
   * Exporta o texto como SVG
   * @param options Opções adicionais para o SVG
   * @returns String SVG representando o texto
   */
  toSVG(options: { 
    includeWrapper?: boolean;
    includePosition?: boolean;
  } = {}): string {
    const { includeWrapper = true, includePosition = true } = options;

    if (!this.text || !this._textLines.length) {
      return includeWrapper ? createSVGWrapper('') : '';
    }

    // Gerar os tspans para cada linha
    const tspans: string[] = [];
    const xOffset = getXOffsetForAlignment(this.textAlign, this.width);
    
    for (let i = 0; i < this._textLines.length; i++) {
      const line = this._textLines[i];
      const isFirstLine = i === 0;
      
      if (line || isFirstLine) { // Incluir linhas vazias se não for a primeira
        const tspanAttributes: Record<string, string | number | undefined> = {
          x: xOffset,
          dy: lineHeightToDy(this.lineHeight, this.fontSize, isFirstLine)
        };

        // Adicionar espaçamento de caracteres se necessário
        if (this.charSpacing !== 0) {
          tspanAttributes['letter-spacing'] = `${this.charSpacing}px`;
        }

        tspans.push(createTextSpan(line, tspanAttributes));
      }
    }

    // Atributos da tag <text> principal
    const fontAttributes = fontPropsToSVG({
      fontFamily: this.fontFamily,
      fontSize: this.fontSize,
      fontWeight: this.fontWeight,
      fontStyle: this.fontStyle,
      fill: this.fill,
      stroke: this.stroke,
      strokeWidth: this.strokeWidth
    });

    const baseAttributes = this._getSVGBaseAttributes();
    const textAttributes: Record<string, string | number | undefined> = {
      ...fontAttributes,
      'text-anchor': getTextAnchorForAlignment(this.textAlign),
      'dominant-baseline': 'text-before-edge'
    };

    // Adicionar atributos base se existirem
    if (baseAttributes) {
      const baseAttrs = baseAttributes.split(' ');
      baseAttrs.forEach(attr => {
        const [key, value] = attr.split('=');
        if (key && value) {
          textAttributes[key] = value.replace(/['"]/g, '');
        }
      });
    }

    // Remover atributos undefined
    Object.keys(textAttributes).forEach(key => {
      if (textAttributes[key as keyof typeof textAttributes] === undefined) {
        delete textAttributes[key as keyof typeof textAttributes];
      }
    });

    const textElement = createSVGElement('text', textAttributes, tspans.join('\n  '));

    // Envolver em grupo com transformação se necessário
    let content = textElement;
    if (includePosition && (this.left !== 0 || this.top !== 0)) {
      const transform = this._getSVGTransform();
      content = createSVGGroup(textElement, transform);
    }

    // Retornar com ou sem wrapper SVG
    if (includeWrapper) {
      const totalWidth = Math.max(this.width + this.left, 100);
      const totalHeight = Math.max(this.height + this.top, 50);
      
      return createSVGWrapper(content, {
        width: totalWidth,
        height: totalHeight,
        viewBox: `0 0 ${totalWidth} ${totalHeight}`
      });
    }

    return content;
  }

  /**
   * Atualiza o texto e recalcula dimensões
   */
  setText(text: string): this {
    this.text = text;
    this._splitTextIntoLines();
    this._initDimensions();
    return this;
  }

  /**
   * Obtém o texto atual
   */
  getText(): string {
    return this.text;
  }

  /**
   * Define o tamanho da fonte e recalcula dimensões
   */
  setFontSize(fontSize: number): this {
    this.fontSize = fontSize;
    this._charWidthsCache.clear();
    this._initDimensions();
    return this;
  }

  /**
   * Define a família da fonte e recalcula dimensões
   */
  setFontFamily(fontFamily: string): this {
    this.fontFamily = fontFamily;
    this._charWidthsCache.clear();
    this._initDimensions();
    return this;
  }

  /**
   * Limpa o cache
   */
  protected _clearCache(): void {
    this._charWidthsCache.clear();
  }

  /**
   * Override do set para recalcular dimensões quando necessário
   */
  set(properties: Partial<TextProps & MyFabricObject>): this {
    const needsRecalculation = properties.text !== undefined ||
                               properties.fontSize !== undefined ||
                               properties.fontFamily !== undefined ||
                               properties.fontWeight !== undefined ||
                               properties.fontStyle !== undefined ||
                               properties.lineHeight !== undefined ||
                               properties.charSpacing !== undefined;

    super.set(properties);

    if (properties.text !== undefined) {
      this._splitTextIntoLines();
    }

    if (needsRecalculation) {
      this._clearCache();
      this._initDimensions();
    }

    return this;
  }
} 