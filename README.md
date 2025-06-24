# 📘 Analisador Sintático

Analisador sintático preditivo não recursivo construído com base em uma gramática livre de contexto LL(1), conforme os requisitos da disciplina de Compiladores.

## 👥 Autores

- **Bruno Simionato**
- **Lívia Verlindo**


## 🧪 Como usar

Você pode testar o analisador diretamente online:

🔗 **[Clique aqui para acessar](https://analisador-sintatico.vercel.app)**  
*(Disponível via Vercel)*

### Ou localmente:
1. Baixe ou clone o repositório.
2. Abra o arquivo `index.html` em qualquer navegador.
3. Digite ou gere uma sentença.
4. Use os botões:
   - **Próximo passo**: executa um passo da análise.
   - **Executar tudo**: realiza toda a análise.
   - **Gerar sentença**: cria automaticamente uma sentença para validação.
   - **Limpar**: reinicia a análise.

> O analisador exibe passo-a-passo a pilha, a entrada restante e a ação tomada. Ao final, uma notificação pop-up indica se a sentença foi aceita ou rejeitada.

---

## 🔣 Gramática LL(1)

```
S ::= aAb | cD
A ::= dCa | cAD
B ::= aBc | dD | cC
C ::= bDA | ε
D ::= dS
```

## 📌 Conjuntos FIRST

```
FIRST(S) = { a, c }
FIRST(A) = { d, c }
FIRST(B) = { a, d, c }
FIRST(C) = { b, ε }
FIRST(D) = { d }
```

## 📌 Conjuntos FOLLOW

```
FOLLOW(S) = { $, a, b, c, d }
FOLLOW(A) = { b, d, a, c }
FOLLOW(B) = { c }
FOLLOW(C) = { a, c }
FOLLOW(D) = { d, c, $, b, a }
```

## 📊 Tabela de Parsing

|     | a         | b        | c         | d         | $ |
|-----|-----------|----------|-----------|-----------|---|
| S   | S → aAb   | -        | S → cD    | -         | - |
| A   | -         | -        | A → cAD   | A → dCa   | - |
| B   | B → aBc   | -        | B → cC    | B → dD    | - |
| C   | C → ε     | C → bDA  | C → ε     | -         | - |
| D   | -         | -        | -         | D → dS    | - |

---

## 🛠️ Tecnologias

- HTML5
- CSS3
- JavaScript (vanilla)
- Deploy: [Vercel](https://vercel.com)

---


© URI 2025 – TDE da disciplina de Compiladores
