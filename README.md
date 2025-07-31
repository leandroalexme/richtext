# Fabric RichText Engine

Motor de texto rico com quebra de linha automática, baseado no Fabric.js. Desenvolvido para ser facilmente integrado em projetos como o Suika.

## 🚀 Instalação

```bash
npm install fabric-richtext-engine
```

## 📋 Funcionalidades

- ✅ **Quebra de linha automática** baseada na largura definida
- ✅ **Múltiplos alinhamentos**: left, center, right, justify
- ✅ **Quebra por caractere** para textos sem espaços
- ✅ **Exportação SVG** com alta qualidade
- ✅ **Renderização em Canvas** otimizada para High-DPI
- ✅ **Sistema de estilos** completo (fonte, cor, peso, etc.)
- ✅ **Performance otimizada** com medição de texto compartilhada

## 🎯 Uso Básico

### Importação

```typescript
import { MyTextbox, renderMyTextbox, exportTextboxAsSVG } from 'fabric-richtext-engine';
```

### Criar e Renderizar Textbox

```typescript
// Criar uma instância de textbox
const textbox = new MyTextbox('Seu texto aqui', {
  left: 100,
  top: 100,
  width: 300,
  fontSize: 16,
  fontFamily: 'Arial',
  fill: 'black',
  textAlign: 'left',
  lineHeight: 1.3
});

// Renderizar no canvas
const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
textbox.render(ctx);
```

### Função de Renderização Direta

```typescript
// Renderizar diretamente sem instanciar classe
renderMyTextbox(ctx, {
  text: 'Lorem ipsum dolor sit amet...',
  x: 50,
  y: 50,
  width: 250,
  fontSize: 18,
  fontFamily: 'Georgia',
  fill: 'blue',
  textAlign: 'justify',
  lineHeight: 1.3
});
```

### Exportação SVG

```typescript
// Exportar como SVG
const svg = exportTextboxAsSVG({
  text: 'Texto para exportar',
  x: 100,
  y: 100,
  width: 300,
  fontSize: 16,
  fontFamily: 'Arial',
  fill: '#333',
  textAlign: 'center'
}, {
  includeWrapper: true,
  includeBounds: true,
  includePosition: true
});

console.log(svg); // String SVG pronta para usar
```

## 🔧 API Reference

### MyTextbox

```typescript
class MyTextbox extends MyIText {
  constructor(text: string, options: Partial<TextboxProps>)
  
  // Métodos principais
  render(ctx: CanvasRenderingContext2D): void
  toSVG(options?: SVGExportOptions): string
  setWidth(width: number): this
  set(properties: Partial<TextboxProps>): this
}
```

### Propriedades Disponíveis

```typescript
interface TextboxProps {
  // Posição e dimensões
  left?: number;           // Posição X
  top?: number;            // Posição Y  
  width?: number;          // Largura do textbox
  
  // Estilo do texto
  fontSize?: number;       // Tamanho da fonte
  fontFamily?: string;     // Família da fonte
  fontWeight?: string;     // Peso da fonte (normal, bold, etc.)
  fontStyle?: string;      // Estilo da fonte (normal, italic)
  fill?: string;           // Cor do texto
  
  // Layout do texto
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  lineHeight?: number;     // Altura da linha (multiplier)
  charSpacing?: number;    // Espaçamento entre caracteres
  
  // Comportamento
  minWidth?: number;       // Largura mínima
  splitByGrapheme?: boolean; // Quebrar por caractere
}
```

### Funções de Utilidade

```typescript
// Renderização direta
renderMyTextbox(ctx: CanvasRenderingContext2D, options: RenderTextboxOptions): void

// Exportação SVG
exportTextboxAsSVG(options: RenderTextboxOptions, svgOptions?: SVGExportOptions): string

// Medição otimizada
getMeasuringContext(): CanvasRenderingContext2D

// Utilitários
clone(obj: any): any
extend(destination: any, ...sources: any[]): any
degreesToRadians(degrees: number): number
rotatePoint(point: Point, origin: Point, radians: number): Point
```

## 🎨 Integração no Suika

Exemplo de como integrar no Suika:

```typescript
import { MyTextbox } from 'fabric-richtext-engine';

class SuikaTextElement {
  private textbox: MyTextbox;
  
  constructor(text: string, x: number, y: number, width: number) {
    this.textbox = new MyTextbox(text, {
      left: x,
      top: y,
      width: width,
      fontSize: 16,
      fontFamily: 'Arial'
    });
  }
  
  render(ctx: CanvasRenderingContext2D) {
    this.textbox.render(ctx);
  }
  
  updateText(newText: string) {
    this.textbox.set({ text: newText });
  }
  
  updatePosition(x: number, y: number) {
    this.textbox.set({ left: x, top: y });
  }
  
  exportAsSVG(): string {
    return this.textbox.toSVG();
  }
}
```

## 🎮 Demo

Para ver a demonstração em funcionamento:

```bash
npm run demo
```

Isso iniciará uma aplicação de demonstração com:
- Canvas fullscreen
- Textos arrastáveis
- Zoom com scroll
- Pan com botão do meio
- Exportação SVG

## 🏗️ Arquitetura

O projeto está organizado para separar claramente o **motor** da **demonstração**:

```
src/
├── index.ts              # 🎯 Ponto de entrada da biblioteca
├── MyFabricObject.ts     # Classe base para objetos
├── MyText.ts             # Classe de texto básico
├── MyIText.ts            # Classe de texto interativo
├── MyTextbox.ts          # Classe de textbox com quebra de linha
├── textbox-renderer.ts   # Funções de renderização
├── svg-utils.ts          # Utilitários para exportação SVG
├── fabric-utils.ts       # Utilitários gerais
├── demo.ts               # 📱 Aplicação de demonstração
└── main.ts               # Entrada da demo
```

## 🛠️ Build

```bash
# Build da biblioteca
npm run build:lib

# Build da demo
npm run build

# Desenvolvimento
npm run dev
```

## 📦 Estrutura do Pacote

Quando publicado, o pacote terá:

```
dist/
├── index.js              # Ponto de entrada compilado
├── index.d.ts            # Tipos TypeScript
├── MyTextbox.js          # Classes compiladas
├── MyTextbox.d.ts        # Tipos das classes
└── ...                   # Outros arquivos compilados
```

## 🔄 Uso no Suika

Para integrar no Suika, você importaria apenas o que precisa:

```typescript
// Apenas as classes essenciais
import { MyTextbox } from 'fabric-richtext-engine';

// Ou funções específicas
import { renderMyTextbox, exportTextboxAsSVG } from 'fabric-richtext-engine';
```

**Vantagens:**
- ✅ API limpa e focada
- ✅ Tree-shaking automático 
- ✅ Tipagem completa
- ✅ Zero dependências externas
- ✅ Performance otimizada
- ✅ Fácil integração

## 📄 Licença

MIT License - veja o arquivo LICENSE para detalhes. 