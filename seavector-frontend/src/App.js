import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Waves, Clock, TrendingUp, ArrowRight, ChevronDown, Zap,
  Sun, Moon, MessageCircle, X, Github, MapPin, Mail, CheckCircle
} from 'lucide-react';
import Simulation3D from './components/Simulation3D';
import Chatbot from './components/Chatbot';

// Componente de sección con animación al hacer scroll
const Section = ({ children, id, className = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={`py-20 px-4 ${className}`}
    >
      {children}
    </motion.section>
  );
};

const App = () => {
  const [year, setYear] = useState(2025);
  const [erosionRate, setErosionRate] = useState(4.62);
  const [gradient, setGradient] = useState([0.31, 0.10]);
  const [riskLevel, setRiskLevel] = useState(67);
  const [seaLevel, setSeaLevel] = useState(12.4);
  const [simulationData, setSimulationData] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [notification, setNotification] = useState({ message: '', visible: false });

  const showNotification = (message) => {
    setNotification({ message, visible: true });
    setTimeout(() => {
      setNotification({ message: '', visible: false });
    }, 3000);
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchData = useCallback(async () => {
    const yearsFrom2024 = year - 2024;
    const simulatedErosion = 4.2 + (yearsFrom2024 * 0.18);
    const simulatedRisk = 45 + (yearsFrom2024 * 2.3);
    const simulatedSeaLevel = 8.5 + (yearsFrom2024 * 0.42);
    const simulatedGradientX = 0.31 + (yearsFrom2024 * 0.008);
    const simulatedGradientY = 0.10 + (yearsFrom2024 * 0.004);

    setErosionRate(Number(simulatedErosion.toFixed(2)));
    setRiskLevel(Math.min(98, Number(simulatedRisk.toFixed(0))));
    setSeaLevel(Number(simulatedSeaLevel.toFixed(1)));
    setGradient([Number(simulatedGradientX.toFixed(3)), Number(simulatedGradientY.toFixed(3))]);
    setSimulationData({ active: true });
  }, [year]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleYearChange = (newYear) => setYear(newYear);

  const getRiskColor = () => {
    if (riskLevel < 40) return 'text-emerald-400';
    if (riskLevel < 70) return 'text-yellow-400';
    return 'text-red-500';
  };

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
      document.body.classList.remove('light');
    } else {
      document.body.classList.add('light');
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  const CoastlineAnimation = () => {
    const canvasRef = useRef(null);
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      let animationId;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      canvas.width = width;
      canvas.height = height;

      const draw = () => {
        ctx.clearRect(0, 0, width, height);
        const grad = ctx.createLinearGradient(0, 0, width, 0);
        if (isDarkMode) {
          grad.addColorStop(0, '#0a1128');
          grad.addColorStop(1, '#01050c');
        } else {
          grad.addColorStop(0, '#e0f2fe');
          grad.addColorStop(1, '#bae6fd');
        }
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        ctx.beginPath();
        ctx.strokeStyle = isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.6)';
        ctx.lineWidth = 3;
        for (let x = 0; x < width; x += 10) {
          const y = height * 0.5 + Math.sin(x * 0.02) * 40;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        const retreat = Math.sin(Date.now() * 0.001) * 8 + 15;
        ctx.beginPath();
        ctx.strokeStyle = isDarkMode ? '#0ff' : '#0284c7';
        ctx.lineWidth = 2;
        for (let x = 0; x < width; x += 10) {
          const y = height * 0.5 + Math.sin(x * 0.02) * 40 + retreat;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        ctx.fillStyle = isDarkMode ? '#0ff' : '#0284c7';
        ctx.font = 'bold 14px "Space Grotesk"';
        ctx.fillText('← Retroceso de la costa', width - 150, height * 0.5 + retreat - 10);

        animationId = requestAnimationFrame(draw);
      };
      draw();
      return () => cancelAnimationFrame(animationId);
    }, [isDarkMode]);
    return <canvas ref={canvasRef} className="w-full h-64 rounded-2xl border border-cyan-500/30" />;
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-deep text-white' : 'bg-gradient-to-br from-sky-50 to-blue-100 text-gray-900'} relative overflow-x-hidden transition-colors duration-300`}>
      {/* Notificación Toast */}
      {notification.visible && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[100] animate-fade-in-down">
          <div className="flex items-center gap-2 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg">
            <CheckCircle className="w-5 h-5" />
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Fondo grid dinámico */}
      <div className={`fixed inset-0 ${isDarkMode ? 'grid-pattern opacity-40' : 'bg-grid-pattern-light opacity-20'} pointer-events-none`}></div>

      {/* Partículas flotantes */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div key={i} className={`absolute w-0.5 h-0.5 rounded-full animate-pulse ${isDarkMode ? 'bg-cyan-400' : 'bg-cyan-600'}`}
               style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 5}s`, opacity: 0.2 + Math.random() * 0.5 }} />
        ))}
      </div>

      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 ${isDarkMode ? 'bg-black/50 backdrop-blur-md border-b border-white/10' : 'bg-white/70 backdrop-blur-md border-b border-gray-200'} transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg"></div>
            <span className={`font-bold text-xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>SeaVector</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-2 rounded-full transition ${isDarkMode ? 'hover:bg-white/10 text-yellow-400' : 'hover:bg-gray-200 text-gray-700'}`}>
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button onClick={() => setIsChatOpen(true)} className={`px-4 py-2 rounded-full transition ${isDarkMode ? 'bg-cyan-500 text-white hover:bg-cyan-600' : 'bg-cyan-600 text-white hover:bg-cyan-700'}`}>
              <MessageCircle className="w-4 h-4 inline mr-2" />
              Chat
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-4 pt-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className={`inline-block mb-4 px-4 py-1 rounded-full ${isDarkMode ? 'bg-cyan-500/10 border-cyan-500/30' : 'bg-cyan-100 border-cyan-300'} border backdrop-blur-sm`}>
            <span className={`text-sm font-mono tracking-wider ${isDarkMode ? 'text-cyan-400' : 'text-cyan-700'}`}>◉ LIVE COASTAL SIMULATION</span>
          </div>
          <h1 className={`text-7xl md:text-8xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            SeaVector
          </h1>
          <p className={`text-xl max-w-2xl mx-auto mb-10 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Modelado predictivo de erosión costera en Cartagena con procesamiento de derivadas parciales en tiempo real.
          </p>
          <button onClick={() => scrollToSection('amenaza')} className={`text-lg px-8 py-4 rounded-full flex items-center gap-2 mx-auto transition ${isDarkMode ? 'bg-cyan-500 hover:bg-cyan-600 text-white' : 'bg-cyan-600 hover:bg-cyan-700 text-white'}`}>
            Explorar el Fenómeno <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer" onClick={() => scrollToSection('amenaza')}>
          <ChevronDown className={`w-8 h-8 ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`} />
        </div>
      </section>

      {/* Sección Erosión */}
      <Section id="amenaza" className={`max-w-6xl mx-auto ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Waves className={`w-8 h-8 ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`} />
              <h2 className="text-4xl font-bold">La Amenaza Silenciosa</h2>
            </div>
            <p className={`text-lg leading-relaxed mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              La <span className="text-cyan-500 font-semibold">erosión costera</span> es el proceso de degradación y retroceso de la línea de costa debido a la energía de las olas, corrientes marinas y el aumento del nivel del mar.
            </p>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              En Cartagena, este fenómeno avanza rápidamente. Para 2050, se estima una pérdida de hasta <span className="text-cyan-500">8 metros de playa</span> en sectores críticos como Bocagrande.
            </p>
          </div>
          <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-black/30 backdrop-blur-sm border border-white/20' : 'bg-white/50 backdrop-blur-sm border border-gray-200'}`}>
            <CoastlineAnimation />
          </div>
        </div>
      </Section>

      {/* Sección Gradiente */}
      <Section id="gradiente" className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-3">El Motor Matemático</h2>
          <p className={`text-xl ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>No solo observamos, <span className="text-cyan-500">calculamos</span>.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Zap className={`w-6 h-6 ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`} />
              <h3 className="text-2xl font-semibold">Vector Gradiente ∇E</h3>
            </div>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              El gradiente nos indica la <span className="text-cyan-500">dirección de máxima pérdida de terreno</span>.
              Si la superficie de la playa es <span className="font-mono text-cyan-500">E(x,y)</span>, el gradiente apunta hacia donde el terreno sube más rápido.
            </p>
            <div className={`p-4 rounded-xl font-mono text-center text-xl ${isDarkMode ? 'bg-black/50 border-cyan-500/30' : 'bg-white/50 border-cyan-400'}`}>
              ∇E = ∂E/∂x <span className="text-cyan-500">î</span> + ∂E/∂y <span className="text-cyan-500">ĵ</span>
            </div>
          </div>
          <div className={`p-6 rounded-2xl flex justify-center ${isDarkMode ? 'glass-premium' : 'bg-white/50 backdrop-blur-sm border border-gray-200'}`}>
            <div className="text-center">
              <div className="text-6xl mb-4">📐</div>
              <p className="text-cyan-500 font-mono">|∇E| = {gradient[0].toFixed(2)} i + {gradient[1].toFixed(2)} j</p>
              <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Magnitud del gradiente en {year}</p>
            </div>
          </div>
        </div>
      </Section>

      {/* Sección Variables */}
      <Section id="variables" className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-3">Variables Críticas</h2>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Un modelo multivariable para un fenómeno complejo</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className={`p-6 text-center rounded-2xl ${isDarkMode ? 'glass-premium' : 'bg-white/50 backdrop-blur-sm border border-gray-200'}`}>
            <div className="text-cyan-500 text-3xl mb-3">🌍</div>
            <h3 className="text-xl font-bold mb-2">Coordenadas (x, y)</h3>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Posición geográfica en la costa de Cartagena.</p>
          </div>
          <div className={`p-6 text-center rounded-2xl ${isDarkMode ? 'glass-premium' : 'bg-white/50 backdrop-blur-sm border border-gray-200'}`}>
            <div className="text-cyan-500 text-3xl mb-3">⏰</div>
            <h3 className="text-xl font-bold mb-2">Tiempo (t)</h3>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Proyección hasta 2050 con modelos IPCC RCP 4.5.</p>
          </div>
          <div className={`p-6 text-center rounded-2xl ${isDarkMode ? 'glass-premium' : 'bg-white/50 backdrop-blur-sm border border-gray-200'}`}>
            <div className="text-cyan-500 text-3xl mb-3">📈</div>
            <h3 className="text-xl font-bold mb-2">Diferencial Total</h3>
            <p className={`font-mono text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>dE = (∂E/∂x)dx + (∂E/∂y)dy + (∂E/∂t)dt</p>
          </div>
        </div>
      </Section>

      {/* Sección Dashboard */}
      <Section id="comando" className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className={`inline-block px-4 py-1 rounded-full ${isDarkMode ? 'bg-cyan-500/20 border-cyan-500/50' : 'bg-cyan-100 border-cyan-400'} border backdrop-blur-sm mb-4`}>
            <span className={`text-sm font-mono ${isDarkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>◉ SISTEMA DE SIMULACIÓN VECTORIAL ACTIVADO</span>
          </div>
          <h2 className="text-4xl font-bold">Centro de Comando</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <Simulation3D data={simulationData} year={year} />
          </div>
          <div className="lg:col-span-4 space-y-5">
            <div className={`p-6 rounded-2xl ${isDarkMode ? 'glass-premium' : 'bg-white/50 backdrop-blur-sm border border-gray-200'}`}>
              <div className="flex justify-between mb-3">
                <span className={`text-sm uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Erosion Rate</span>
                <span className="text-cyan-500 text-xs font-mono">cm/year</span>
              </div>
              <div className="text-5xl font-bold mb-2">{erosionRate}<span className="text-2xl text-gray-500"> cm/año</span></div>
              <div className="w-full bg-gray-700/50 rounded-full h-1.5 mt-3">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-1.5 rounded-full" style={{ width: `${Math.min(100, (erosionRate / 8) * 100)}` }}></div>
              </div>
            </div>
            <div className={`p-6 rounded-2xl ${isDarkMode ? 'glass-premium' : 'bg-white/50 backdrop-blur-sm border border-gray-200'}`}>
              <div className={`text-sm uppercase tracking-wider mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Vector Gradient</div>
              <div className="flex items-baseline gap-4">
                <div><span className="text-cyan-500 text-3xl font-bold">{gradient[0]}</span><span className="text-gray-500 ml-1">∂/∂x</span></div>
                <span className="text-gray-500 text-xl">+</span>
                <div><span className="text-cyan-500 text-3xl font-bold">{gradient[1]}</span><span className="text-gray-500 ml-1">∂/∂y</span></div>
              </div>
            </div>
            <div className={`p-6 rounded-2xl ${isDarkMode ? 'glass-premium' : 'bg-white/50 backdrop-blur-sm border border-gray-200'}`}>
              <div className="flex justify-between items-center mb-3">
                <span className={`text-sm uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Risk Level</span>
                <span className={`text-xl font-bold ${getRiskColor()}`}>{riskLevel}%</span>
              </div>
              <div className="w-full bg-gray-700/50 rounded-full h-2">
                <div className={`h-2 rounded-full transition-all duration-500 ${riskLevel < 40 ? 'bg-emerald-500' : riskLevel < 70 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${riskLevel}%` }}></div>
              </div>
            </div>
            <div className={`p-6 rounded-2xl ${isDarkMode ? 'glass-premium' : 'bg-white/50 backdrop-blur-sm border border-gray-200'}`}>
              <div className={`text-sm uppercase tracking-wider mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Sea Level Rise</div>
              <div className="text-4xl font-bold text-blue-400">{seaLevel}<span className="text-lg text-gray-500"> cm</span></div>
            </div>
            <div className={`p-6 rounded-2xl ${isDarkMode ? 'glass-premium' : 'bg-white/50 backdrop-blur-sm border border-gray-200'}`}>
              <div className="flex justify-between mb-4">
                <span className={`text-sm uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Time Control</span>
                <span className="text-cyan-500 text-xl font-bold">{year}</span>
              </div>
              <input type="range" min="2024" max="2050" step="1" value={year} onChange={(e) => handleYearChange(parseInt(e.target.value))} className="w-full" />
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>2024</span><span>2030</span><span>2040</span><span>2050</span>
              </div>
              <button onClick={() => handleYearChange(2050)} className={`w-full mt-5 text-sm py-2 rounded-full transition ${isDarkMode ? 'bg-cyan-500 hover:bg-cyan-600' : 'bg-cyan-600 hover:bg-cyan-700'} text-white`}>PROJECT TO 2050 →</button>
            </div>
          </div>
        </div>
      </Section>

      {/* Footer */}
      <footer className={`relative z-10 mt-20 border-t ${isDarkMode ? 'border-white/10 bg-black/30' : 'border-gray-200 bg-white/50'} backdrop-blur-sm`}>
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg"></div>
                <span className={`font-bold text-xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>SeaVector</span>
              </div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Simulación 3D de erosión costera en Cartagena usando derivadas parciales y vectores de gradiente.
              </p>
            </div>

            <div className="col-span-1">
              <h3 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Enlaces</h3>
              <ul className="space-y-2">
                <li><button onClick={() => scrollToSection('amenaza')} className={`text-sm hover:text-cyan-500 transition ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>La Amenaza</button></li>
                <li><button onClick={() => scrollToSection('gradiente')} className={`text-sm hover:text-cyan-500 transition ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Motor Matemático</button></li>
                <li><button onClick={() => scrollToSection('variables')} className={`text-sm hover:text-cyan-500 transition ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Variables Críticas</button></li>
                <li><button onClick={() => scrollToSection('comando')} className={`text-sm hover:text-cyan-500 transition ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Centro de Comando</button></li>
              </ul>
            </div>

            <div className="col-span-1">
              <h3 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>About Us</h3>
              <ul className="space-y-2">
                <li>
                  <a href="https://github.com/shift-jesus/SeaVector" target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 text-sm hover:text-cyan-500 transition ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <Github className="w-4 h-4" /> GitHub Repository
                  </a>
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="w-4 h-4" /> Cartagena, Colombia
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-500">
                  <Mail className="w-4 h-4" /> jcampoy21@campusuninunez.edu.co
                </li>
              </ul>
            </div>

            <div className="col-span-1">
              <h3 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Créditos</h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Desarrollado por:</p>
              <p className={`font-semibold mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Grupo 4 - Jesús Campo</p>
              <div className="mt-4">
                <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Corporación Universitaria Rafael Núñez</span>
              </div>
            </div>
          </div>

          <div className={`mt-8 pt-8 text-center text-xs ${isDarkMode ? 'text-gray-500 border-t border-white/10' : 'text-gray-400 border-t border-gray-200'}`}>
            <p>© 2026 SeaVector - Simulación de Erosión Costera. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Botón flotante de chat */}
      {!isChatOpen && (
        <button onClick={() => setIsChatOpen(true)} className={`fixed bottom-6 right-6 p-4 rounded-full shadow-lg z-50 transition ${isDarkMode ? 'bg-cyan-500 hover:bg-cyan-600' : 'bg-cyan-600 hover:bg-cyan-700'} text-white`}>
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chatbot */}
      <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} isDarkMode={isDarkMode} onNotify={showNotification} />
    </div>
  );
};

export default App;