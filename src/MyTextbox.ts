import { MyIText } from './MyIText';
import type { ITextProps } from './MyIText';
import {
  createSVGWrapper,
  createSVGGroup,
  createSVGElement,
  createTextSpan,
  fontPropsToSVG,
  getTextAnchorForAlignment,
  getXOffsetForAlignment,
  lineHeightToDy
} from './svg-utils';

/**
 * Interface para propriedades do Textbox
 */
export interface TextboxProps extends ITextProps {
  minWidth?: number;
  splitByGrapheme?: boolean;
}

/**
 * MyTextbox - Versão simplificada da classe Textbox do Fabric.js
 * Implementa quebra de linha automática baseada na largura definida
 */
export class MyTextbox extends MyIText {
  // Propriedades específicas do Textbox
  minWidth: number = 20;
  splitByGrapheme: boolean = false;

  // Cache para linhas quebradas
  protected _wrappedTextLines: string[] = [];

  constructor(text: string = '', options: Partial<TextboxProps> = {}) {
    super(text, options);
    Object.assign(this, options);
    this._wrapText();
  }

  /**
   * Quebra o texto em linhas baseado na largura
   */
  protected _wrapText(): void {
    if (!this.text) {
      this._wrappedTextLines = [];
      return;
    }

    const ctx = this._getMeasuringContext();
    this._setTextStyles(ctx);

    const lines = this.text.split(/\r?\n/);
    this._wrappedTextLines = [];

    for (const line of lines) {
      if (!line) {
        this._wrappedTextLines.push('');
        continue;
      }

      const wrappedLines = this._wrapLine(line, ctx);
      this._wrappedTextLines.push(...wrappedLines);
    }

    // Atualizar _textLines para usar as linhas quebradas
    this._textLines = this._wrappedTextLines;
  }

  /**
   * Quebra uma única linha de texto
   */
  protected _wrapLine(line: string, ctx: CanvasRenderingContext2D): string[] {
    const maxWidth = this.width;
    
    // Se a linha já cabe, retorna ela mesma
    if (this._measureLine(line, ctx) <= maxWidth) {
      return [line];
    }

    const words = this.splitByGrapheme 
      ? line.split('') 
      : line.split(/(\s+)/);
    
    const wrappedLines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine + word;
      const testWidth = this._measureLine(testLine, ctx);

      if (testWidth <= maxWidth || !currentLine) {
        currentLine = testLine;
      } else {
        // A palavra não cabe na linha atual
        if (currentLine) {
          wrappedLines.push(currentLine.trim());
          currentLine = word;
        } else {
          // Palavra muito longa, quebra caractere por caractere
          if (this.splitByGrapheme || word.length === 1) {
            wrappedLines.push(word);
            currentLine = '';
          } else {
            const chars = word.split('');
            let charLine = '';
            for (const char of chars) {
              const charTestLine = charLine + char;
              if (this._measureLine(charTestLine, ctx) <= maxWidth) {
                charLine = charTestLine;
              } else {
                if (charLine) {
                  wrappedLines.push(charLine);
                }
                charLine = char;
              }
            }
            if (charLine) {
              currentLine = charLine;
            }
          }
        }
      }
    }

    if (currentLine) {
      wrappedLines.push(currentLine.trim());
    }

    return wrappedLines.length > 0 ? wrappedLines : [''];
  }

  /**
   * Calcula as dimensões considerando quebra de linha
   */
  protected _initDimensions(): void {
    if (!this.text) {
      this.height = 0;
      return;
    }

    // Quebrar o texto primeiro
    this._wrapText();

    // Calcular altura baseada nas linhas quebradas
    this.height = this._wrappedTextLines.length * this.fontSize * this.lineHeight;
  }

  /**
   * Override do _splitTextIntoLines para usar quebra automática
   */
  protected _splitTextIntoLines(): void {
    // No Textbox, usamos _wrapText() em vez de _splitTextIntoLines()
    // porque precisamos considerar a largura para quebra
    this._wrapText();
  }

  /**
   * Exporta o textbox como SVG com quebra de linha automática
   * @param options Opções adicionais para o SVG
   * @returns String SVG representando o textbox
   */
  toSVG(options: { 
    includeWrapper?: boolean;
    includePosition?: boolean;
    includeBounds?: boolean;
  } = {}): string {
    const { includeWrapper = true, includePosition = true, includeBounds = false } = options;

    if (!this.text || !this._wrappedTextLines.length) {
      return includeWrapper ? createSVGWrapper('') : '';
    }

    // Gerar os tspans para cada linha quebrada
    const tspans: string[] = [];
    const xOffset = getXOffsetForAlignment(this.textAlign, this.width);
    
    for (let i = 0; i < this._wrappedTextLines.length; i++) {
      const line = this._wrappedTextLines[i];
      const isFirstLine = i === 0;
      
      if (line || isFirstLine) {
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

    // Opcional: incluir retângulo de bounds para debug/visualização
    let content = textElement;
    if (includeBounds) {
      const boundsRect = createSVGElement('rect', {
        x: 0,
        y: 0,
        width: this.width,
        height: this.height,
        fill: 'none',
        stroke: '#cccccc',
        'stroke-width': 1,
        'stroke-dasharray': '2,2'
      });
      content = boundsRect + '\n' + textElement;
    }

    // Envolver em grupo com transformação se necessário
    if (includePosition && (this.left !== 0 || this.top !== 0)) {
      const transform = this._getSVGTransform();
      content = createSVGGroup(content, transform);
    }

    // Retornar com ou sem wrapper SVG
    if (includeWrapper) {
      const totalWidth = Math.max(this.width + this.left, this.minWidth || 100);
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
   * Define a largura e re-quebra o texto
   */
  setWidth(width: number): this {
    this.width = Math.max(width, this.minWidth);
    this._clearCache();
    this._wrapText();
    this._initDimensions();
    return this;
  }

  /**
   * Override do setText para re-quebrar o texto
   */
  setText(text: string): this {
    this.text = text;
    this._clearCache();
    this._wrapText();
    this._initDimensions();
    return this;
  }

  /**
   * Override do set para incluir propriedades do Textbox
   */
  set(properties: Partial<TextboxProps & { width?: number }>): this {
    const needsRewrap = properties.width !== undefined ||
                        properties.minWidth !== undefined ||
                        properties.splitByGrapheme !== undefined ||
                        properties.text !== undefined ||
                        properties.fontSize !== undefined ||
                        properties.fontFamily !== undefined ||
                        properties.fontWeight !== undefined ||
                        properties.fontStyle !== undefined ||
                        properties.charSpacing !== undefined;

    super.set(properties);

    if (properties.minWidth !== undefined) {
      this.width = Math.max(this.width, this.minWidth);
    }

    if (needsRewrap) {
      this._clearCache();
      this._wrapText();
      this._initDimensions();
    }

    return this;
  }

  /**
   * Obtém as linhas quebradas
   */
  getWrappedLines(): string[] {
    return [...this._wrappedTextLines];
  }
} 