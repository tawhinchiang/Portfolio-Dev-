# Portfólio de Tawhin Chiang

Portfólio pessoal voltado para oportunidades de Desenvolvedor Front-end Júnior. O projeto usa HTML, CSS e JavaScript puro para manter a estrutura simples, rápida e fácil de estudar.

## Funcionalidades

- Menu fixo e responsivo.
- Destaque automático da seção atual no menu.
- Alternância entre tema escuro e claro.
- Idiomas Português, Inglês e Espanhol com detecção automática do navegador.
- Projetos principais em destaque.
- Filtros de projetos por tecnologia.
- Botão para exibir mais projetos.
- Abas de competências acessíveis pelo teclado.
- Estudos de caso em uma janela modal.
- Botão para copiar o e-mail.
- Contato por WhatsApp com mensagem automática no idioma selecionado.
- Download do currículo.
- Animações leves que respeitam a preferência de movimento reduzido.
- Metadados para mecanismos de busca e compartilhamento.

## Estrutura de pastas

```text
Portfolio-Dev-
├── assets/
│   ├── icons/
│   ├── images/
│   ├── curriculo-tawhin-chiang.pdf
│   └── profile.jpg
├── docs/
│   └── portfolio-recruiter-ux.md
├── scripts/
│   ├── main.js
│   └── translations.js
├── styles/
│   ├── global.css
│   ├── index.css
│   ├── section.css
│   └── utilitys.css
├── favicon.ico
├── index.html
└── README.md
```

## Responsabilidade de cada arquivo

### `index.html`

Contém todo o conteúdo e a estrutura semântica da página. Os projetos permanecem no HTML para continuarem visíveis caso o JavaScript não carregue.

### `styles/global.css`

Define cores, fontes, espaçamentos, temas e estilos básicos usados no projeto inteiro.

### `styles/utilitys.css`

Reúne classes reutilizáveis, como botões, títulos de seção, listas, links e animações.

### `styles/section.css`

Cuida do layout das seções: cabeçalho, hero, projetos, experiência, competências, sobre, contato e modal.

### `scripts/main.js`

Contém os comportamentos da página. Cada função possui uma responsabilidade específica.

### `scripts/translations.js`

Contém todos os textos em Português, Inglês e Espanhol. Separar traduções da lógica deixa o código mais simples de manter e estudar.

## Como o JavaScript está organizado

### Idiomas

- `detectBrowserLanguage()` identifica o idioma do navegador.
- `getInitialLanguage()` respeita primeiro a escolha salva pelo usuário.
- `applyLanguage()` traduz textos, atributos, metadados e links.
- `createWhatsAppUrl()` monta a mensagem de contato no idioma atual.

### Tema

- `getPreferredTheme()` identifica o tema salvo ou a preferência do sistema.
- `applyTheme()` aplica as cores e atualiza o botão.
- `initializeTheme()` registra a interação do usuário.

### Menu

- `setMenuState()` abre ou fecha o menu mobile.
- `initializeMobileMenu()` registra clique, tecla Escape e mudança de largura.
- `initializeScrollSpy()` destaca a seção atual durante a rolagem.

### Abas

- `activateTab()` define a aba selecionada e o painel visível.
- `getNextTabIndex()` calcula a próxima aba para navegação pelo teclado.
- `initializeTabs()` conecta os eventos às abas.

### Projetos

- `projectMatchesFilter()` verifica se o projeto pertence ao filtro selecionado.
- `updateFilterButtons()` atualiza o estado visual e acessível dos filtros.
- `initializeProjectFilters()` controla filtros e o botão de exibir mais.
- `fillProjectDialog()` preenche o estudo de caso escolhido.
- `initializeProjectDialog()` abre e fecha a janela de detalhes.

### Contato e animações

- `copyText()` copia o e-mail usando a melhor opção disponível no navegador.
- `showToast()` apresenta uma confirmação temporária.
- `initializeRevealAnimations()` exibe os elementos conforme a rolagem.

### Inicialização

`initializePortfolio()` chama as funções principais em uma ordem previsível. Essa função é o ponto de entrada do JavaScript.

## Como executar

Abra o arquivo `index.html` no navegador. Para testar o comportamento mais próximo da publicação, também é possível usar a extensão Live Server no VS Code.

## Como adicionar um projeto

1. Adicione a imagem em `assets/images`.
2. Copie um `article` com a classe `project-card` no `index.html`.
3. Preencha `data-categories` com `react`, `javascript` ou `html-css`.
4. Atualize título, resumo, tecnologias e links.
5. Adicione os dados do estudo de caso em `caseStudies`, nos três idiomas de `scripts/translations.js`.
6. Use o mesmo identificador em `data-project-dialog`, `caseStudies` e `projectLinks`.

## Como adicionar ou editar uma tradução

1. Abra `scripts/translations.js`.
2. Localize o mesmo grupo dentro de `pt`, `en` e `es`.
3. Mantenha a mesma chave nos três idiomas.
4. No HTML, use `data-i18n="grupo.chave"` no elemento que receberá o texto.
5. Para atributos, use `data-i18n-aria-label`, `data-i18n-alt` ou `data-i18n-content`.

O idioma escolhido fica salvo no navegador. Sem uma escolha salva, o site usa o idioma do navegador e adota Inglês como alternativa para outros idiomas.

## Princípios usados

- Nomes que explicam a intenção do código.
- Funções pequenas e focadas em uma responsabilidade.
- Conteúdo essencial disponível sem JavaScript.
- Componentes visuais reutilizáveis.
- Navegação por teclado e estados acessíveis.
- Layout adaptado para desktop, tablet e celular.
