import { EventEmitter } from './fabric-utils';

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