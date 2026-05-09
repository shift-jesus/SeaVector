import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, MessageCircle } from 'lucide-react';

const Navbar = ({ isDarkMode, setIsDarkMode, setIsChatOpen }) => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <nav className={`fixed top-0 w-full z-50 ${isDarkMode ? 'bg-black/50 backdrop-blur-md border-b border-white/10' : 'bg-white/70 backdrop-blur-md border-b border-gray-200'} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg"></div>
          <Link to="/" className={`font-bold text-xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>SeaVector</Link>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/" className={`text-sm hover:text-cyan-500 transition ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>SIMULACIÓN</Link>
          <Link to="/documentacion" className={`text-sm hover:text-cyan-500 transition ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>TEORÍA</Link>
          <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-2 rounded-full transition ${isDarkMode ? 'hover:bg-white/10 text-yellow-400' : 'hover:bg-gray-200 text-gray-700'}`}>
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          {isHome && (
            <button onClick={() => setIsChatOpen(true)} className={`px-4 py-2 rounded-full transition ${isDarkMode ? 'bg-cyan-500 text-white hover:bg-cyan-600' : 'bg-cyan-600 text-white hover:bg-cyan-700'}`}>
              <MessageCircle className="w-4 h-4 inline mr-2" />
              Chat
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;