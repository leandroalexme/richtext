// src/index.ts

// Exporta as classes principais que o Suika irá instanciar e manipular
export { MyTextbox } from './engine/MyTextbox';
export { MyIText } from './engine/MyIText';
export { MyText } from './engine/MyText';
export { MyFabricObject } from './engine/MyFabricObject';

// Exporta as funções de renderização/exportação que podem ser úteis
export { renderMyTextbox, exportTextboxAsSVG } from './renderer/textbox-renderer';

// Exporta os tipos e interfaces que o Suika precisará para interagir com seu motor
export type { TextboxProps } from './engine/MyTextbox';
export type { RenderTextboxOptions, SVGExportOptions } from './renderer/textbox-renderer';

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
} from './utils/fabric-utils'; 