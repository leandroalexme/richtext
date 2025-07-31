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
import { renderMyTextbox, renderSimpleTextbox } from './textbox-renderer'

class DraggableSquare {
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

function testTextbox(ctx: CanvasRenderingContext2D) {
  console.log('=== Testando Sistema de Textbox ===')

  // Teste 1: Textbox básico
  renderSimpleTextbox(
    ctx,
    'Este é um texto simples para testar a quebra de linha automática.',
    50,
    50,
    200,
    16
  )

  // Teste 2: Textbox com configurações avançadas
  renderMyTextbox(ctx, {
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    x: 300,
    y: 50,
    width: 250,
    fontSize: 18,
    fontFamily: 'Arial',
    fill: 'blue',
    textAlign: 'justify',
    lineHeight: 1.3
  })

  // Teste 3: Textbox com texto longo
  renderMyTextbox(ctx, {
    text: 'Este é um exemplo de texto muito longo que vai demonstrar como funciona a quebra de linha automática em nosso sistema de renderização de texto baseado no Fabric.js.',
    x: 50,
    y: 200,
    width: 300,
    fontSize: 14,
    fontFamily: 'Georgia',
    fill: 'darkgreen',
    lineHeight: 1.5
  })

  // Teste 4: Textbox com fonte grande
  renderMyTextbox(ctx, {
    text: 'TEXTO GRANDE',
    x: 400,
    y: 200,
    width: 350,
    fontSize: 32,
    fontFamily: 'Arial',
    fontWeight: 'bold',
    fill: 'red',
    textAlign: 'center'
  })

  // Teste 5: Textbox com quebra por caractere
  renderMyTextbox(ctx, {
    text: 'TextoMuitoLongoSemEspaçosParaTestarQuebraPorCaractere',
    x: 50,
    y: 400,
    width: 150,
    fontSize: 16,
    fill: 'purple',
    splitByGrapheme: true
  })

  console.log('✓ Renderização de textboxes concluída!')
  console.log('=== Testes de Textbox Concluídos ===')
}

function initCanvas() {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement
  const ctx = canvas.getContext('2d')!

  const square = new DraggableSquare(600, 450, 80, 80, '#FF6B6B')

  // Executar testes das utilitárias
  testUtilities()

  function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Desenhar fundo cinza claro
    ctx.fillStyle = '#f8f8f8'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Testar sistema de textbox
    testTextbox(ctx)
    
    // Desenhar o quadrado arrastável
    square.draw(ctx)
  }

  let isMouseDown = false

  canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    if (square.contains(mouseX, mouseY)) {
      isMouseDown = true
      square.startDrag(mouseX, mouseY)
    }
  })

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    if (isMouseDown && square.isDragging) {
      square.drag(mouseX, mouseY)
      redraw()
    }
  })

  canvas.addEventListener('mouseup', () => {
    isMouseDown = false
    square.stopDrag()
  })

  canvas.addEventListener('mouseleave', () => {
    isMouseDown = false
    square.stopDrag()
  })

  redraw()
}

document.addEventListener('DOMContentLoaded', initCanvas)
