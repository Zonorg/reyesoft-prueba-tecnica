"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface System {
  type: string;
  id: string;
  attributes: {
    name: string;
    currency: string;
    can_send: boolean;
    can_receive: boolean;
  };
}

export default function Page(): React.ReactElement {
  const router = useRouter();
  const [systems, setSystems] = useState<System[]>([]);

  const [userName, setUserName] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 9;

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

      const fetchData = async () => {
        try {
          const response = await fetch("https://api.saldo.com.ar/v3/systems");
          if (response.ok) {
            const data = await response.json();
            setSystems(data.data);
          } else {
            console.error("Error al obtener los datos");
          }
        } catch (error) {
          console.error("Error en la solicitud:", error);
        }
      };

      fetchData();
    }
  }, [router]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = systems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(systems.length / itemsPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="default_page_container">
      {userName && (
        <div className="mb-4">
          <p className="font-bold">{`Hola, ${userName}!`}</p>
        </div>
      )}
      <h1 className="text-2xl font-bold mb-4">Lista de Activos Disponibles</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentItems.map((system) => (
          <div
            key={system.id}
            className="bg-white rounded-md p-4 shadow-md transition duration-300 ease-in-out transform hover:scale-105"
          >
            <Link href={`/systems/${system.id}`}>
              <h2 className="text-lg font-semibold mb-2">
                {system.attributes.name}
              </h2>

              <p className="text-gray-500">
                Currency: {system.attributes.currency}
              </p>
              <p className="text-gray-500">
                Can Send: {system.attributes.can_send.toString()}
              </p>
              <p className="text-gray-500">
                Can Receive: {system.attributes.can_receive.toString()}
              </p>
            </Link>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-center">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            className={`mx-2 px-3 py-1 ${
              currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-700"
            } rounded-full focus:outline-none`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
