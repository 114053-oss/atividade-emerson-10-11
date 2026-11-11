# Sistema de Gerenciamento de Biblioteca Universitária

## Integrantes

1. SAMUEL DE OLIVEEIRA NUNES
2. ANDRÉ GUILHERME AMORIM PEREIRA
3. GIOVANA DUTRA AZAMBUJA



**Curso:** Engenharia de Software · 
**Disciplina:** Programação Orientada a Objetos

## Descrição do sistema

Web API para gerenciar o acervo de uma biblioteca universitária. Permite **cadastrar, listar, buscar, atualizar e excluir** materiais, que podem ser **Livro** ou **Revista**. Cada tipo tem seus próprios dados, descrição e prazo de empréstimo:

| Tipo | Dados | Prazo | Pode ser emprestado? |
|---|---|---|---|
| Livro | Autor, Páginas | 14 dias | Sim (implementa `IEmprestimo`) |
| Revista | Edição, Mês de publicação | 7 dias | Não |

Conceitos aplicados: herança, abstração (`abstract`, `virtual`, `override`), encapsulamento, polimorfismo, interface (`IEmprestimo` com `is not`), Repository Pattern, injeção de dependência, Singleton e CORS.

Os dados ficam **somente em memória** (sem banco de dados). Ao reiniciar a aplicação, voltam aos dados iniciais (1 livro e 1 revista).

## Tecnologias utilizadas

- C#
- ASP.NET Core Web API (.NET 10)
- Swagger (Swashbuckle.AspNetCore)

## Como executar

```bash
git clone <link-do-repositorio>
cd BibliotecaApi
dotnet run
```

Depois acesse o Swagger no navegador (use a porta que aparecer no terminal):

```text
https://localhost:PORTA/swagger
```

## Estrutura do projeto

```text
BibliotecaApi/
├── Controllers/
│   └── MateriaisController.cs
├── Models/
│   ├── MaterialBiblioteca.cs
│   ├── Livro.cs
│   ├── Revista.cs
│   └── IEmprestimo.cs
├── Repositories/
│   ├── IMaterialRepository.cs
│   └── MaterialRepository.cs
├── Program.cs
└── README.md
```

## Principais endpoints

| Método | URL | Função | Resposta |
|---|---|---|---|
| GET | `/api/Materiais` | Lista todos | 200 |
| GET | `/api/Materiais/{id}` | Busca por ID | 200 / 404 |
| POST | `/api/Materiais/livro` | Cadastra livro | 201 / 400 |
| POST | `/api/Materiais/revista` | Cadastra revista | 201 / 400 |
| PUT | `/api/Materiais/livro/{id}` | Atualiza livro | 200 / 400 / 404 |
| PUT | `/api/Materiais/revista/{id}` | Atualiza revista | 200 / 400 / 404 |
| DELETE | `/api/Materiais/{id}` | Exclui material | 204 / 404 |
| GET | `/api/Materiais/{id}/descricao` | Descrição e prazo | 200 / 404 |
| POST | `/api/Materiais/{id}/emprestar` | Tenta emprestar | 200 / 400 / 404 |

## Exemplos de testes (executados no Swagger)

**POST `/api/Materiais/livro`**

```json
{
  "titulo": "O Programador Pragmático",
  "anoPublicacao": 1999,
  "autor": "Andrew Hunt",
  "paginas": 352
}
```

**POST `/api/Materiais/revista`**

```json
{
  "titulo": "Revista de Tecnologia",
  "anoPublicacao": 2026,
  "edicao": 20,
  "mesPublicacao": 11
}
```

| Nº | Teste | Resultado esperado |
|---|---|---|
| 1 | GET `/api/Materiais` | 200, lista os materiais |
| 2 | GET `/api/Materiais/1` | 200, retorna o material 1 |
| 3 | GET `/api/Materiais/999` | 404 |
| 4 | POST livro válido | 201 |
| 5 | POST revista válida | 201 |
| 6 | POST livro sem título (`"titulo": "  "`) | 400 |
| 7 | POST livro com `paginas: 0` | 400 |
| 8 | POST revista com `edicao: 0` | 400 |
| 9 | POST revista com `mesPublicacao: 13` | 400 |
| 10 | PUT livro existente (`/livro/1`) | 200 |
| 11 | PUT revista existente (`/revista/2`) | 200 |
| 12 | PUT material inexistente | 404 |
| 13 | DELETE material existente | 204 |
| 14 | DELETE material inexistente | 404 |
| 15 | GET `/api/Materiais/1/descricao` (livro) | descrição + prazo 14 |
| 16 | GET `/api/Materiais/2/descricao` (revista) | descrição + prazo 7 |
| 17 | POST `/api/Materiais/1/emprestar` (livro) | 200 |
| 18 | POST `/api/Materiais/2/emprestar` (revista) | 400 |
| 19 | Cadastrar vários materiais | IDs diferentes |
| 20 | Excluir e cadastrar outro | ID novo não se repete |

> Anexe aqui os prints dos testes feitos no Swagger.
