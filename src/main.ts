import './style.css'
import { 
  clone, 
  extend, 
  degreesToRadians, 
  rotatePoint, 
  capitalize, 
  parseUnit,
  typeOf,
  EventEmitter 
} from './fabric-utils'
import { 
  renderMyTextbox, 
  renderSimpleTextbox,
  exportTextboxAsSVG,
  exportSimpleTextboxAsSVG
} from './textbox-renderer'
import { MyTextbox } from './MyTextbox'

// Estado do viewport (zoom e pan)
interface ViewportState {
  scale: number;
  translateX: number;
  translateY: number;
  isDragging: boolean;
  lastMouseX: number;
  lastMouseY: number;
}

// Interface para objetos arrastáveis
interface DraggableObject {
  contains(mouseX: number, mouseY: number): boolean;
  startDrag(mouseX: number, mouseY: number): void;
  drag(mouseX: number, mouseY: number): void;
  stopDrag(): void;
  draw(ctx: CanvasRenderingContext2D): void;
  isDragging: boolean;
}

class DraggableSquare implements DraggableObject {
  x: number
  y: number
  width: number
  height: number
  color: string
  isDragging: boolean
  dragOffsetX: number
  dragOffsetY: number

  constructor(x: number, y: number, width: number, height: number, color: string = '#FF6B6B') {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.color = color
    this.isDragging = false
    this.dragOffsetX = 0
    this.dragOffsetY = 0
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color
    ctx.fillRect(this.x, this.y, this.width, this.height)
  }

  contains(mouseX: number, mouseY: number): boolean {
    return mouseX >= this.x && 
           mouseX <= this.x + this.width && 
           mouseY >= this.y && 
           mouseY <= this.y + this.height
  }

  startDrag(mouseX: number, mouseY: number) {
    this.isDragging = true
    this.dragOffsetX = mouseX - this.x
    this.dragOffsetY = mouseY - this.y
  }

  drag(mouseX: number, mouseY: number) {
    if (this.isDragging) {
      this.x = mouseX - this.dragOffsetX
      this.y = mouseY - this.dragOffsetY
    }
  }

  stopDrag() {
    this.isDragging = false
  }
}

class DraggableTextbox implements DraggableObject {
  textbox: MyTextbox
  isDragging: boolean
  dragOffsetX: number
  dragOffsetY: number

  constructor(text: string, x: number, y: number, width: number, options: any = {}) {
    this.textbox = new MyTextbox(text, {
      left: x,
      top: y,
      width: width,
      fontSize: options.fontSize || 16,
      fontFamily: options.fontFamily || 'Arial',
      fill: options.fill || 'black',
      textAlign: options.textAlign || 'left',
      lineHeight: options.lineHeight || 1.3,
      ...options
    });
    this.isDragging = false
    this.dragOffsetX = 0
    this.dragOffsetY = 0
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.textbox.render(ctx);
  }

  contains(mouseX: number, mouseY: number): boolean {
    return mouseX >= this.textbox.left && 
           mouseX <= this.textbox.left + this.textbox.width && 
           mouseY >= this.textbox.top && 
           mouseY <= this.textbox.top + this.textbox.height
  }

  startDrag(mouseX: number, mouseY: number) {
    this.isDragging = true
    this.dragOffsetX = mouseX - this.textbox.left
    this.dragOffsetY = mouseY - this.textbox.top
  }

  drag(mouseX: number, mouseY: number) {
    if (this.isDragging) {
      this.textbox.left = mouseX - this.dragOffsetX;
      this.textbox.top = mouseY - this.dragOffsetY;
    }
  }

  stopDrag() {
    this.isDragging = false
  }
}

function testUtilities() {
  console.log('=== Testando Funções Utilitárias ===')
  
  // Teste clone
  const obj = { name: 'test', nested: { value: 42 } }
  const cloned = clone(obj)
  cloned.nested.value = 100
  console.log(`✓ Clone: original=${obj.nested.value}, cloned=${cloned.nested.value}`)

  // Teste extend
  const base = { a: 1, b: 2 }
  const extended = extend({}, base, { c: 3, d: 4 })
  console.log(`✓ Extend:`, extended)

  // Teste conversões
  const radians = degreesToRadians(90)
  console.log(`✓ 90° = ${radians} radianos`)

  // Teste rotação de ponto
  const rotated = rotatePoint({ x: 10, y: 0 }, { x: 0, y: 0 }, Math.PI / 2)
  console.log(`✓ Rotação 90°: (10,0) → (${rotated.x.toFixed(1)}, ${rotated.y.toFixed(1)})`)

  // Teste string utilities
  console.log(`✓ Capitalize: ${capitalize('hello world')}`)

  // Teste parseUnit
  console.log(`✓ parseUnit: 10px=${parseUnit('10px')}, 2em=${parseUnit('2em', 16)}`)

  // Teste type checking
  console.log(`✓ TypeOf: isString('hello')=${typeOf.isString('hello')}, isNumber(42)=${typeOf.isNumber(42)}`)

  // Teste EventEmitter
  const emitter = new EventEmitter()
  emitter.on('test', (msg: string) => console.log(`✓ Event: ${msg}`))
  emitter.emit('test', 'Hello from EventEmitter!')

  console.log('=== Testes Concluídos ===')
}

function testSVGExport() {
  console.log('=== Testando Exportação SVG ===')

  // Teste 1: SVG simples
  const svg1 = exportSimpleTextboxAsSVG(
    'Hello World!\nThis is a test.',
    10,
    10,
    200,
    16
  )
  console.log('✓ SVG Simples gerado:')
  console.log(svg1)

  // Teste 2: SVG com configurações avançadas
  const svg2 = exportTextboxAsSVG({
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    x: 50,
    y: 50,
    width: 250,
    fontSize: 18,
    fontFamily: 'Georgia',
    fill: 'blue',
    textAlign: 'center',
    lineHeight: 1.3
  }, {
    includeBounds: true
  })
  console.log('✓ SVG Avançado gerado (com bounds):')
  console.log(svg2)

  // Teste 3: SVG com alinhamento à direita
  const svg3 = exportTextboxAsSVG({
    text: 'Right aligned text\nSecond line\nThird line',
    x: 100,
    y: 100,
    width: 200,
    fontSize: 14,
    fontFamily: 'Arial',
    fill: 'red',
    textAlign: 'right',
    fontWeight: 'bold'
  }, {
    includeWrapper: false,
    includePosition: false
  })
  console.log('✓ SVG Alinhado à direita (sem wrapper):')
  console.log(svg3)

  // Teste 4: SVG com quebra por caractere
  const svg4 = exportTextboxAsSVG({
    text: 'TextoMuitoLongoSemEspaçosParaTestarQuebraPorCaractere',
    x: 20,
    y: 20,
    width: 120,
    fontSize: 12,
    fill: 'green',
    splitByGrapheme: true
  })
  console.log('✓ SVG com quebra por caractere:')
  console.log(svg4)

  console.log('=== Testes SVG Concluídos ===')
}

function createDraggableTextboxes(): DraggableTextbox[] {
  console.log('=== Criando Textboxes Arrastáveis ===')

  const draggableTexts: DraggableTextbox[] = [];

  // Teste 1: Textbox básico arrastável
  draggableTexts.push(new DraggableTextbox(
    'Este é um texto simples para testar a quebra de linha automática.',
    50,
    50,
    200,
    { fontSize: 16 }
  ));

  // Teste 2: Textbox com configurações avançadas arrastável
  draggableTexts.push(new DraggableTextbox(
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    300,
    50,
    250,
    {
      fontSize: 18,
      fontFamily: 'Arial',
      fill: 'blue',
      textAlign: 'justify',
      lineHeight: 1.3
    }
  ));

  // Teste 3: Textbox com texto longo arrastável
  draggableTexts.push(new DraggableTextbox(
    'Este é um exemplo de texto muito longo que vai demonstrar como funciona a quebra de linha automática em nosso sistema de renderização de texto baseado no Fabric.js.',
    50,
    200,
    300,
    {
      fontSize: 14,
      fontFamily: 'Georgia',
      fill: 'darkgreen',
      lineHeight: 1.5
    }
  ));

  // Teste 4: Textbox com fonte grande arrastável
  draggableTexts.push(new DraggableTextbox(
    'TEXTO GRANDE',
    400,
    200,
    350,
    {
      fontSize: 32,
      fontFamily: 'Arial',
      fontWeight: 'bold',
      fill: 'red',
      textAlign: 'center'
    }
  ));

  // Teste 5: Textbox com quebra por caractere arrastável
  draggableTexts.push(new DraggableTextbox(
    'TextoMuitoLongoSemEspaçosParaTestarQuebraPorCaractere',
    50,
    400,
    150,
    {
      fontSize: 16,
      fill: 'purple',
      splitByGrapheme: true
    }
  ));

  console.log('✓ Textboxes arrastáveis criadas!')
  console.log('=== Criação de Textboxes Concluída ===')
  
  return draggableTexts;
}

/**
 * Configura um canvas para alta resolução (High-DPI/Retina)
 * Resolve o problema de texto borrado em telas de alta densidade
 */
function setupHighDPICanvas(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const ctx = canvas.getContext('2d')!;
  
  // --- INÍCIO DA CORREÇÃO PARA ALTA RESOLUÇÃO (HIGH-DPI) ---
  const dpr = window.devicePixelRatio || 1;
  console.log(`📱 Device Pixel Ratio detectado: ${dpr}x`);
  
  // Obter o tamanho visual do canvas (CSS)
  const rect = canvas.getBoundingClientRect();
  console.log(`📏 Tamanho CSS do canvas: ${rect.width}x${rect.height}px`);

  // 1. Fazer o canvas ter mais pixels internamente
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  console.log(`🎯 Resolução interna do canvas: ${canvas.width}x${canvas.height}px`);

  // 2. Usar o CSS para garantir que ele seja exibido no tamanho correto
  canvas.style.width = `${rect.width}px`;
  canvas.style.height = `${rect.height}px`;

  // 3. Aplicar um zoom no "pincel". A partir daqui, tudo que você desenhar
  //    será automaticamente renderizado na resolução mais alta.
  ctx.scale(dpr, dpr);
  console.log(`✨ Canvas configurado para High-DPI com escala ${dpr}x`);
  
  // --- FIM DA CORREÇÃO ---
  
  return ctx;
}

/**
 * Aplica as transformações de viewport (zoom e pan) no contexto
 */
function applyViewportTransform(ctx: CanvasRenderingContext2D, viewport: ViewportState): void {
  ctx.translate(viewport.translateX, viewport.translateY);
  ctx.scale(viewport.scale, viewport.scale);
}

/**
 * Converte coordenadas do mouse para o sistema de coordenadas do canvas transformado
 */
function screenToCanvas(
  screenX: number, 
  screenY: number, 
  viewport: ViewportState
): { x: number, y: number } {
  return {
    x: (screenX - viewport.translateX) / viewport.scale,
    y: (screenY - viewport.translateY) / viewport.scale
  };
}

/**
 * Desenha uma grade de fundo para ajudar na navegação
 */
function drawGrid(ctx: CanvasRenderingContext2D, viewport: ViewportState, canvasWidth: number, canvasHeight: number): void {
  ctx.save();
  
  // Calcular o tamanho da grade baseado no zoom
  let gridSize = 50;
  if (viewport.scale < 0.5) {
    gridSize = 100;
  } else if (viewport.scale > 2) {
    gridSize = 25;
  }
  
  // Calcular os limites visíveis
  const startX = Math.floor((-viewport.translateX / viewport.scale) / gridSize) * gridSize;
  const startY = Math.floor((-viewport.translateY / viewport.scale) / gridSize) * gridSize;
  const endX = startX + (canvasWidth / viewport.scale) + gridSize;
  const endY = startY + (canvasHeight / viewport.scale) + gridSize;
  
  ctx.strokeStyle = '#e0e0e0';
  ctx.lineWidth = 1 / viewport.scale;
  ctx.globalAlpha = Math.min(1, viewport.scale * 0.5);
  
  // Desenhar linhas verticais
  for (let x = startX; x <= endX; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, startY);
    ctx.lineTo(x, endY);
    ctx.stroke();
  }
  
  // Desenhar linhas horizontais
  for (let y = startY; y <= endY; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(startX, y);
    ctx.lineTo(endX, y);
    ctx.stroke();
  }
  
  ctx.restore();
}

/**
 * Desenha indicadores de origem (0,0)
 */
function drawOriginIndicator(ctx: CanvasRenderingContext2D, viewport: ViewportState): void {
  ctx.save();
  
  const size = 20 / viewport.scale;
  
  // Eixo X (vermelho)
  ctx.strokeStyle = '#ff0000';
  ctx.lineWidth = 2 / viewport.scale;
  ctx.beginPath();
  ctx.moveTo(-size, 0);
  ctx.lineTo(size, 0);
  ctx.stroke();
  
  // Eixo Y (verde)
  ctx.strokeStyle = '#00ff00';
  ctx.beginPath();
  ctx.moveTo(0, -size);
  ctx.lineTo(0, size);
  ctx.stroke();
  
  // Círculo na origem
  ctx.fillStyle = '#333';
  ctx.beginPath();
  ctx.arc(0, 0, 3 / viewport.scale, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.restore();
}

function initCanvas() {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  
  // 🚀 CONFIGURAR CANVAS FULLSCREEN
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // Reaplicar correção de alta resolução após redimensionamento
    ctx = setupHighDPICanvas(canvas);
  }
  
  // Configurar tamanho inicial e obter contexto
  resizeCanvas();
  
  // Reagir a mudanças de tamanho da janela
  window.addEventListener('resize', () => {
    resizeCanvas();
    redraw();
  });

  // 🎯 ESTADO DO VIEWPORT (ZOOM E PAN)
  const viewport: ViewportState = {
    scale: 1,
    translateX: 0,
    translateY: 0,
    isDragging: false,
    lastMouseX: 0,
    lastMouseY: 0
  };

  // Criar todos os textboxes arrastáveis
  const textboxes = createDraggableTextboxes();
  
  // Lista de objetos arrastáveis (incluindo os textboxes originais + formas)
  const draggableObjects: DraggableObject[] = [
    ...textboxes, // Todos os textos são arrastáveis
    new DraggableSquare(600, 450, 80, 80, '#FF6B6B'),
    new DraggableSquare(150, 300, 60, 100, '#4CAF50')
  ];

  // Executar testes das utilitárias
  testUtilities();

  // Executar testes de exportação SVG
  testSVGExport();

  function redraw() {
    // Limpar o canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Salvar estado do contexto
    ctx.save();
    
    // Aplicar transformações de viewport
    applyViewportTransform(ctx, viewport);
    
    // Desenhar grade de fundo
    drawGrid(ctx, viewport, canvas.width, canvas.height);
    
    // Desenhar indicadores de origem
    drawOriginIndicator(ctx, viewport);
    
    // Desenhar fundo cinza claro (área de trabalho)
    ctx.fillStyle = '#f8f8f8';
    ctx.fillRect(-1000, -1000, 2000, 2000);
    
    // Desenhar todos os objetos arrastáveis (incluindo textos e formas)
    draggableObjects.forEach(obj => obj.draw(ctx));
    
    // Restaurar estado do contexto
    ctx.restore();
  }

  let isMouseDown = false;
  let isObjectDragging = false;
  let currentDraggingObject: DraggableObject | null = null;

  // Função auxiliar para converter coordenadas do mouse considerando High-DPI
  function getMouseCoordinates(e: MouseEvent): { screen: { x: number; y: number }, canvas: { x: number; y: number } } {
    const rect = canvas.getBoundingClientRect();
    const screenCoords = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    const canvasCoords = screenToCanvas(screenCoords.x, screenCoords.y, viewport);
    
    return {
      screen: screenCoords,
      canvas: canvasCoords
    };
  }

  // 🎯 ZOOM APENAS COM RODA DO MOUSE
  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    
    const { canvas: canvasCoords } = getMouseCoordinates(e);
    
    // Fator de zoom
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.min(Math.max(viewport.scale * zoomFactor, 0.1), 10);
    
    // Calcular novo translate para manter o zoom centrado no cursor
    const scaleDiff = newScale - viewport.scale;
    viewport.translateX -= canvasCoords.x * scaleDiff;
    viewport.translateY -= canvasCoords.y * scaleDiff;
    viewport.scale = newScale;
    
    updateViewportInfo();
    redraw();
  });

  // Prevenir menu de contexto quando usar botão do meio
  canvas.addEventListener('contextmenu', (e) => {
    if (e.button === 1) {
      e.preventDefault();
    }
  });

  // 🎯 ARRASTAR OBJETOS (BOTÃO ESQUERDO) E PAN (BOTÃO DO MEIO)
  canvas.addEventListener('mousedown', (e) => {
    const { screen, canvas: canvasCoords } = getMouseCoordinates(e);
    
    // BOTÃO ESQUERDO: Apenas arrastar objetos
    if (e.button === 0) {
      // Verificar se clicou em algum objeto (em ordem reversa para priorizar objetos "acima")
      currentDraggingObject = null;
      for (let i = draggableObjects.length - 1; i >= 0; i--) {
        const obj = draggableObjects[i];
        if (obj.contains(canvasCoords.x, canvasCoords.y)) {
          isMouseDown = true;
          isObjectDragging = true;
          currentDraggingObject = obj;
          obj.startDrag(canvasCoords.x, canvasCoords.y);
          return; // Sair do loop após encontrar o primeiro objeto
        }
      }
      // Se não clicou em objeto, não faz nada (não inicia pan)
    }
    
    // BOTÃO DO MEIO: Pan do canvas
    else if (e.button === 1) {
      e.preventDefault(); // Prevenir comportamento padrão do botão do meio
      isMouseDown = true;
      isObjectDragging = false;
      viewport.isDragging = true;
      viewport.lastMouseX = screen.x;
      viewport.lastMouseY = screen.y;
      canvas.style.cursor = 'grabbing';
    }
  });

  canvas.addEventListener('mousemove', (e) => {
    const { screen, canvas: canvasCoords } = getMouseCoordinates(e);

    if (isMouseDown) {
      if (isObjectDragging && currentDraggingObject) {
        // Arrastar o objeto atual
        currentDraggingObject.drag(canvasCoords.x, canvasCoords.y);
      } else if (viewport.isDragging) {
        // Pan da viewport
        const deltaX = screen.x - viewport.lastMouseX;
        const deltaY = screen.y - viewport.lastMouseY;
        
        viewport.translateX += deltaX;
        viewport.translateY += deltaY;
        
        viewport.lastMouseX = screen.x;
        viewport.lastMouseY = screen.y;
        
        updateViewportInfo();
      }
      redraw();
    } else {
      // Atualizar cursor baseado no que está sob o mouse
      let overObject = false;
      for (const obj of draggableObjects) {
        if (obj.contains(canvasCoords.x, canvasCoords.y)) {
          canvas.style.cursor = 'grab';
          overObject = true;
          break;
        }
      }
      if (!overObject) {
        canvas.style.cursor = 'default';
      }
    }
  });

  canvas.addEventListener('mouseup', () => {
    isMouseDown = false;
    isObjectDragging = false;
    viewport.isDragging = false;
    
    // Parar de arrastar todos os objetos
    draggableObjects.forEach(obj => obj.stopDrag());
    currentDraggingObject = null;
    
    canvas.style.cursor = 'default';
  });

  canvas.addEventListener('mouseleave', () => {
    isMouseDown = false;
    isObjectDragging = false;
    viewport.isDragging = false;
    
    // Parar de arrastar todos os objetos
    draggableObjects.forEach(obj => obj.stopDrag());
    currentDraggingObject = null;
    
    canvas.style.cursor = 'default';
  });

  // 🎯 ATALHOS DE TECLADO - APENAS RESET
  document.addEventListener('keydown', (e) => {
    switch (e.key) {
      case '0':
        // Reset zoom e pan
        viewport.scale = 1;
        viewport.translateX = 0;
        viewport.translateY = 0;
        updateViewportInfo();
        redraw();
        break;
    }
  });

  function updateViewportInfo() {
    const info = document.getElementById('viewport-info');
    if (info) {
      info.innerHTML = `
        <strong>🔍 Viewport:</strong><br>
        Zoom: ${(viewport.scale * 100).toFixed(0)}%<br>
        Pan: ${viewport.translateX.toFixed(0)}, ${viewport.translateY.toFixed(0)}<br>
        <small>Scroll: zoom | Botão meio: pan | Esquerdo: arrastar | 0: reset</small>
      `;
    }
  }

  redraw();

  // Adicionar botão para testar exportação SVG no DOM
  addSVGTestButton();
  
  // Adicionar informações sobre a qualidade na tela
  addQualityInfo();
  
  // Adicionar informações do viewport
  addViewportInfo();
  updateViewportInfo();
}

function addSVGTestButton() {
  const button = document.createElement('button');
  button.textContent = 'Exportar Como SVG';
  button.style.position = 'absolute';
  button.style.top = '10px';
  button.style.right = '10px';
  button.style.padding = '10px 20px';
  button.style.backgroundColor = '#4CAF50';
  button.style.color = 'white';
  button.style.border = 'none';
  button.style.borderRadius = '5px';
  button.style.cursor = 'pointer';
  button.style.fontFamily = 'Arial, sans-serif';
  button.style.fontSize = '14px';
  button.style.zIndex = '1000';

  button.addEventListener('click', () => {
    const svg = exportTextboxAsSVG({
      text: 'Exemplo de texto exportado como SVG!\nCom quebra de linha automática e formatação.\nAgora em alta qualidade! ✨',
      x: 50,
      y: 50,
      width: 300,
      fontSize: 20,
      fontFamily: 'Arial',
      fill: '#2196F3',
      textAlign: 'center',
      lineHeight: 1.4
    }, {
      includeBounds: true
    });

    // Abrir SVG em nova janela
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(svg);
      newWindow.document.title = 'SVG Exportado - Alta Qualidade';
    }

    // Log no console também
    console.log('SVG exportado via botão:', svg);
  });

  document.body.appendChild(button);
}

function addQualityInfo() {
  const info = document.createElement('div');
  const dpr = window.devicePixelRatio || 1;
  
  info.innerHTML = `
    <strong>📱 Qualidade da Tela:</strong><br>
    Device Pixel Ratio: ${dpr}x<br>
    Canvas: ${dpr > 1 ? 'Alta Resolução ✨' : 'Resolução Padrão'}<br>
    <small>Texto agora ${dpr > 1 ? 'super nítido' : 'em qualidade padrão'}!</small>
  `;
  
  info.style.position = 'absolute';
  info.style.top = '10px';
  info.style.left = '10px';
  info.style.padding = '10px';
  info.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
  info.style.border = '1px solid #ddd';
  info.style.borderRadius = '5px';
  info.style.fontFamily = 'Arial, sans-serif';
  info.style.fontSize = '12px';
  info.style.zIndex = '1000';
  info.style.maxWidth = '200px';

  document.body.appendChild(info);
}

function addViewportInfo() {
  const info = document.createElement('div');
  info.id = 'viewport-info';
  
  info.style.position = 'absolute';
  info.style.bottom = '10px';
  info.style.left = '10px';
  info.style.padding = '10px';
  info.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
  info.style.border = '1px solid #ddd';
  info.style.borderRadius = '5px';
  info.style.fontFamily = 'Arial, sans-serif';
  info.style.fontSize = '12px';
  info.style.zIndex = '1000';
  info.style.maxWidth = '200px';

  document.body.appendChild(info);
}

document.addEventListener('DOMContentLoaded', initCanvas);
