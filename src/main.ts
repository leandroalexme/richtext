// src/main.ts
// Ponto de entrada da aplicação de demonstração

import { setupDemo } from './demo';

// Configurar a demonstração quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
  setupDemo('canvas');
});
