var iteracao;
var pilha;
var entrada;
var listaProducao = [];
var inputPalavra = document.getElementById("inputPalavra");
var tabelaAutomato = document.getElementById("tabelaAutomato");
var fim;

function proximoPasso() {
    if (inputPalavra.value) {
        if (fim) iniciarAutomato();
        if (!entrada) entrada = inputPalavra.value + "$";

        let acao = "";
        let charPilha = pilha.slice(-1);
        let pilhaTabela = pilha;
        let entradaTabela = entrada;
        pilha = pilha.slice(0, -1);

        iteracao++;
        if (charPilha == entrada.charAt(0) && charPilha == "$") {
            acao = "Aceito em " + iteracao + " iterações!";
            alert("Aceito em " + iteracao + " iterações!");
            fim = true;
        } else if (charPilha && charPilha == charPilha.toUpperCase()) {
            var producao = buscaProducao(charPilha, entrada.charAt(0));
            if (producao) {
                acao = producao.nTerminal + " → " + producao.prod;
                if (producao.prod != "ε")
                    pilha += producao.prod.split('').reverse().join('');
            } else {
                fim = true;
                acao = "Erro em " + iteracao + " iterações!";
                alert("Erro em " + iteracao + " iterações!");
            }
        } else if (charPilha && charPilha == entrada.charAt(0)) {
            acao = "Lê '" + entrada.charAt(0) + "'";
            entrada = entrada.substr(1);
        } else {
            fim = true;
            acao = "Erro em " + iteracao + " iterações!";
            alert("Erro em " + iteracao + " iterações!");
        }

        insereLinhaTabela(pilhaTabela, entradaTabela, acao);
    } else
        fim = true;
}

function ultimoPasso() {
    while (!fim)
        proximoPasso();
}

function gerarSentenca() {
    let gerado = false;
    let sentenca = "S";
    let nTerminal = "S";
    var rex = /[A-Z]/g;

    while (!gerado) {
        for (let idx in listaProducao) {
            let naoTerminal = listaProducao[idx];
            if (naoTerminal.chave == nTerminal) {
                let rand = Math.floor(Math.random() * naoTerminal.lista.length);
                let producao = naoTerminal.lista[rand];
                if (producao.prod != "ε") {
                    sentenca = sentenca.replace(nTerminal, producao.prod);
                    let match;
                    if ((match = rex.exec(sentenca)) == null) {
                        gerado = true;
                    } else
                        nTerminal = match[0];
                }
            }
        }
    }
    inputPalavra.value = sentenca;
    iniciarAutomato();
}

function insereLinhaTabela(pilhaTabela, entradaTabela, acao) {
    var tableRow = tabelaAutomato.insertRow(-1);
    tableRow.appendChild(criarColuna("td", iteracao, " textCenter"));
    tableRow.appendChild(criarColuna("td", pilhaTabela, " regrasGramatica"));
    tableRow.appendChild(criarColuna("td", entradaTabela, " textEnd"));
    tableRow.appendChild(criarColuna("td", acao, " textCenter"));
}

function buscaProducao(pilha, entrada) {
    for (let i in listaProducao) {
        let naoTerminal = listaProducao[i];
        if (naoTerminal.chave == pilha) {
            for (let j in naoTerminal.lista) {
                let producao = naoTerminal.lista[j];
                if (producao.nTerminal == pilha && producao.inicial == entrada)
                    return producao;
            }
        }
    }
    return null;
}

function criarColuna(tipo, texto, classe) {
    let cellHeader = document.createElement(tipo);
    cellHeader.className = "tg-fovp" + classe;
    cellHeader.innerHTML = texto;
    return cellHeader;
}

function criarProducao(nTerminal, inicial, prod) {
    let existe = false;
    let naoTerminal;
    for (let idx in listaProducao) {
        naoTerminal = listaProducao[idx];
        existe = naoTerminal.chave == nTerminal;
        if (existe) {
            listaProducao.splice(idx, 1);
            break;
        }
    } 

    if (!existe) {
        naoTerminal = new Object();
        naoTerminal.chave = nTerminal;
        naoTerminal.lista = [];
    }

    let producao = new Object();
    producao.nTerminal = nTerminal;
    producao.inicial = inicial;
    producao.prod = prod;

    naoTerminal.lista.push(producao);
    return naoTerminal;
}

function limpar() {
    inputPalavra.value = "";
    iniciarAutomato();
}

function iniciarAutomato(){
    iteracao = 0;
    pilha = "$S";
    entrada = "";
    fim = false;

    while (tabelaAutomato.hasChildNodes()) {
        tabelaAutomato.removeChild(tabelaAutomato.lastChild);
    }

    var header = tabelaAutomato.createTHead();
    var tableRow = header.insertRow(-1);
    
    tableRow.appendChild(criarColuna("th", " ", " textCenter"));
    tableRow.appendChild(criarColuna("th", "Pilha", " textCenter"));
    tableRow.appendChild(criarColuna("th", "Entrada", " textCenter"));
    tableRow.appendChild(criarColuna("th", "Ação", " textCenter"));
}

iniciarAutomato();
listaProducao.push(criarProducao("S", "a", "aAc"));
listaProducao.push(criarProducao("S", "c", "cBd"));

listaProducao.push(criarProducao("A", "b", "bBa"));
listaProducao.push(criarProducao("A", "d", "dC"));

listaProducao.push(criarProducao("B", "a", "ε"));
listaProducao.push(criarProducao("B", "b", "bCc"));
listaProducao.push(criarProducao("B", "c", "cSb"));
listaProducao.push(criarProducao("B", "d", "ε"));

listaProducao.push(criarProducao("C", "a", "a"));
listaProducao.push(criarProducao("C", "b", "bAa"));