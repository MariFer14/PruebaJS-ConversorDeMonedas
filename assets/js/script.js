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

    console.log(data);

    const valorMonedaUSD = data.dolar.valor;
    const valorMonedaEUR = data.euro.valor;
    const valorMonedaBTC = data.bitcoin.valor;
    let textConversion = "";
    let resultado;
    if (moneda == "USD") {
       resultado = monto / valorMonedaUSD;
      textConversion = `Resultado: ${resultado.toFixed(2)} USD`;
    } else if (moneda == "EUR"){
      resultado = monto / valorMonedaEUR;
      textConversion = `Resultado: ${resultado.toFixed(2)} EUR`;
    } else if (moneda == "BTC"){
      resultado = monto / valorMonedaBTC;
      textConversion = `Resultado: ${resultado.toFixed(2)} BTC`;
    }

    const conversion = document.querySelector(".conversion");
    conversion.innerHTML = textConversion;
  } catch (error) {
    console.error("Error al convertir moneda:", error);
  }
}

document
  .querySelector("#btn-convertir")
  .addEventListener("click", convertirMonedas);
