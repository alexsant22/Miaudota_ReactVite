import { FaPaw, FaHeart } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <FaPaw className="text-2xl" />
            <span className="text-xl font-bold">Miaudota</span>
          </div>

          <p className="text-gray-400 text-center">
            <FaHeart className="inline text-red-400 mr-1" />
            Adote, não compre. Cada adoção salva duas vidas.
          </p>

          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
