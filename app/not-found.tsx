import Link from "next/link";

export default function NotFound() {
  return (
    <div className="default_page_container">
      <div className="flex flex-col items-center justify-center space-y-10">
        <h2 className="text-2xl font-bold text-gray-800">
          Parece que esta página no existe
        </h2>
        <Link
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue text-center"
          href="/"
        >
          Ir a la página principal
        </Link>
      </div>
    </div>
  );
}
