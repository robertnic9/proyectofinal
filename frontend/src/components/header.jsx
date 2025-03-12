"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, User, ChevronDown, ChevronUp } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  
  useEffect(() => {
    fetch("http://localhost/online/backend/controlers/user_logged.php", {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((userData) => {
        if (userData.error) {
          setUser(null);
          localStorage.removeItem("user");
        } else {
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
        }
      })
      .catch((error) => {
        console.error("Error al obtener datos del usuario:", error);
      });
  }, [pathname]); // Recargar cuando cambie la ruta

  const handleLogout = () => {
    fetch("http://localhost/online/backend/controlers/logout.php", {
      credentials: "include",
    });
    
    localStorage.removeItem("user");
    setUser(null);
    router.push('/login');
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-md fixed w-full z-30">
      <div className="px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-black">
          <span className="text-black">DigitalCourses</span>
        </Link>

        {/* NAVIGATION - Desktop */}
        <nav className="hidden sm:flex items-center space-x-6">
          <Link href="/" className="text-gray-700 hover:text-black">
            Inicio
          </Link>
          <Link href="/courses" className="text-gray-700 hover:text-black">
            Cursos
          </Link>
          <Link href="/myclassroom" className="text-gray-700 hover:text-black">
            Mis Clases
          </Link>

          {/* Si el usuario no está logueado, mostrar LOGIN */}
          {!user ? (
            <Link
              href="/login"
              className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
            >
              Iniciar Sesión
            </Link>
          ) : (
            /* Si el usuario está logueado, mostrar menú desplegable */
            <div className="relative text-white">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 bg-black px-4 py-2 rounded-lg hover:text-underline"
              >
                <User size={18} />
                <span>{user.name}</span>
                <span> {user.firstsurname}</span>
                {dropdownOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 text-white bg-black border rounded-lg shadow-lg z-30">
                  <Link
                    href="/perfil"
                    className="block px-4 rounded-lg py-2 hover:bg-gray-800"
                  >
                    Mi Perfil
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 rounded-lg py-2 text-red-600 hover:bg-gray-800"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* MENÚ HAMBURGUESA (para móviles) */}
        <button 
          className="sm:hidden text-black" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white border-t border-gray-200 shadow-lg z-40">
          <nav className="flex flex-col px-4 py-3 space-y-3">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-black py-2 border-b border-gray-100"
              onClick={closeMobileMenu}
            >
              Inicio
            </Link>
            <Link 
              href="/courses" 
              className="text-gray-700 hover:text-black py-2 border-b border-gray-100"
              onClick={closeMobileMenu}
            >
              Cursos
            </Link>
            <Link 
              href="/myclassroom" 
              className="text-gray-700 hover:text-black py-2 border-b border-gray-100"
              onClick={closeMobileMenu}
            >
              Mis Clases
            </Link>

            {!user ? (
              <Link
                href="/login"
                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 inline-block"
                onClick={closeMobileMenu}
              >
                Iniciar Sesión
              </Link>
            ) : (
              <div className="py-2 border-t border-gray-200 mt-2">
                <div className="flex items-center mb-4">
                  <User size={20} className="text-black mr-2" />
                  <div>
                    <p className="font-medium text-black">
                      {user.name} {user.firstsurname}
                    </p>
                  </div>
                </div>
                <Link
                  href="/perfil"
                  className="block text-gray-700 py-2 hover:text-black"
                  onClick={closeMobileMenu}
                >
                  Mi Perfil
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    closeMobileMenu();
                  }}
                  className="text-red-600 py-2 hover:text-red-800"
                >
                  Cerrar Sesión
                </button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}