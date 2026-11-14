# Front-end da Biblioteca Universitária

Trabalho final de Desenvolvimento Web e Mobile I.

**Integrantes:**
- André Guilherme Amorim Pereira - RGM: 114.034
- Giovana Dutra Azambuja - RGM: 114.036
- Samuel de Oliveira Nunes - RGM: 114.053

## O que foi desenvolvido

Fizemos uma página web que consome a Web API de biblioteca que criamos em Programação Orientada a Objetos. Na página dá para ver todos os livros e revistas cadastrados, filtrar por tipo, cadastrar novos, editar, excluir, ver os detalhes, consultar o prazo de empréstimo e tentar emprestar um material. No topo há um resumo com a quantidade total de materiais, de livros e de revistas.


## Como abrir o front-end

Abrimos a pasta `index.html`. A API precisa estar rodando antes.


## Como executar a API
 
Abrimos o terminal na pasta principal do projeto (onde fica o `Program.cs`) e rodamos:
 
```
dotnet run
```
 
O terminal mostra o endereço onde a API está rodando. No nosso caso apareceu `http://localhost:5000`. O Swagger fica em `/swagger` no mesmo endereço.


## URL da API utilizada

``` http://localhost:5000/api/Materiais ```

## Endpoints consumidos

| Endpoint | O que faz | Função no `script.js` |
|---|---|---|
| GET `/api/Materiais` | lista todos os materiais | `carregarMateriais` |
| GET `/api/Materiais/{id}` | busca um material (detalhes e preencher a edição) | `consultarMaterial` e `abrirEdicao` |
| POST `/api/Materiais/livro` | cadastra livro | `cadastrarLivro` |
| POST `/api/Materiais/revista` | cadastra revista | `cadastrarRevista` |
| PUT `/api/Materiais/livro/{id}` | atualiza livro | `salvarEdicao` |
| PUT `/api/Materiais/revista/{id}` | atualiza revista | `salvarEdicao` |
| DELETE `/api/Materiais/{id}` | exclui material | `excluirMaterial` |
| GET `/api/Materiais/{id}/descricao` | descrição e prazo de empréstimo | `consultarDescricao` |
| POST `/api/Materiais/{id}/emprestar` | tenta emprestar | `emprestarMaterial` |


## Como o front-end foi organizado

- `index.html`: a estrutura da página (cabeçalho, resumo, lista, formulários de cadastro e os modais de detalhes, edição e exclusão).
- `style.css`: as cores e o estilo, como a borda azul dos livros e marrom das revistas.
- `script.js`: toda a lógica. Separadas em funções pequenas:
  - `requisicao`: faz o `fetch` e devolve o resultado já tratado, para não repetir `try/catch` em todo lugar.
  - `carregarMateriais` e `renderizarMateriais`: buscam a lista na API e desenham os cards na tela.
  - `cadastrarLivro`, `cadastrarRevista`, `salvarEdicao` e `excluirMaterial`: enviam POST, PUT e DELETE.
  - `validarLivro` e `validarRevista`: conferem os campos antes de enviar.
  - `mostrarMensagem`: mostra os alertas de sucesso e erro.


## Componentes do Bootstrap utilizados

- Grid (`row`, `col-12`, `col-md-6`, `col-xl-4`) para a página se ajustar a telas pequenas, médias e grandes.
- Abas (`nav-tabs`) para alternar entre o cadastro de livro e de revista.
- Modais (`modal`) para detalhes, edição e confirmação de exclusão.
- Alertas (`alert`) para as mensagens de sucesso e erro.
- Formulários (`form-control`, `form-select`, `invalid-feedback`) para os campos e as mensagens de erro de cada campo.
- Botões (`btn`, `btn-group`), badges (`badge`) e classes utilitárias de espaçamento (`mb-3`, `gap-2`, `d-flex`).


## Validações implementadas

Os formulários validam antes de enviar para a API:

- Título: obrigatório.
- Ano de publicação: precisa ser um número inteiro, de 0 até o ano atual + 1.
- Livro: autor obrigatório e número de páginas inteiro maior que 0.
- Revista: número da edição inteiro maior que 0 e mês selecionado (de 1 a 12).

Quando há erro, o campo fica vermelho com a mensagem logo abaixo, e aparece um alerta no topo. Mesmo com a validação no front, a API continua validando também, e o front mostra a mensagem de erro que ela devolve.


## Dificuldades encontradas

Uma das dificuldades foi fazer a API funcionar. A página aparece em branco e não muda.

## Como resolvemos as dificuldades

Recorremos aos conteúdos e ajuda do Claude.AI, mas nao conseguimos resolver essa dificuldade.

## O que cada integrante aprendeu

**André:** Aprendi a mexer mais com o JavaScript, com constantes e variáveis, e a diferença entre elas. Aprendi a usar o GET e a fazer consultas pelo ID, aprendi mais sobre a documentação do JavaScript e, com os colegas, aprendi mais sobre o Bootstrap, que era onde eu tinha mais dificuldade.

**Giovana:** Aprendi um pouco mais com o bootstrap, com a base do projeto, além de aprender e reforçar conceitos do arquivo de JavaScript com o André. 

**Samuel:** Nessa projeto, aprendi a mexer ainda mais com o back-end, auxiliando meus colegas na parte de JavaScript, e configurando o C# do projeto