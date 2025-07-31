import { MyText } from './MyText';
import type { TextProps } from './MyText';

/**
 * Interface para propriedades do IText
 */
export interface ITextProps extends TextProps {
  selectionStart?: number;
  selectionEnd?: number;
  selectionColor?: string;
  isEditing?: boolean;
  editable?: boolean;
}

/**
 * MyIText - Versão simplificada da classe IText do Fabric.js
 * Focada apenas na renderização, sem funcionalidades interativas reais
 * (mantém a interface para compatibilidade, mas não implementa interatividade)
 */
export class MyIText extends MyText {
  // Propriedades de seleção (apenas para interface, não implementadas)
  selectionStart: number = 0;
  selectionEnd: number = 0;
  selectionColor: string = 'rgba(17,119,255,0.3)';
  isEditing: boolean = false;
  editable: boolean = true;

  constructor(text: string = '', options: Partial<ITextProps> = {}) {
    super(text, options);
    Object.assign(this, options);
  }

  /**
   * Define o início da seleção (interface apenas)
   */
  setSelectionStart(index: number): this {
    this.selectionStart = Math.max(index, 0);
    return this;
  }

  /**
   * Define o fim da seleção (interface apenas)
   */
  setSelectionEnd(index: number): this {
    this.selectionEnd = Math.min(index, this.text.length);
    return this;
  }

  /**
   * Obtém o texto selecionado (interface apenas)
   */
  getSelectedText(): string {
    return this.text.slice(this.selectionStart, this.selectionEnd);
  }

  /**
   * Para o futuro: renderização com cursor/seleção
   * Por enquanto, apenas renderiza o texto normal
   */
  protected _render(ctx: CanvasRenderingContext2D): void {
    super._render(ctx);
    
    // No futuro, aqui poderíamos renderizar cursor ou seleção
    // Por agora, mantemos apenas a renderização básica do texto
  }

  /**
   * Override do set para incluir propriedades do IText
   */
  set(properties: Partial<ITextProps>): this {
    super.set(properties);
    return this;
  }
} 