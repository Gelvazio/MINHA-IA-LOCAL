# Conceitos

_Atualizado em 2026-11-02._

- **Pesos:** bilhões de números aprendidos que formam o "cérebro" do modelo.
- **Pesos abertos:** podem rodar localmente no seu computador.
- **Quantização (Q4, Q8):** reduz a precisão dos números para caber na RAM.
- **RAM necessária ≈ parâmetros × bits ÷ 8.** Ex.: 30 bilhões de parâmetros em 4 bits ≈ 15 GB.
- **MoE (ex.: 30B-A3B):** usa só uma parte dos pesos por token, por isso roda bem na CPU.
