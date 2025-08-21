# Gerenciador de Estoque - Loja 3D

Uma aplicação web para gerenciar o estoque de produtos de impressão 3D, desenvolvida em JavaScript puro com interface moderna e responsiva.

## Funcionalidades

### 🏷️ Cadastro e Edição de Produtos
- Formulário completo para cadastro de produtos
- Edição de produtos existentes
- Validação de campos obrigatórios
- Upload de imagens dos produtos
- Persistência local no navegador

### 📊 Visualização de Estoque
- Tabela responsiva com todos os produtos
- Status visual (disponível/indisponível)
- Informações detalhadas: nome, tipo de filamento, cores, peso, dimensões, preço e quantidade
- Imagens em miniatura dos produtos

### 🛒 Sistema de Compra
- **Modal de Compra**: Interface intuitiva para realizar compras
- Seleção de quantidade com validação
- Cálculo automático do total
- Verificação de disponibilidade em estoque
- Atualização automática do estoque após compra

### 📦 Sistema de Reabastecimento
- **Modal de Reabastecimento**: Interface para adicionar produtos ao estoque
- Seleção de quantidade a adicionar
- Visualização do estoque atual e futuro
- Atualização automática do estoque

### 🗑️ Sistema de Exclusão
- **Modal de Confirmação**: Confirmação segura antes de excluir produtos
- Aviso de que a ação não pode ser desfeita
- Exclusão segura com validação

## Interface dos Modais

### Modal de Compra
- Exibe informações do produto (nome, imagem, preço, estoque disponível)
- Campo para inserir quantidade desejada
- Cálculo automático do total em tempo real
- Validação de quantidade disponível
- Botões de confirmação e cancelamento

### Modal de Reabastecimento
- Exibe informações do produto (nome, imagem, estoque atual)
- Campo para inserir quantidade a adicionar
- Cálculo automático do novo estoque em tempo real
- Botões de confirmação e cancelamento

### Modal de Exclusão
- Confirmação com nome do produto
- Aviso de que a ação é irreversível
- Botões de confirmação e cancelamento

## Características Técnicas

### 🎨 Design
- Interface moderna com tema escuro
- Animações suaves nos modais
- Design responsivo para dispositivos móveis
- Cores consistentes e acessíveis

### ⌨️ Usabilidade
- Fechamento de modais com tecla ESC
- Foco automático nos campos de entrada
- Fechamento ao clicar fora do modal
- Validação em tempo real

### 📱 Responsividade
- Adaptação para diferentes tamanhos de tela
- Layout otimizado para dispositivos móveis
- Modais responsivos com scroll quando necessário

## Como Usar

1. **Cadastrar Produto**: Preencha o formulário e clique em "Salvar produto"
2. **Editar Produto**: Clique no botão "Editar" na linha do produto desejado
3. **Comprar Produto**: Clique em "Comprar" e use o modal para selecionar quantidade
4. **Reabastecer**: Clique em "Reabastecer" e use o modal para adicionar estoque
5. **Excluir Produto**: Clique em "Excluir" e confirme no modal de confirmação

## Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Estilos modernos com variáveis CSS e flexbox
- **JavaScript ES6+**: Funcionalidades e lógica de negócio
- **LocalStorage**: Persistência de dados local

## Estrutura do Projeto

```
web-estoque/
├── index.html          # Interface principal
├── app.js             # Lógica da aplicação
├── styles.css         # Estilos e responsividade
└── README.md          # Documentação
```

## Executando o Projeto

1. Clone ou baixe os arquivos
2. Abra o arquivo `index.html` em um navegador moderno
3. Ou execute um servidor local: `python -m http.server 8000`

## Requisitos

- Navegador com suporte a ES6+
- JavaScript habilitado
- LocalStorage disponível

## Desenvolvedor

Desenvolvido por [Ali-Maia](https://github.com/Ali-Maia)

---

**Nota**: Esta é uma aplicação de demonstração que utiliza armazenamento local do navegador. Os dados são mantidos apenas na sessão atual e podem ser perdidos ao limpar o cache.


