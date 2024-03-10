"use client";
import React, { useEffect, useState } from "react";

interface PriceDetails {
  ask: number;
  bid: number;
  currency: string;
  bid_url: string;
  ask_url: string;
}

interface Prices {
  [key: string]: PriceDetails;
}

const idDetails = (): React.ReactElement => {
  // Uso window location porque UseRouter no puedo usarlo con las rutas directamente en app
  const [, , id] = window.location.pathname.split("/");

  const [prices, setPrices] = useState<Prices | null>(null);
  const [amount, setAmount] = useState<number>(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = `https://api.saldo.com.ar/json/rates/${id}`;
        const response = await fetch(apiUrl);

        if (response.ok) {
          const data: Prices = await response.json();
          setPrices(data);
        } else {
          console.error("Error al obtener los datos");
        }
      } catch (error) {
        console.error("Error en la solicitud:", error);
      }
    };

    fetchData();
  }, [id]);

  // Para calcular el valor en cada moneda
  const calculateValueInEachCurrency = (amount: number) => {
    if (!prices) return null;
    const values: { [key: string]: number } = {};

    Object.entries(prices).forEach(([pair, details]) => {
      values[pair] = amount * details.bid;
    });

    return values;
  };

  const renderValueInEachCurrency = () => {
    if (!prices || !id || prices[id]?.currency === null) return null;
    const values = calculateValueInEachCurrency(amount);

    return (
      <div className="w-full bg-red-500">
        <h2 className="text-lg font-semibold mb-2">
          Valor de {amount} {prices[id]?.currency} en otras monedas
        </h2>
        <ul>
          {Object.entries(values || {}).map(([pair, value]) => (
            <li key={pair}>
              <p>{`${value.toFixed(8)} ${pair}`}</p>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="default_page_container">
      <h1 className="text-2xl font-bold mb-4">Detalles del Sistema</h1>
      {prices ? (
        <div>
          <h2 className="text-lg font-semibold mb-2">
            Precios en relación a otros pares
          </h2>
          <ul className="list-disc pl-4 mb-4">
            {Object.entries(prices).map(([pair, details]) => (
              <li key={pair}>
                <p>{pair}</p>

                <h2 className="text-2xl">Currency: {details.currency}</h2>
              </li>
            ))}
          </ul>
          <div className="">
            <label
              htmlFor="amountInput"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Ingresa el valor:
            </label>
            <input
              className="border rounded px-3 py-2 w-20"
              type="number"
              id="amountInput"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>
          {renderValueInEachCurrency()}
        </div>
      ) : (
        <p>Cargando precios...</p>
      )}
    </div>
  );
};

export default idDetails;
