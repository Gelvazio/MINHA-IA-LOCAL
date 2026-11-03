# LM Studio

_Atualizado em 2026-11-02._

## Instalação

- Versão: LM Studio 0.4.27, instalado via winget.

## Modelo

- Nome: `qwen/qwen3-coder-30b` (14,58 GB).
- Contexto: 16384 tokens.
- Processamento: somente CPU.

## Servidor

- Endereço: http://localhost:1234

## Ligar

```bash
lms load qwen/qwen3-coder-30b --context-length 16384 --gpu off
lms server start
```

## Desligar

```bash
lms unload --all
lms server stop
```

## Velocidade medida

- Cerca de 7 a 8 tokens por segundo.

## Integração

- Cline configurado com o provedor LM Studio.
