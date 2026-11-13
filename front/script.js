// Troque a porta pela que aparece no Swagger da sua API
const API_URL = "https://localhost:5000/api/Materiais";

const MESES = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

let materiais = [];
let editando = null; 
let idExcluir = null;

const lista = document.querySelector("#lista");
const estado = document.querySelector("#estadoLista");
const formLivro = document.querySelector("#formLivro");
const formRevista = document.querySelector("#formRevista");
const formEditar = document.querySelector("#formEditar");


function mostrarMensagem(texto, tipo) {
  const alerta = document.createElement("div");
  alerta.className = `alert alert-${tipo}`;
  alerta.textContent = texto;
  document.querySelector("#mensagens").appendChild(alerta);
  setTimeout(() => alerta.remove(), 5000);
}

function pegarMensagem(dados, padrao) {
  if (typeof dados === "string") return dados;
  return dados?.mensagem || dados?.message || dados?.title || padrao;
}

// Mostra certo ou errado dependendo da resposta do código
function avisar(resposta, textoSucesso) {
  if (resposta.ok) {
    mostrarMensagem(textoSucesso, "success");
  } else if (resposta.status === 404) {
    mostrarMensagem("Material não encontrado.", "danger");
  } else {
    mostrarMensagem(pegarMensagem(resposta.dados, `Erro (HTTP ${resposta.status}).`), "danger");
  }
  return resposta.ok;
}


async function chamarApi(url, metodo = "GET", corpo = null) {
  const opcoes = { method: metodo };
  if (corpo) {
    opcoes.headers = { "Content-Type": "application/json" };
    opcoes.body = JSON.stringify(corpo);
  }

  try {
    const resposta = await fetch(url, opcoes);
    const texto = await resposta.text();
    let dados = null;
    try { dados = JSON.parse(texto); } catch { dados = texto; }
    return { ok: resposta.ok, status: resposta.status, dados };
  } catch {
    return { ok: false, status: 0, dados: "Não foi possível conectar à API." };
  }
}


function ehLivro(material) {
  return String(material.tipo).toLowerCase().includes("livro") || material.autor !== undefined;
}

async function carregarMateriais() {
  estado.textContent = "Carregando...";
  const resposta = await chamarApi(API_URL);

  if (!resposta.ok) {
    materiais = [];
    estado.textContent = pegarMensagem(resposta.dados, "Erro ao carregar materiais.");
    estado.classList.add("erro");
  } else {
    materiais = resposta.dados;
    estado.classList.remove("erro");
    estado.textContent = materiais.length === 0 ? "Nenhum material cadastrado." : "";
  }
  renderizar();
}

function criar(tag, classe, texto) {
  const elemento = document.createElement(tag);
  elemento.className = classe;
  elemento.textContent = texto;
  return elemento;
}

function criarBotao(texto, classe, aoClicar) {
  const botao = criar("button", `btn btn-sm ${classe}`, texto);
  botao.type = "button";
  botao.addEventListener("click", aoClicar);
  return botao;
}

function renderizar() {
  lista.replaceChildren();
  let livros = 0;

  materiais.forEach(function (m) {
    const tipo = ehLivro(m) ? "livro" : "revista";
    if (tipo === "livro") livros++;

    const coluna = criar("div", "col-12 col-md-6 col-lg-4", "");
    const card = criar("article", `material-card ${tipo}`, "");
    const corpo = criar("div", "card-body p-3", "");

    corpo.append(
      criar("span", `badge badge-${tipo} mb-2`, tipo === "livro" ? "Livro" : "Revista"),
      criar("h3", "material-titulo mb-3", m.titulo),
      criar("p", "mb-1", `Ano: ${m.anoPublicacao}`)
    );
    if (tipo === "livro") {
      corpo.append(criar("p", "mb-1", `Autor: ${m.autor}`), criar("p", "mb-1", `Páginas: ${m.paginas}`));
    } else {
      corpo.append(criar("p", "mb-1", `Edição: ${m.edicao}`), criar("p", "mb-1", `Mês: ${MESES[m.mesPublicacao - 1] ?? m.mesPublicacao}`));
    }

    const acoes = criar("div", "material-acoes", "");
    acoes.append(
      criarBotao("Consultar", "btn-outline-secondary", () => mostrarInfo(`${API_URL}/${m.id}`, "Detalhes")),
      criarBotao("Prazo", "btn-outline-info", () => mostrarInfo(`${API_URL}/${m.id}/descricao`, "Descrição e prazo")),
      criarBotao("Emprestar", "btn-outline-success", () => emprestar(m.id)),
      criarBotao("Editar", "btn-outline-primary", () => abrirEdicao(m, tipo)),
      criarBotao("Excluir", "btn-outline-danger", () => abrirExclusao(m))
    );

    card.append(corpo, acoes);
    coluna.appendChild(card);
    lista.appendChild(coluna);
  });

  document.querySelector("#resumoTotal").textContent = materiais.length;
  document.querySelector("#resumoLivros").textContent = livros;
  document.querySelector("#resumoRevistas").textContent = materiais.length - livros;
}

//GET por id e GET descrição
async function mostrarInfo(url, titulo) {
  const resposta = await chamarApi(url);
  if (!resposta.ok) {
    avisar(resposta, "");
    return;
  }

  const corpo = document.querySelector("#modalInfoCorpo");
  corpo.replaceChildren();
  if (typeof resposta.dados === "object") {
    const dl = criar("dl", "info-lista mb-0", "");
    Object.entries(resposta.dados).forEach(function ([chave, valor]) {
      dl.append(criar("dt", "", chave), criar("dd", "", valor));
    });
    corpo.appendChild(dl);
  } else {
    corpo.textContent = resposta.dados;
  }

  document.querySelector("#modalInfoTitulo").textContent = titulo;
  bootstrap.Modal.getOrCreateInstance(document.querySelector("#modalInfo")).show();
}

// ---------- POST: emprestar ----------
async function emprestar(id) {
  const resposta = await chamarApi(`${API_URL}/${id}/emprestar`, "POST");
  avisar(resposta, pegarMensagem(resposta.dados, "Empréstimo realizado com sucesso."));
}

// Lê o formulário. Devolve um objeto ou null se tiver alguma coisa errada.
function lerFormulario(form) {
  const dados = {};
  let valido = true;

  form.querySelectorAll("input, select").forEach(function (campo) {
    if (campo.closest(".d-none")) return;

    const valor = campo.value.trim();
    const numerico = campo.type === "number" || campo.tagName === "SELECT";
    let erro = "";
    if (valor === "") {
      erro = "Preencha este campo.";
    } else if (numerico && Number(valor) <= 0) {
      erro = "Informe um número maior que zero.";
    }

    campo.classList.toggle("is-valid", erro === "");
    campo.classList.toggle("is-invalid", erro !== "");
    campo.parentElement.querySelector(".invalid-feedback").textContent = erro;

    if (erro !== "") valido = false;
    dados[campo.name] = numerico ? Number(valor) : valor;
  });

  return valido ? dados : null;
}

async function cadastrar(evento, tipo) {
  evento.preventDefault();
  const form = evento.target;
  const dados = lerFormulario(form);
  if (dados === null) {
    mostrarMensagem("Corrija os campos destacados.", "danger");
    return;
  }

  const resposta = await chamarApi(`${API_URL}/${tipo}`, "POST", dados);
  if (avisar(resposta, "Material cadastrado com sucesso!")) {
    form.reset();
    form.querySelectorAll(".is-valid").forEach((c) => c.classList.remove("is-valid"));
    carregarMateriais();
  }
}

function abrirEdicao(material, tipo) {
  editando = { id: material.id, tipo: tipo };

  document.querySelectorAll("#formEditar .campos-livro").forEach((el) => el.classList.toggle("d-none", tipo !== "livro"));
  document.querySelectorAll("#formEditar .campos-revista").forEach((el) => el.classList.toggle("d-none", tipo !== "revista"));

  formEditar.querySelectorAll("input, select").forEach(function (campo) {
    campo.value = material[campo.name] ?? "";
    campo.classList.remove("is-valid", "is-invalid");
  });

  bootstrap.Modal.getOrCreateInstance(document.querySelector("#modalEditar")).show();
}

async function salvarEdicao(evento) {
  evento.preventDefault();
  const dados = lerFormulario(formEditar);
  if (dados === null) {
    mostrarMensagem("Corrija os campos destacados.", "danger");
    return;
  }

  const url = `${API_URL}/${editando.tipo}/${editando.id}`;
  const resposta = await chamarApi(url, "PUT", { id: editando.id, ...dados });
  if (avisar(resposta, "Material atualizado com sucesso!")) {
    bootstrap.Modal.getOrCreateInstance(document.querySelector("#modalEditar")).hide();
  }
  carregarMateriais();
}

function abrirExclusao(material) {
  idExcluir = material.id;
  document.querySelector("#textoExcluir").textContent = `Deseja excluir "${material.titulo}"?`;
  bootstrap.Modal.getOrCreateInstance(document.querySelector("#modalExcluir")).show();
}

async function excluir() {
  const resposta = await chamarApi(`${API_URL}/${idExcluir}`, "DELETE");
  bootstrap.Modal.getOrCreateInstance(document.querySelector("#modalExcluir")).hide();
  avisar(resposta, "Material excluído com sucesso!");
  carregarMateriais();
}

document.querySelectorAll("#revista-mes, #ed-mes").forEach(function (select) {
  select.append(new Option("Selecione...", ""));
  MESES.forEach((nome, i) => select.append(new Option(nome, i + 1)));
});

formLivro.addEventListener("submit", (e) => cadastrar(e, "livro"));
formRevista.addEventListener("submit", (e) => cadastrar(e, "revista"));
formEditar.addEventListener("submit", salvarEdicao);
document.querySelector("#btnConfirmarExcluir").addEventListener("click", excluir);
document.querySelector("#btnRecarregar").addEventListener("click", carregarMateriais);

carregarMateriais();