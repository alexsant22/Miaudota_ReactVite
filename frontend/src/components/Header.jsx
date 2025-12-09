import { Link } from "react-router-dom";
import { FaPaw, FaHeart, FaUser } from "react-icons/fa";

function Header() {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <FaPaw className="text-primary-600 text-2xl" />
            <span className="text-2xl font-bold text-gray-800">Miaudota</span>
          </Link>

          <nav className="flex items-center gap-4 sm:gap-6">
            <Link
              to="/"
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              Início
            </Link>
            <Link
              to="/favorites"
              className="flex items-center gap-1 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <FaHeart /> Favoritos
            </Link>
            <Link
              to="/login"
              className="flex items-center gap-1 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <FaUser /> Entrar
            </Link>
            <Link
              to="/add-pet"
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Cadastrar Pet
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
