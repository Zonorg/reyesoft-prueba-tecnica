"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const userIsAuthenticated = localStorage.getItem("userIsAuthenticated");

    if (!userIsAuthenticated) {
      router.replace("/login");
    }
  }, []);

  return (
    <main>
      <h2>Redireccionando...</h2>
    </main>
  );
}
