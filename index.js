let iteracao;
let pilha;
let entrada;
const listaProducao = [];
const inputPalavra = document.getElementById("inputPalavra");
const tabelaAutomato = document.getElementById("tabelaAutomato");
let fim;

function proximoPasso() {
  if (inputPalavra.value) {
    if (fim) return;
    if (!entrada) entrada = inputPalavra.value + "$";

    let acao = "";
    let charPilha = pilha.slice(-1);
    let pilhaTabela = pilha;
    let entradaTabela = entrada;
    pilha = pilha.slice(0, -1);

    iteracao++;
    if (charPilha == entrada.charAt(0) && charPilha == "$") {
      acao = "Aceito em " + iteracao + " iterações!";
      mostrarPopup("Aceito em " + iteracao + " iterações!", "sucesso");
      fim = true;
    } else if (charPilha && charPilha == charPilha.toUpperCase()) {
      var producao = buscaProducao(charPilha, entrada.charAt(0));
      if (producao) {
        acao = producao.nTerminal + " → " + producao.prod;
        if (producao.prod != "ε")
          pilha += producao.prod.split("").reverse().join("");
      } else {
        fim = true;
        acao = "Erro em " + iteracao + " iterações!";
        mostrarPopup("Erro em " + iteracao + " iterações!", "erro");
      }
    } else if (charPilha && charPilha == entrada.charAt(0)) {
      acao = "Lê " + entrada.charAt(0) + "";
      entrada = entrada.slice(1);
    } else {
      fim = true;
      acao = "Erro em " + iteracao + " iterações!";
      mostrarPopup("Erro em " + iteracao + " iterações!", "erro");
    }

    insereLinhaTabela(pilhaTabela, entradaTabela, acao);
  } else fim = true;
}

function ultimoPasso() {
  while (!fim) proximoPasso();
}

function mostrarPopup(mensagem, tipo = "info", duracao = 5000) {
  const popup = document.getElementById("popupMensagem");
  popup.textContent = mensagem;

  popup.className = "popup-mensagem";
  if (tipo === "sucesso") popup.classList.add("sucesso");
  else if (tipo === "erro") popup.classList.add("erro");

  popup.classList.add("show");

  setTimeout(() => {
    popup.classList.remove("show");
  }, duracao);
}

function gerarSentenca() {
  const MAX_CARACTERES = 30;
  const MAX_PROFUNDIDADE = 40;

  function expandir(simbolo, contador, profundidade) {
    if (profundidade > MAX_PROFUNDIDADE || contador.count >= MAX_CARACTERES)
      return "";

    if (!/[A-Z]/.test(simbolo)) {
      contador.count++;
      return simbolo;
    }

    const producoes =
      listaProducao.find((p) => p.chave === simbolo)?.lista ?? [];

    if (producoes.length === 0) return "";

    const randIndex = Math.floor(Math.random() * producoes.length);
    const prod = producoes[randIndex].prod;

    if (prod === "ε") return "";

    const resultado = prod
      .split("")
      .map((s) => expandir(s, contador, profundidade + 1))
      .join("");

    return resultado;
  }

  let sentenca = "";
  let contador;
  let sucesso = false;

  while (!sucesso) {
    contador = { count: 0 };
    sentenca = expandir("S", contador, 0);

    if (sentenca.length <= MAX_CARACTERES && sentenca.length > 0) {
      sucesso = true;
    }
  }

  inputPalavra.value = sentenca;
  iniciarAutomato();
}

function insereLinhaTabela(pilhaTabela, entradaTabela, acao) {
  const tableRow = tabelaAutomato.insertRow(-1);

  tableRow.appendChild(criarColuna("td", iteracao, " textCenter"));
  tableRow.appendChild(criarColuna("td", pilhaTabela, " regrasGramatica"));
  tableRow.appendChild(criarColuna("td", entradaTabela, " textEnd"));

  let classeAcao = "textCenter";
  if (/erro/i.test(acao)) {
    classeAcao += " acao-erro";
  } else if (/aceito/i.test(acao)) {
    classeAcao += " acao-sucesso";
  }

  tableRow.appendChild(criarColuna("td", acao, classeAcao));
}

function buscaProducao(pilha, entrada) {
  const naoTerminal = listaProducao.find((p) => p.chave === pilha);
  if (!naoTerminal) return null;

  return (
    naoTerminal.lista.find(
      (p) => p.nTerminal === pilha && p.inicial === entrada
    ) || null
  );
}

function criarColuna(tipo, texto, classe) {
  let cellHeader = document.createElement(tipo);
  cellHeader.className = `tg-fovp ${classe}`.trim();
  cellHeader.innerHTML = texto;
  return cellHeader;
}

function criarProducao(nTerminal, inicial, prod) {
  let naoTerminal = listaProducao.find((nt) => nt.chave === nTerminal);

  if (!naoTerminal) {
    naoTerminal = { chave: nTerminal, lista: [] };
    listaProducao.push(naoTerminal);
  }

  naoTerminal.lista.push({
    nTerminal,
    inicial,
    prod,
  });

  return naoTerminal;
}

function limpar() {
  inputPalavra.value = "";
  iniciarAutomato();
}

function iniciarAutomato() {
  iteracao = 0;
  pilha = "$S";
  entrada = "";
  fim = false;

  while (tabelaAutomato.hasChildNodes()) {
    tabelaAutomato.removeChild(tabelaAutomato.lastChild);
  }

  var header = tabelaAutomato.createTHead();
  var tableRow = header.insertRow(-1);

  tableRow.appendChild(criarColuna("th", "Iterações", " textCenter"));
  tableRow.appendChild(criarColuna("th", "Pilha", " textCenter"));
  tableRow.appendChild(criarColuna("th", "Entrada", " textCenter"));
  tableRow.appendChild(criarColuna("th", "Ação", " textCenter"));
}

iniciarAutomato();
listaProducao.push(criarProducao("S", "a", "aAb"));
listaProducao.push(criarProducao("S", "c", "cD"));

listaProducao.push(criarProducao("A", "c", "cAD"));
listaProducao.push(criarProducao("A", "d", "dCa"));

listaProducao.push(criarProducao("B", "a", "aBc"));
listaProducao.push(criarProducao("B", "c", "cC"));
listaProducao.push(criarProducao("B", "d", "dD"));

listaProducao.push(criarProducao("C", "a", "ε"));
listaProducao.push(criarProducao("C", "b", "bDA"));
listaProducao.push(criarProducao("C", "c", "ε"));

listaProducao.push(criarProducao("D", "d", "dS"));
