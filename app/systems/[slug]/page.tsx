"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation"; // al tener todo directamente en app uso este hook en vez de useRouter

interface PriceDetails {
  ask: number;
  bid: number;
  currency: string;
}

interface Prices {
  [key: string]: PriceDetails;
}

const IdDetails = (): React.ReactElement => {
  const pathname = usePathname();
  const id = pathname.split("/")[2];
  const [prices, setPrices] = useState<Prices | null>(null);
  const [amount, setAmount] = useState<number>(1);

  useEffect(() => {
    if (id) {
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
    }
  }, [id]);
  const calculateValueInEachCurrency = (amount: number) => {
    if (!prices) return null;
    const values: { [key: string]: { value: number; currency: string } } = {};

    Object.entries(prices).forEach(([pair, details]) => {
      values[pair] = {
        value: amount / details.bid,
        currency: details.currency,
      };
    });

    return values;
  };

  const renderValueInEachCurrency = () => {
    if (!prices || !id || prices[id]?.currency === null) return null;

    const values = calculateValueInEachCurrency(amount);

    return (
      <div className="w-full flex justify-center">
        <ul>
          {values &&
            Object.entries(values).map(([pair, { value, currency }]) => (
              <li key={pair} className="mb-4">
                <p className="bg-yellow-200 font-bold p-2 rounded-md w-60">{`${value.toFixed(
                  8
                )} ${pair} `}</p>
              </li>
            ))}
        </ul>
      </div>
    );
  };

  const renderCurrencyDetails = () => {
    if (!prices || !id) return null;

    const currencyDetails = Object.entries(prices).map(([pair, details]) => ({
      pair,
      currency: details.currency,
    }));

    const uniqueCurrencies = Array.from(
      new Set(currencyDetails.map((detail) => detail.currency))
    );

    return (
      <ul className="list-disc pl-4 mb-4">
        {uniqueCurrencies.map((currency) => (
          <li key={currency}>
            <p>Moneda: {currency}</p>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="default_page_container">
      <h1 className="text-2xl font-bold mb-4">Detalles del Sistema</h1>
      {prices ? (
        <>
          <h2 className="text-lg font-semibold mb-2">
            Precios en relación a otros pares
          </h2>
          {renderCurrencyDetails()}
          <div className="">
            <label
              htmlFor="amountInput"
              className="block text-sm font-medium text-gray-700 mb-1 text-center"
            >
              Cantidad:
            </label>
            <input
              className="border rounded px-4 py-2 w-32 focus:outline-none focus:border-green-500 focus:ring focus:ring-green-200"
              type="text"
              id="amountInput"
              inputMode="numeric"
              pattern="[0-9]*"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>
          <p className="text-sm font-medium text-gray-700 mb-1">Cambio:</p>
          {renderValueInEachCurrency()}
          <Link
            href="/systems"
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"
          >
            Volver
          </Link>
        </>
      ) : (
        <p>Cargando precios...</p>
      )}
    </div>
  );
};

export default IdDetails;
