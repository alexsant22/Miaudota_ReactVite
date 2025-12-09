import { Link, useNavigate } from "react-router-dom";
import { FaPaw, FaHeart, FaUser, FaPlus, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";

function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <FaPaw className="text-primary-600 text-2xl" />
            <span className="text-2xl font-bold text-gray-800">Miaudota</span>
          </Link>

          {/* Navegação */}
          <nav className="flex items-center gap-4 sm:gap-6">
            <Link
              to="/"
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              Início
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/add-pet"
                  className="text-gray-600 hover:text-primary-600 transition-colors flex items-center gap-1"
                >
                  <FaPlus /> Cadastrar
                </Link>
                <Link
                  to="/favorites"
                  className="text-gray-600 hover:text-primary-600 transition-colors flex items-center gap-1"
                >
                  <FaHeart /> Favoritos
                </Link>
                <Link
                  to="/profile"
                  className="text-gray-600 hover:text-primary-600 transition-colors flex items-center gap-1"
                >
                  <FaUser /> {user?.name || "Perfil"}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-red-600 transition-colors flex items-center gap-1"
                >
                  <FaSignOutAlt /> Sair
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/favorites"
                  className="text-gray-600 hover:text-primary-600 transition-colors flex items-center gap-1"
                >
                  <FaHeart /> Favoritos
                </Link>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-primary-600 transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Cadastrar
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
