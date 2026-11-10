// medicaoService.js - Regras de negócio: conversão de unidades e classificação.
// Reutilizado tanto no POST quanto no PUT.

// Tipos de medição aceitos pela API
const TIPOS_VALIDOS = ['temperatura', 'velocidade', 'comprimento'];

// Arredonda para 2 casas decimais
const arredondar = (n) => Math.round(n * 100) / 100;

/**
 * Converte o valor e classifica a medição conforme o tipo.
 * @param {string} tipo  'temperatura' | 'velocidade' | 'comprimento'
 * @param {number|string} valor  valor medido na unidade original
 * @returns {object|null} dados calculados, ou null se o tipo for inválido
 */
function processarMedicao(tipo, valor) {
  const valor_original = Number(valor);
  let unidade_original;
  let unidade_convertida;
  let valor_convertido;
  let classificacao;

  switch (tipo) {
    case 'temperatura': // °C -> °F
      unidade_original = '°C';
      unidade_convertida = '°F';
      valor_convertido = (valor_original * 9) / 5 + 32;
      if (valor_original < 10) classificacao = 'Frio';
      else if (valor_original <= 25) classificacao = 'Agradável'; // 10 a 25 inclusive
      else classificacao = 'Quente';
      break;

    case 'velocidade': // km/h -> m/s
      unidade_original = 'km/h';
      unidade_convertida = 'm/s';
      valor_convertido = valor_original / 3.6;
      if (valor_original < 40) classificacao = 'Baixa Velocidade';
      else if (valor_original <= 90) classificacao = 'Velocidade Moderada'; // 40 a 90 inclusive
      else classificacao = 'Alta Velocidade';
      break;

    case 'comprimento': // m -> ft
      unidade_original = 'm';
      unidade_convertida = 'ft';
      valor_convertido = valor_original * 3.28084;
      if (valor_original < 5) classificacao = 'Curto';
      else if (valor_original <= 50) classificacao = 'Médio'; // 5 a 50 inclusive
      else classificacao = 'Longo';
      break;

    default:
      return null; // tipo inválido
  }

  return {
    valor_original,
    unidade_original,
    valor_convertido: arredondar(valor_convertido),
    unidade_convertida,
    classificacao,
  };
}

module.exports = { TIPOS_VALIDOS, processarMedicao };
