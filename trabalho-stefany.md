# Trabalho Backend – Prompt para a IA

Você é um desenvolvedor backend sênior, especialista em Node.js, Express e MySQL. Preciso que você desenvolva a solução completa do problema descrito abaixo e depois me ajude a entendê-la.

## Pedido principal

Crie uma **API RESTful** para conversão e registro de medições de sensores, usando **Node.js**, o framework **Express** e **MySQL** com a biblioteca **mysql2/promise**.

**Importante:** coloque todos os arquivos-fonte dentro de uma pasta chamada **`api-repository`**. Nela devem estar:

- o código da API (arquivo principal, rotas, conexão com o banco, regras de negócio);
- o arquivo SQL (`medicoes.sql`) com a criação da tabela;
- o `package.json` com as dependências;
- um `README.md` curto explicando como instalar e executar.

O projeto será publicado em um repositório público no GitHub, então organize o código de forma limpa e comentada.

## Contexto

Trabalho para uma empresa de monitoramento e instrumentação científica. O sistema gerencia medições: permite cadastrar leituras feitas por sensores, converte automaticamente as unidades (temperatura, velocidade e comprimento) e classifica cada medição por faixas de valores.

## Objetivos

1. Criar a API com Node.js + Express, rodando na **porta 3000**.
2. Conectar ao MySQL usando `mysql2/promise`.
3. Implementar o CRUD completo (Create, Read, Update, Delete) do recurso de medições.
4. Aplicar as regras de negócio de conversão de unidades e classificação.

## Regras de negócio

Ao criar ou atualizar uma medição, processe o campo `tipo` (aceita apenas `"temperatura"`, `"velocidade"` ou `"comprimento"`):

### Temperatura
- Conversão de °C para °F: `F = (C * 9 / 5) + 32`
- Unidade original: `°C` | Unidade convertida: `°F`
- Classificação:
  - menor que 10: **"Frio"**
  - de 10 a 25 (inclusive): **"Agradável"**
  - maior que 25: **"Quente"**

### Velocidade
- Conversão de km/h para m/s: `m/s = km/h / 3.6`
- Unidade original: `km/h` | Unidade convertida: `m/s`
- Classificação:
  - menor que 40: **"Baixa Velocidade"**
  - de 40 a 90 (inclusive): **"Velocidade Moderada"**
  - maior que 90: **"Alta Velocidade"**

### Comprimento
- Conversão de metros para pés: `ft = m * 3.28084`
- Unidade original: `m` | Unidade convertida: `ft`
- Classificação:
  - menor que 5: **"Curto"**
  - de 5 a 50 (inclusive): **"Médio"**
  - maior que 50: **"Longo"**

**Todos os valores convertidos devem ser arredondados para 2 casas decimais.**

## Banco de dados

Use exatamente este script DDL (salve-o em `api-repository/medicoes.sql`):

```sql
CREATE TABLE `medicoes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `descricao` VARCHAR(255) NOT NULL,
  `tipo` VARCHAR(50) NOT NULL,
  `valor_original` DOUBLE NOT NULL,
  `unidade_original` VARCHAR(20) NOT NULL,
  `valor_convertido` DOUBLE NOT NULL,
  `unidade_convertida` VARCHAR(20) NOT NULL,
  `classificacao` VARCHAR(50) NOT NULL
);
```

## Rotas (porta 3000)

| Método | Rota | Descrição | Status esperado |
|--------|------|-----------|-----------------|
| GET | `/` | Mensagem simples confirmando que a API está operacional | 200 OK |
| GET | `/medicao` | Lista todas as medições cadastradas | 200 OK |
| GET | `/medicao/alta-velocidade` | Lista apenas registros com classificação "Alta Velocidade" | 200 OK |
| GET | `/medicao/:id` | Detalhes de uma medição pelo ID | 200 OK / 404 Not Found |
| POST | `/medicao` | Recebe os dados, calcula a conversão e grava no banco | 201 Created / 400 Bad Request |
| PUT | `/medicao/:id` | Recebe novos dados, recalcula e atualiza o registro | 200 OK / 404 Not Found / 400 Bad Request |
| DELETE | `/medicao/:id` | Remove a medição do ID informado | 200 OK / 404 Not Found |

Atenção: a rota `/medicao/alta-velocidade` deve ser declarada **antes** de `/medicao/:id`, senão o Express interpreta "alta-velocidade" como um ID.

## Validações e tratamento de erros

- **Campos obrigatórios:** em POST e PUT, valide a presença de `descricao`, `tipo` e `valor` em `req.body`. Se faltar algum, retorne **400 Bad Request**.
- **Tipo inválido:** se `tipo` for diferente de `"temperatura"`, `"velocidade"` ou `"comprimento"`, retorne **400 Bad Request** com mensagem informativa.
- **Registro não encontrado:** em GET `/medicao/:id`, PUT `/medicao/:id` e DELETE `/medicao/:id`, retorne **404 Not Found** se o ID não existir.
- **Exceções:** use `try/catch` em todas as rotas assíncronas que acessam o banco. Em erro interno, retorne **500 Internal Server Error** com uma propriedade de detalhes (por exemplo `{ "erro": "...", "detalhes": "..." }`).

## Exemplo

Requisição `POST /medicao`:

```json
{
  "descricao": "Teste de velocidade em pista de testes",
  "tipo": "velocidade",
  "valor": 120
}
```

Resposta esperada (`201 Created`):

```json
{
  "id": 1,
  "descricao": "Teste de velocidade em pista de testes",
  "tipo": "velocidade",
  "valor_original": 120,
  "unidade_original": "km/h",
  "valor_convertido": 33.33,
  "unidade_convertida": "m/s",
  "classificacao": "Alta Velocidade"
}
```

## Perguntas para você responder depois de gerar o código

1. Quais arquivos você criou dentro de `api-repository` e qual a responsabilidade de cada um?
2. Explique, trecho por trecho, como funciona a conexão com o MySQL usando `mysql2/promise` (pool, `await`, consultas parametrizadas).
3. Como a função de conversão e classificação foi implementada e como ela é reutilizada no POST e no PUT?
4. Por que a rota `/medicao/alta-velocidade` precisa vir antes de `/medicao/:id`?
5. Como o código evita SQL Injection?
6. Como identificar se um ID existe no UPDATE e no DELETE (use `affectedRows` ou consulta prévia) e por que você escolheu essa abordagem?
7. Liste comandos `curl` para testar todas as rotas, incluindo os casos de erro (400, 404 e 500).
8. Quais erros ou pontos de melhoria você enxerga no código que escreveu?
9. Se o professor pedir para adicionar um novo tipo (por exemplo, "peso": kg para lb), quais linhas eu precisaria alterar?
