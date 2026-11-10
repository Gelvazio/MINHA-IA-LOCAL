# API de Medições

API REST (Node.js + Express + MySQL via `mysql2/promise`) para cadastrar medições de sensores, converter unidades (temperatura, velocidade, comprimento) e classificá-las por faixas de valores. Roda na porta **3000**.

## Pré-requisitos
- Node.js 18+ e npm
- MySQL 8+ em execução

## Criar o banco
```bash
mysql -u root -p < medicoes.sql
```

## Variáveis de ambiente
Copie `.env.example` para `.env` e ajuste: `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` (padrão `medicoes_db`), `DB_PORT`.

## Instalar e executar
```bash
npm install
npm start
```

## Rotas
| Método | Rota | Descrição | Status |
|--------|------|-----------|--------|
| GET | `/` | API operacional | 200 |
| GET | `/medicao` | Lista todas as medições | 200 |
| GET | `/medicao/alta-velocidade` | Apenas classificação "Alta Velocidade" | 200 |
| GET | `/medicao/:id` | Detalhe de uma medição | 200 / 404 |
| POST | `/medicao` | Converte, classifica e grava | 201 / 400 |
| PUT | `/medicao/:id` | Recalcula e atualiza | 200 / 400 / 404 |
| DELETE | `/medicao/:id` | Remove a medição | 200 / 404 |

Tipos aceitos: `temperatura` (°C→°F), `velocidade` (km/h→m/s), `comprimento` (m→ft).

## Exemplos (curl)
```bash
# Criar (201)
curl -X POST http://localhost:3000/medicao -H "Content-Type: application/json" \
  -d '{"descricao":"Teste de velocidade","tipo":"velocidade","valor":120}'

# Listar e buscar
curl http://localhost:3000/medicao
curl http://localhost:3000/medicao/alta-velocidade
curl http://localhost:3000/medicao/1

# Atualizar e remover
curl -X PUT http://localhost:3000/medicao/1 -H "Content-Type: application/json" \
  -d '{"descricao":"Sala","tipo":"temperatura","valor":22}'
curl -X DELETE http://localhost:3000/medicao/1

# 400: tipo inválido
curl -i -X POST http://localhost:3000/medicao -H "Content-Type: application/json" \
  -d '{"descricao":"x","tipo":"peso","valor":10}'

# 404: ID inexistente
curl -i http://localhost:3000/medicao/9999
```

## Arquivos
- `db.js`: cria o pool de conexões `mysql2/promise` usando as variáveis de ambiente.
- `medicaoService.js`: regras de negócio (conversão de unidades, classificação) e acesso ao banco com consultas parametrizadas.
- `server.js`: aplicação Express, rotas, validações e tratamento de erros (400/404/500).
- `medicoes.sql`: criação do banco `medicoes_db` e da tabela `medicoes`.
