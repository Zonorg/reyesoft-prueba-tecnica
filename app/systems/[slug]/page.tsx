"use client";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React, { useEffect, useState, ChangeEvent } from "react";
import Image from "next/image";

// Definiciones para Typescript
interface SystemData {
  meta: any[];
  data: {
    type: string;
    id: string;
    attributes: {
      currency: string;
      name: string;
    };
  };
  included: any[];
}

export default function idDetails(): React.ReactElement {
  // Para obtener el id de la query, normalmente se usa useRouter pero tuve que optar por pathname
  // Ya que mi proyecto se encuentra en app y Next no permite usar useRoute de ésta manera
  const pathname = usePathname();
  const id = pathname.split("/")[2];

  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);

  const [systemData, setSystemData] = useState<SystemData | null>(null);
  const [equivalentValues, setEquivalentValues] = useState<
    { currency: string; value: string }[]
  >([]);

  // Valor por defecto para cualquier moneda elegida en el selector, usdt en este caso usdt
  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(
    "usdt"
  );

  useEffect(() => {
    const userIsAuthenticated = localStorage.getItem("user") !== null;

    if (!userIsAuthenticated) {
      router.push("/login");
    } else {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setUserName(user.name);
      }

      //Llamada a la api incluyendo los rates para poder hacer el calculo de divisas
      const fetchData = async () => {
        try {
          const response = await fetch(
            `https://api.saldo.com.ar/v3/systems/${id}?include=rates`
          );
          const data: SystemData = await response.json();
          setSystemData(data);
        } catch (error) {
          console.error("Error fetching system data", error);
        }
      };

      fetchData();
    }
  }, [id]);

  // Para hacer el calculo de divisas según = moneda elegida / rateAttributes.price
  // Retorna el id y la cantidad a recibir de la divisa elegida y reemplaza los decimales por ","
  const calculateEquivalentValues = (sendingAmount: number) => {
    if (!systemData) return;

    const values = systemData.included.map((rate: any) => {
      const rateAttributes = rate.attributes;
      const equivalentValue = sendingAmount / rateAttributes.price;

      return {
        currency: rateAttributes.system_id,
        value: equivalentValue.toFixed(2).replace(".", ","),
      };
    });

    setEquivalentValues(values);
  };

  // Selector de Divisas
  const handleCurrencySelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setSelectedCurrency(selected);
  };

  // Para renderizar el cambio de valores en el input y comprobar que no este vacío el dato si no da un NaN
  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const sendingAmount = parseFloat(e.target.value);

    if (!isNaN(sendingAmount) && sendingAmount >= 0) {
      calculateEquivalentValues(sendingAmount);
    }
  };

  return (
    <div className="default_page_container">
      {systemData && (
        <div className="mb-4">
          <Image
            src={`https://api.saldo.com.ar/img/sistemas2/${id}.big.webp`}
            alt={systemData?.data.attributes.name}
            width={200}
            height={200}
          />
        </div>
      )}

      {systemData && (
        <>
          <h2 className="text-lg font-semibold mb-2">
            Precios en relación a otros pares
          </h2>

          <div className="flex flex-col">
            <label
              htmlFor="amountInput"
              className="block text-sm font-bold text-gray-700 mb-3 text-center"
            >
              Cantidad: {systemData?.data.attributes.currency}
            </label>
            <input
              type="text"
              id="amountInput"
              onChange={handleAmountChange}
              inputMode="numeric"
              pattern="[0-9]*"
              className="focus:outline-none focus:ring-1 focus:ring-green-400 focus:border-green-400 rounded-md py-2 px-4 w-40 text-center border border-gray-200"
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="currencySelector"
              className="block text-sm font-medium text-gray-700 mb-1 text-end"
            >
              Seleccionar moneda:
            </label>

            <select
              id="currencySelector"
              onChange={handleCurrencySelect}
              value={selectedCurrency || ""}
              className="focus:outline-none focus:ring-1 focus:ring-green-400 focus:border-green-400 border-gray-300 rounded-md py-2 px-4 w-40 text-center border border-gray-200"
            >
              {equivalentValues.map((equivalent, index) => (
                <option key={index} value={equivalent.currency}>
                  {equivalent.currency}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col sm:flex-row mb-4 items-center">
            <p className="text-sm font-bold text-gray-700">Recibirás:</p>
            {equivalentValues
              .filter(
                (value) =>
                  selectedCurrency === null ||
                  value.currency === selectedCurrency
              )
              .map((equivalent, index) => (
                <p key={index} className="ml-4">
                  {isNaN(parseFloat(equivalent.value))
                    ? "Ingresa un monto válido"
                    : `${equivalent.value}`}
                </p>
              ))}
            <Image
              src={`https://api.saldo.com.ar/img/sistemas2/${selectedCurrency}.big.webp`}
              alt="Divisa de cambio"
              width={200}
              height={200}
              className="ml-4"
            />
          </div>

          <Link
            href="/systems"
            className="bg-green-saldo hover:bg-green-hover transition text-white py-2 px-4 rounded-md focus:outline-none focus:shadow-outline-blue"
          >
            Volver
          </Link>
        </>
      )}
    </div>
  );
}
