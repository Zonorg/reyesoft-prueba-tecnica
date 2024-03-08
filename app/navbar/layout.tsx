"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    // Verifica si hay información de inicio de sesión en localStorage
    const userIsAuthenticated = localStorage.getItem("user") !== null;

    setLoggedIn(userIsAuthenticated);
  }, []);

  const handleLogout = () => {
    // Lógica para cerrar sesión (puedes agregar aquí la limpieza del estado, por ejemplo)
    setLoggedIn(false);

    // Limpia la información de inicio de sesión en localStorage al cerrar sesión
    localStorage.removeItem("user");

    // Limpia el estado del usuario
    setUser(null);
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo o título de la aplicación */}
        <div className="text-white font-bold text-xl">Mi Aplicación</div>

        {/* Botón de inicio/cierre de sesión */}
        <div>
          {loggedIn ? (
            // Si está iniciado, muestra el botón de Cerrar Sesión
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-md"
              onClick={handleLogout}
            >
              Cerrar Sesión
            </button>
          ) : (
            // Si no está iniciado, muestra el botón de Iniciar Sesión y enlaza a /login
            <Link href="/login">Iniciar Sesión</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
