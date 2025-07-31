import { MyIText } from './MyIText';
import type { ITextProps } from './MyIText';

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