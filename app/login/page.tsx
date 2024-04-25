"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";

export default function Login() {
  const router = useRouter();

  // Para insertar los datos del formulario y mostrar también un error en caso de estar mal las credenciales
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    // Si el usuario tiene la sesión iniciada correctamente nos lleva a /systems
    const userIsAuthenticated = localStorage.getItem("user") !== null;

    if (userIsAuthenticated) {
      router.push("/systems");
    }
  }, []);
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("https://api.saldo.com.ar/bridge/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData.username);
        setError(null);
        localStorage.setItem("user", JSON.stringify(userData));
        router.push("/systems");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Credenciales incorrectas");
        setUser(null);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      setError("Error en la solicitud.");
      setUser(null);
    }
  };

  return (
    <div className="flex gap-5 m-auto max-lg:w-full max-md:px-4">
      <video
        src="/login-video.mp4"
        autoPlay
        muted
        loop
        playsInline
        width={400}
        className="max-xl:hidden"
      />
      <div className="default_page_container bg-white shadow-md rounded rounded-md max-lg:w-2/3 max-md:w-full">
        <h1 className="text-2xl font-bold">Iniciar Sesión</h1>
        <form
          className="max-w-md mx-auto max-md:w-full"
          onSubmit={handleSubmit}
        >
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="admin@saldo.com.ar"
              className="w-96 max-md:w-full px-3 py-2 border rounded-md focus:outline-none focus:border-green-saldo"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="CoolSite"
              className="w-96 max-md:w-full px-3 py-2 border rounded-md focus:outline-none focus:border-green-saldo"
              required
            />
          </div>
          <div className="mb-4 text-center">
            <button
              type="submit"
              className="bg-green-saldo hover:bg-green-hover transition text-white py-2 px-4 rounded-md w-full focus:outline-none focus:shadow-outline-blue"
            >
              Iniciar Sesión
            </button>
            <p className="text-sm text-green-saldo mt-5">
              mail: admin@saldo.com.ar
            </p>
            <p className="text-sm text-green-saldo">pass: CoolSite</p>
          </div>
          <div className="mb-4">
            {error && <p className="text-red-500 text-center">{error}</p>}
          </div>
        </form>
      </div>
    </div>
  );
}
