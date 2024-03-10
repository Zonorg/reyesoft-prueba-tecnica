import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-4 w-full">
      <div className="container mx-auto max-w-[1200px] flex items-center justify-between">
        <Link href="/">
          <Image
            src="https://cdn2.saldo.com.ar/assets/logo-saldo-color.svg"
            width={120}
            height={120}
            alt="Site logo"
            className="h-auto"
          />
        </Link>
      </div>
    </nav>
  );
}
