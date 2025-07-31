# Rich Text Canvas Renderer

Sistema de renderização de texto com quebra de linha automática baseado no Fabric.js, portado para funcionar de forma standalone sem dependências.

## 🎯 Objetivo

Este projeto implementa uma versão simplificada do sistema de text rendering do Fabric.js, focada especificamente na renderização de texto com quebra de linha automática em Canvas HTML5, sem a necessidade de instalar a biblioteca completa do Fabric.js.

## ✨ Funcionalidades

- ✅ **Quebra de linha automática** baseada na largura definida
- ✅ **Suporte a diferentes fontes**, tamanhos e estilos
- ✅ **Alinhamento de texto** (left, center, right, justify)
- ✅ **Quebra por palavra ou por caractere** (splitByGrapheme)
- ✅ **Espaçamento entre caracteres** (charSpacing)
- ✅ **Altura de linha customizável** (lineHeight)
- ✅ **Cache de medições** para performance
- ✅ **Sistema de classes hierárquico** (MyFabricObject → MyText → MyIText → MyTextbox)
- ✅ **Interface simples** através da função `renderMyTextbox()`

## 🚀 Como usar

### Instalação e Setup

```bash
# Clone o repositório
git clone https://github.com/leandroalexme/richtext.git
cd richtext

# Instale as dependências
npm install

# Execute o projeto
npm run dev
```

### Uso básico

```typescript
import { renderMyTextbox } from './src/textbox-renderer';

// Obter o contexto do canvas
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

// Renderizar texto com quebra de linha
renderMyTextbox(ctx, {
  text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  x: 100,
  y: 100,
  width: 300,
  fontSize: 16,
  fontFamily: 'Arial',
  fill: 'black'
});
```

### Exemplo avançado

```typescript
renderMyTextbox(ctx, {
  text: 'Texto longo que será quebrado automaticamente em várias linhas.',
  x: 50,
  y: 50,
  width: 250,
  fontSize: 18,
  fontFamily: 'Georgia',
  fontWeight: 'bold',
  fontStyle: 'italic',
  fill: 'blue',
  textAlign: 'justify',
  lineHeight: 1.3,
  charSpacing: 1,
  splitByGrapheme: false,
  minWidth: 20
});
```

### Função simplificada

```typescript
import { renderSimpleTextbox } from './src/textbox-renderer';

renderSimpleTextbox(
  ctx,
  'Texto simples',
  x: 100,
  y: 100,
  width: 200,
  fontSize: 16
);
```

## 🏗️ Arquitetura

O projeto segue uma abordagem incremental "de baixo para cima", portando seletivamente apenas as funcionalidades essenciais do Fabric.js:

### Classes principais

1. **`Point`** - Classe para manipulação de coordenadas 2D
2. **`MyFabricObject`** - Classe base para objetos gráficos
3. **`MyText`** - Renderização básica de texto
4. **`MyIText`** - Extensão com propriedades de texto interativo (interface apenas)
5. **`MyTextbox`** - Implementação completa com quebra de linha automática

### Utilitários

- **`fabric-utils.ts`** - Funções utilitárias essenciais portadas do Fabric.js
- **`textbox-renderer.ts`** - Interface pública para renderização

## 📝 API

### renderMyTextbox(ctx, options)

Renderiza um textbox com quebra de linha automática.

#### Parâmetros

| Propriedade | Tipo | Padrão | Descrição |
|------------|------|--------|-----------|
| `text` | `string` | - | **Obrigatório**. Texto a ser renderizado |
| `x` | `number` | - | **Obrigatório**. Posição X |
| `y` | `number` | - | **Obrigatório**. Posição Y |
| `width` | `number` | - | **Obrigatório**. Largura máxima |
| `fontSize` | `number` | `40` | Tamanho da fonte em pixels |
| `fontFamily` | `string` | `'Arial'` | Família da fonte |
| `fontWeight` | `string\|number` | `'normal'` | Peso da fonte |
| `fontStyle` | `string` | `'normal'` | Estilo da fonte |
| `fill` | `string` | `'black'` | Cor do texto |
| `textAlign` | `string` | `'left'` | Alinhamento (`'left'`, `'center'`, `'right'`, `'justify'`) |
| `lineHeight` | `number` | `1.16` | Altura da linha (multiplicador) |
| `charSpacing` | `number` | `0` | Espaçamento entre caracteres |
| `minWidth` | `number` | `20` | Largura mínima |
| `splitByGrapheme` | `boolean` | `false` | Quebrar por caractere individual |

## 🧪 Exemplos de teste

O projeto inclui vários exemplos que demonstram diferentes funcionalidades:

1. **Textbox básico** - Renderização simples com quebra de linha
2. **Configurações avançadas** - Texto justificado com configurações customizadas
3. **Texto longo** - Demonstração de quebra automática
4. **Fonte grande** - Texto com fonte grande e negrito
5. **Quebra por caractere** - Palavras muito longas quebradas caractere por caractere

## 🔧 Desenvolvimento

### Estrutura do projeto

```
src/
├── Point.ts              # Classe para coordenadas 2D
├── fabric-utils.ts       # Utilitários portados do Fabric.js
├── MyFabricObject.ts     # Classe base para objetos gráficos
├── MyText.ts            # Renderização básica de texto
├── MyIText.ts           # Extensão com propriedades interativas
├── MyTextbox.ts         # Implementação com quebra de linha
├── textbox-renderer.ts  # Interface pública
└── main.ts              # Exemplo de uso e testes
```

### Scripts disponíveis

```bash
npm run dev     # Servidor de desenvolvimento
npm run build   # Build para produção
npm run preview # Preview da build
```

## 🎨 Demonstração

O projeto inclui uma página de demonstração que mostra:

- Quadrado arrastável vermelho
- Vários exemplos de textboxes com diferentes configurações
- Testes das funções utilitárias no console
- Interface responsiva

Acesse `http://localhost:5173` após executar `npm run dev`.

## 🔍 Inspiração

Este projeto foi inspirado no [Fabric.js](http://fabricjs.com/), especificamente nas classes:
- `fabric.Text`
- `fabric.IText` 
- `fabric.Textbox`

## 📄 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer fork do projeto
2. Criar uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abrir um Pull Request

## 📞 Contato

Para dúvidas ou sugestões sobre este projeto, sinta-se à vontade para abrir uma issue no GitHub.

---

**Desenvolvido com ❤️ usando TypeScript, Vite e inspirado no Fabric.js** 