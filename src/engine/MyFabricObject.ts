import { EventEmitter } from '../utils/fabric-utils';

/**
 * MyFabricObject - Versão super simplificada do FabricObject
 * Contém apenas as propriedades essenciais para renderização
 */
export class MyFabricObject extends EventEmitter {
  // Propriedades de posição
  left: number = 0;
  top: number = 0;
  
  // Propriedades de dimensão
  width: number = 100;
  height: number = 100;
  
  // Propriedades de aparência
  fill: string = 'black';
  stroke?: string;
  strokeWidth: number = 1;
  opacity: number = 1;
  
  // Propriedades de comportamento
  visible: boolean = true;
  
  constructor(options: Partial<MyFabricObject> = {}) {
    super();
    Object.assign(this, options);
  }

  /**
   * Método principal de renderização - deve ser sobrescrito nas subclasses
   */
  render(ctx: CanvasRenderingContext2D): void {
    if (!this.visible) return;
    
    ctx.save();
    
    // Aplicar opacidade
    ctx.globalAlpha = this.opacity;
    
    // Chamar o método de renderização específico
    this._render(ctx);
    
    ctx.restore();
  }

  /**
   * Método de renderização interna - para ser sobrescrito nas subclasses
   */
  protected _render(_ctx: CanvasRenderingContext2D): void {
    // Implementação vazia - será sobrescrita nas subclasses
  }

  /**
   * Exporta o objeto como SVG
   * Este é um método base que deve ser sobrescrito nas subclasses
   * que implementam renderização específica
   * 
   * @returns String SVG representando o objeto
   */
  toSVG(): string {
    // Implementação base - retorna um comentário SVG
    // As subclasses devem sobrescrever este método para gerar SVG específico
    return `<!-- MyFabricObject: implementação de toSVG() deve ser sobrescrita nas subclasses -->`;
  }

  /**
   * Gera os atributos SVG básicos comuns a todos os objetos
   * @protected
   */
  protected _getSVGBaseAttributes(): string {
    const attributes: string[] = [];
    
    if (this.opacity !== 1) {
      attributes.push(`opacity="${this.opacity}"`);
    }
    
    if (!this.visible) {
      attributes.push(`visibility="hidden"`);
    }
    
    return attributes.join(' ');
  }

  /**
   * Gera a tag de transformação SVG para posicionamento
   * @protected
   */
  protected _getSVGTransform(): string {
    if (this.left === 0 && this.top === 0) {
      return '';
    }
    return `transform="translate(${this.left}, ${this.top})"`;
  }

  /**
   * Define múltiplas propriedades do objeto
   */
  set(properties: Partial<MyFabricObject>): this {
    Object.assign(this, properties);
    return this;
  }

  /**
   * Clona o objeto
   */
  clone(): MyFabricObject {
    const cloned = new MyFabricObject();
    Object.assign(cloned, this);
    return cloned;
  }

  /**
   * Converte para objeto simples
   */
  toObject(): Record<string, any> {
    return {
      left: this.left,
      top: this.top,
      width: this.width,
      height: this.height,
      fill: this.fill,
      stroke: this.stroke,
      strokeWidth: this.strokeWidth,
      opacity: this.opacity,
      visible: this.visible,
    };
  }
} 