// src/index.ts

// Exporta as classes principais que o Suika irá instanciar e manipular
export { MyTextbox } from './MyTextbox';
export { MyIText } from './MyIText';
export { MyText } from './MyText';
export { MyFabricObject } from './MyFabricObject';

// Exporta as funções de renderização/exportação que podem ser úteis
export { renderMyTextbox, exportTextboxAsSVG } from './textbox-renderer';

// Exporta os tipos e interfaces que o Suika precisará para interagir com seu motor
export type { TextboxProps } from './MyTextbox';
export type { RenderTextboxOptions, SVGExportOptions } from './textbox-renderer';

// Exporta utilitários que podem ser úteis para integração
export { 
  clone, 
  extend, 
  degreesToRadians, 
  rotatePoint, 
  capitalize, 
  parseUnit,
  typeOf,
  EventEmitter,
  getMeasuringContext 
} from './fabric-utils'; 