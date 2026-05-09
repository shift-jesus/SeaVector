import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Sigma, TrendingDown, Clock, Database, AlertTriangle, ArrowRight } from 'lucide-react';

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
      className={`min-h-screen flex flex-col justify-center items-center px-4 py-20 ${className}`}
    >
      {children}
    </motion.section>
  );
};

const GradientIllustration = ({ isDarkMode }) => {
  const canvasRef = useRef(null);
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width;
    canvas.height = height;

    // Fondo oscuro o claro según el modo
    if (isDarkMode) {
      const grad = ctx.createLinearGradient(0, 0, width, 0);
      grad.addColorStop(0, '#020617');
      grad.addColorStop(1, '#0f172a');
      ctx.fillStyle = grad;
    } else {
      ctx.fillStyle = '#f0f9ff';
    }
    ctx.fillRect(0, 0, width, height);

    // Línea de costa
    ctx.beginPath();
    ctx.moveTo(width * 0.1, height * 0.7);
    ctx.quadraticCurveTo(width * 0.3, height * 0.85, width * 0.5, height * 0.7);
    ctx.quadraticCurveTo(width * 0.7, height * 0.55, width * 0.9, height * 0.65);
    ctx.strokeStyle = isDarkMode ? '#fde68a' : '#b45309';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Flecha gradiente
    ctx.beginPath();
    ctx.moveTo(width * 0.3, height * 0.5);
    ctx.lineTo(width * 0.7, height * 0.5);
    ctx.lineTo(width * 0.6, height * 0.4);
    ctx.moveTo(width * 0.7, height * 0.5);
    ctx.lineTo(width * 0.6, height * 0.6);
    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.fillStyle = '#22d3ee';
    ctx.font = 'bold 18px "Space Grotesk"';
    ctx.fillText('∇E', width * 0.45, height * 0.38);
    ctx.fillStyle = isDarkMode ? '#94a3b8' : '#475569';
    ctx.font = '12px monospace';
    ctx.fillText('dirección de máxima erosión', width * 0.45, height * 0.48);
  }, [isDarkMode]);
  return <canvas ref={canvasRef} className="w-full max-w-md h-64 mx-auto rounded-xl border border-cyan-500/30" />;
};

const Documentation = ({ isDarkMode }) => {
  const scrollToSimulation = () => {
    window.location.href = '/';
    setTimeout(() => {
      const element = document.getElementById('comando');
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-deep text-white' : 'bg-gradient-to-br from-sky-50 to-blue-100 text-gray-900'} transition-colors duration-300 overflow-x-hidden`}>
      <Section id="hero" className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className={`inline-block mb-4 px-4 py-1 rounded-full ${isDarkMode ? 'bg-cyan-500/10 border-cyan-500/30' : 'bg-cyan-100 border-cyan-300'} border backdrop-blur-sm`}>
            <span className={`text-sm font-mono tracking-wider ${isDarkMode ? 'text-cyan-400' : 'text-cyan-700'}`}>◉ BASES TEÓRICAS</span>
          </div>
          <h1 className={`text-6xl md:text-7xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            FUNDAMENTACIÓN<br />CIENTÍFICA
          </h1>
          <p className={`text-lg max-w-2xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Modelado matemático de la erosión costera basado en cálculo multivariable y derivadas parciales.
          </p>
        </motion.div>
      </Section>

      <Section id="matematica">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Sigma className="w-8 h-8 text-cyan-400" />
            <h2 className={`text-3xl md:text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Modelo de Elevación</h2>
          </div>
          <div className={`${isDarkMode ? 'glass-premium' : 'bg-white/70 backdrop-blur-sm border border-gray-200'} p-8 rounded-2xl mb-8`}>
            <p className={`text-2xl md:text-3xl font-mono ${isDarkMode ? 'text-cyan-300' : 'text-cyan-700'} break-words`}>
              E(x, y, t) = A·cos(Bx)·e<sup>-Cy</sup> - D·t
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div className={`${isDarkMode ? 'glass-premium' : 'bg-white/70 backdrop-blur-sm border border-gray-200'} p-4 rounded-xl`}>
              <p><span className="text-cyan-400 font-bold">x, y</span> : coordenadas costeras (m)</p>
              <p><span className="text-cyan-400 font-bold">t</span> : tiempo (años, base 2024)</p>
              <p><span className="text-cyan-400 font-bold">A, B, C, D</span> : coeficientes empíricos por sector</p>
            </div>
            <div className={`${isDarkMode ? 'glass-premium' : 'bg-white/70 backdrop-blur-sm border border-gray-200'} p-4 rounded-xl`}>
              <p><span className="text-cyan-400">A·cos(Bx)</span> representa la forma de la línea de costa.</p>
              <p><span className="text-cyan-400">e<sup>-Cy</sup></span> modela la pérdida de elevación tierra adentro.</p>
              <p><span className="text-cyan-400">- D·t</span> es la tasa de erosión lineal en el tiempo.</p>
            </div>
          </div>
        </div>
      </Section>

      <Section id="gradiente">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <TrendingDown className="w-8 h-8 text-cyan-400" />
            <h2 className={`text-3xl md:text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Vector Gradiente ∇E</h2>
          </div>
          <div className={`${isDarkMode ? 'glass-premium' : 'bg-white/70 backdrop-blur-sm border border-gray-200'} p-6 rounded-2xl mb-8`}>
            <p className={`text-xl md:text-2xl font-mono ${isDarkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>
              ∇E = ( ∂E/∂x , ∂E/∂y , ∂E/∂t )
            </p>
            <p className={`mt-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Indica la <span className="text-cyan-400">dirección de máxima pérdida de terreno</span> en cada punto.
            </p>
          </div>
          <GradientIllustration isDarkMode={isDarkMode} />
          <p className={`text-sm mt-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Ilustración: la flecha muestra hacia dónde avanza el mar más rápidamente.</p>
        </div>
      </Section>

      <Section id="derivadas">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Clock className="w-8 h-8 text-cyan-400" />
            <h2 className={`text-3xl md:text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Derivada Temporal</h2>
          </div>
          <div className={`${isDarkMode ? 'glass-premium' : 'bg-white/70 backdrop-blur-sm border border-gray-200'} p-6 rounded-2xl`}>
            <p className={`text-xl md:text-2xl font-mono ${isDarkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>
              ∂E/∂t = -D
            </p>
            <p className={`mt-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              La costa pierde altura a una velocidad constante de <span className="text-cyan-400">{Math.abs(-0.15).toFixed(2)} m/año</span> en el modelo base.
              Esto se traduce en una pérdida aproximada de <span className="text-cyan-400">8 metros de playa</span> hacia 2050.
            </p>
            <div className={`mt-4 p-3 rounded-lg ${isDarkMode ? 'bg-yellow-500/10 border border-yellow-500/30' : 'bg-yellow-100 border border-yellow-400'}`}>
              <AlertTriangle className="w-5 h-5 inline mr-2 text-yellow-500" />
              <span className="text-sm">Sin medidas de defensa, la erosión puede acelerarse por eventos climáticos extremos.</span>
            </div>
          </div>
        </div>
      </Section>

      <Section id="ingenieria">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Database className="w-8 h-8 text-cyan-400" />
            <h2 className={`text-3xl md:text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Implementación Tecnológica</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className={`${isDarkMode ? 'glass-premium' : 'bg-white/70 backdrop-blur-sm border border-gray-200'} p-6 rounded-2xl`}>
              <div className="text-4xl mb-3">☕</div>
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Java + Spring Boot</h3>
              <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>API REST que resuelve derivadas parciales en tiempo real.</p>
            </div>
            <div className={`${isDarkMode ? 'glass-premium' : 'bg-white/70 backdrop-blur-sm border border-gray-200'} p-6 rounded-2xl`}>
              <div className="text-4xl mb-3">🗄️</div>
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>SQLite</h3>
              <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Almacena coeficientes por sector y registros históricos de oleaje.</p>
            </div>
            <div className={`${isDarkMode ? 'glass-premium' : 'bg-white/70 backdrop-blur-sm border border-gray-200'} p-6 rounded-2xl`}>
              <div className="text-4xl mb-3">⚛️</div>
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>React + Three.js</h3>
              <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Visualización 3D interactiva y curvas de nivel.</p>
            </div>
          </div>
          <p className={`text-sm mt-8 max-w-2xl mx-auto ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Los coeficientes A, B, C, D se extraen de una base de datos SQLite, actualizable con datos reales del IDEAM y la EPA Cartagena.
          </p>
        </div>
      </Section>

      <div className="py-16 flex justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={scrollToSimulation}
          className={`group relative px-8 py-4 rounded-full font-bold text-lg overflow-hidden transition-all ${isDarkMode ? 'bg-cyan-600/20 border border-cyan-500 text-cyan-400 hover:bg-cyan-600 hover:text-white' : 'bg-cyan-600/80 border border-cyan-600 text-white hover:bg-cyan-700'}`}
        >
          <span className="relative z-10 flex items-center gap-2">
            IR A SIMULACIÓN EN VIVO <ArrowRight className="w-5 h-5" />
          </span>
          <div className={`absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity ${isDarkMode ? '' : 'opacity-100'}`}></div>
        </motion.button>
      </div>
    </div>
  );
};

export default Documentation;