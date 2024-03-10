"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const userIsAuthenticated = localStorage.getItem("user") !== null;

    setLoggedIn(userIsAuthenticated);
  }, []);

  const handleLogout = () => {
    setLoggedIn(false);
    localStorage.removeItem("user");
    setUser(null);
    location.reload();
  };

  return (
    <nav className="bg-gray-800 p-4 w-full">
      <div className="container mx-auto max-w-[1200px] flex items-center justify-between">
        <div className="text-white font-bold text-xl">Saldo</div>

        <div>
          {loggedIn ? (
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-md"
              onClick={handleLogout}
            >
              Cerrar Sesión
            </button>
          ) : (
            <Link
              href="/login"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"
            >
              Iniciar Sesión
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
