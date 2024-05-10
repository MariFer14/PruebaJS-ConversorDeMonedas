async function convertirMonedas() {
  try {
    const montoInput = document.querySelector("#monto");
    const monedaSelect = document.querySelector("#moneda");
    const monto = parseFloat(montoInput.value);
    const moneda = monedaSelect.value;

    if (moneda === "CLP") {
      const montoIngresado = document.querySelector(".conversion");
      montoIngresado.innerHTML = `${monto}`;
      return;
    }

    const res = await fetch(`https://mindicador.cl/api/`);
    const data = await res.json();

    const valorMonedaUSD = data.dolar.valor;
    const valorMonedaEUR = data.euro.valor;
    const valorMonedaBTC = data.bitcoin.valor;
    let textConversion = "";
    let resultado;
    if (moneda == "USD") {
      resultado = monto / valorMonedaUSD;
      textConversion = `Resultado: ${resultado.toFixed(2)} USD`;
    } else if (moneda == "EUR") {
      resultado = monto / valorMonedaEUR;
      textConversion = `Resultado: ${resultado.toFixed(2)} EUR`;
    } else if (moneda == "BTC") {
      resultado = monto / valorMonedaBTC;
      textConversion = `Resultado: ${resultado.toFixed(2)} BTC`;
    }

    const conversion = document.querySelector(".conversion");
    conversion.innerHTML = textConversion;

    updateGrafica(resultado);
  } catch (error) {
    console.error("Error al convertir moneda:", error);
  }
}

document
  .querySelector("#btn-convertir")
  .addEventListener("click", convertirMonedas);

async function getMonedas() {
  const endpoint = "https://api.gael.cloud/general/public/monedas";
  const res = await fetch(endpoint);
  const monedas = await res.json();
  return monedas;
}

function configuracionDeLaGrafica(monedas) {
  const tipoDeGrafica = "bar";
  const nombreDeLasMonedas = monedas.map((moneda) => moneda.Codigo);
  const nombre = "Monedas";
  const colorLinea = "#FA8072";
  const valores = monedas.map((moneda) => {
    const valor = moneda.Valor.replace(",", ".");
    return Number(valor);
  });

  const configuracion = {
    type: tipoDeGrafica,
    data: {
      labels: nombreDeLasMonedas,
      datasets: [
        {
          label: nombre,
          backgroundColor: colorLinea,
          data: valores,
        },
      ],
    },
  };
  return configuracion;
}

async function updateGrafica(valorConvertido) {
  try {
    const monedas = await getMonedas();
    const valores = monedas.map((moneda) => {
      const valor = moneda.Valor.replace(",", ".");
      return Number(valor) * valorConvertido;
    });

    if (
      grafica &&
      grafica.data &&
      grafica.data.datasets &&
      grafica.data.datasets.length > 0
    ) {
      grafica.data.datasets[0].data = valores;
      grafica.update();
    } else {
      console.error("La gráfica no es válida");
    }
  } catch (error) {
    console.error("Error al actualizar la gráfica:", error);
  }
}

async function renderDeLaGrafica() {
  const monedas = await getMonedas();
  const configuracion = configuracionDeLaGrafica(monedas);
  const graficaDOM = document.querySelector("#grafica");
  grafica = new Chart(graficaDOM, configuracion);
}

renderDeLaGrafica();
