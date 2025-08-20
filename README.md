## Gerenciador de Estoque (SPA em memória)

Aplicação Web de página única (HTML, CSS e JavaScript puro) para gerenciar estoque de produtos de impressão 3D. Todos os dados rodam em memória e são persistidos apenas no `localStorage` do navegador.

### Funcionalidades

- Cadastro de produto com: nome, descrição, tipo de filamento, cores, peso, dimensões, preço e quantidade inicial (RN01, RN02)
- Validações: preço e quantidade não negativos (RN03, RN04)
- Edição de qualquer campo do produto (RN05)
- Exclusão de produto (RN06)
- Compra reduz estoque automaticamente (RN07)
- Produto com quantidade 0: exibido como "Indisponível" e compra desabilitada (RN08)
- Reabastecimento soma à quantidade atual (RN09)
- Persistência no `localStorage`
- Imagem do produto (opcional), com miniatura na tabela e opção de remover na edição

### Tecnologias

- HTML5 + CSS3 + JavaScript
- Persistência local: `localStorage`

### Estrutura

```
web-estoque/
├─ index.html     # Marcações e layout da SPA
├─ styles.css     # Estilos da interface
├─ app.js         # Lógica de produtos, validações, UI e persistência
└─ README.md      # Este documento
```

### Executando localmente

1. Baixe/clonar este repositório.
2. Abra o arquivo `web-estoque/index.html` no navegador (duplo clique).

Não há necessidade de servidor ou dependências.

### Uso

- Preencha o formulário e clique em "Salvar produto".
- Para editar, clique em "Editar", ajuste e "Atualizar produto" (ou "Cancelar edição").
- Para excluir, clique em "Excluir".
- Para comprar, clique em "Comprar" e informe a quantidade (se o produto estiver disponível).
- Para reabastecer, clique em "Reabastecer" e informe a quantidade a adicionar.
- Imagem do produto é opcional: selecione um arquivo no campo de imagem. Na edição, marque "Remover imagem atual" para excluí-la.

Observação: as alterações ficam salvas no `localStorage` do navegador atual. Limpando os dados do site, os produtos serão apagados.

### Regras atendidas

| ID   | Regra                              | Como foi atendida |
| ---- | ---------------------------------- | ------------------ |
| RN01 | Cadastro obrigatório de produto    | Formulário exige campos e validações |
| RN02 | Quantidade inicial obrigatória     | Campo obrigatório e validado como inteiro >= 0 |
| RN03 | Quantidade não negativa            | Validação no formulário e nas operações |
| RN04 | Preço válido                       | Validado como número >= 0 |
| RN05 | Edição de produto                  | "Editar" preenche o formulário e salva alterações |
| RN06 | Exclusão de produto                | "Excluir" remove da lista |
| RN07 | Atualização automática de estoque  | "Comprar" reduz a quantidade |
| RN08 | Produto indisponível               | Quantidade 0 exibe "Indisponível" e desabilita comprar |
| RN09 | Reabastecimento de produto         | "Reabastecer" soma ao estoque |

### Licença

Uso livre para fins educacionais e demonstração.


