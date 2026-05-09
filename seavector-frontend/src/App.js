import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Documentation from './pages/Documentation';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen">
        <Navbar
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          setIsChatOpen={setIsChatOpen}
        />
        <Routes>
          <Route
            path="/"
            element={
              <Home
                isDarkMode={isDarkMode}
                setIsDarkMode={setIsDarkMode}
                isChatOpen={isChatOpen}
                setIsChatOpen={setIsChatOpen}
              />
            }
          />
          <Route
            path="/documentacion"
            element={<Documentation isDarkMode={isDarkMode} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;