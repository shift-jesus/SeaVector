import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Waves, Ruler, Clock, TrendingUp, ArrowRight, ChevronDown, Globe, Zap } from 'lucide-react';
import Navbar from './components/Navbar';
import Simulation3D from './components/Simulation3D';
import Footer from './components/Footer';

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

    // Referencia para scroll suave
    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
    };

    // Datos de simulación (igual que antes)
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

    // Animación de línea de costa (canvas)
    const CoastlineAnimation = () => {
        const canvasRef = useRef(null);
        useEffect(() => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            let animationId;
            let offset = 0;
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;
            canvas.width = width;
            canvas.height = height;

            const draw = () => {
                ctx.clearRect(0, 0, width, height);
                // Fondo oscuro con mapa sutil (gradiente)
                const grad = ctx.createLinearGradient(0, 0, width, 0);
                grad.addColorStop(0, '#0a1128');
                grad.addColorStop(1, '#01050c');
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, width, height);

                // Línea de costa inicial (blanca)
                ctx.beginPath();
                ctx.strokeStyle = 'rgba(255,255,255,0.8)';
                ctx.lineWidth = 3;
                for (let x = 0; x < width; x += 10) {
                    const y = height * 0.5 + Math.sin(x * 0.02) * 40;
                    if (x === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();

                // Línea de costa que retrocede (efecto animado)
                const retreat = Math.sin(Date.now() * 0.001) * 8 + 15; // Retroceso oscilante
                ctx.beginPath();
                ctx.strokeStyle = 'rgba(0, 255, 255, 0.9)';
                ctx.lineWidth = 2;
                for (let x = 0; x < width; x += 10) {
                    const y = height * 0.5 + Math.sin(x * 0.02) * 40 + retreat;
                    if (x === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();

                // Flecha indicadora
                ctx.fillStyle = '#0ff';
                ctx.font = 'bold 14px "Space Grotesk"';
                ctx.fillText('← Retroceso de la costa', width - 150, height * 0.5 + retreat - 10);

                animationId = requestAnimationFrame(draw);
            };
            draw();
            return () => cancelAnimationFrame(animationId);
        }, []);
        return <canvas ref={canvasRef} className="w-full h-64 rounded-2xl border border-cyan-500/30" />;
    };

    return (
        <div className="min-h-screen bg-gradient-deep text-white relative overflow-x-hidden">
            {/* Fondo grid y partículas (igual que antes) */}
            <div className="fixed inset-0 grid-pattern opacity-40 pointer-events-none"></div>
            <div className="fixed inset-0 pointer-events-none">
                {[...Array(40)].map((_, i) => (
                    <div key={i} className="absolute w-0.5 h-0.5 bg-cyan-400 rounded-full animate-pulse" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 5}s`, opacity: 0.2 + Math.random() * 0.5 }} />
                ))}
            </div>

            <Navbar />

            {/* SECCIÓN 1: HERO con botón explorar */}
            <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-4 pt-20">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                    <div className="inline-block mb-4 px-4 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 backdrop-blur-sm">
                        <span className="text-cyan-400 text-sm font-mono tracking-wider">◉ LIVE COASTAL SIMULATION</span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-cyan-300 to-blue-500 bg-clip-text text-transparent">
                        SeaVector 2050
                    </h1>
                    <p className="text-gray-300 text-xl max-w-2xl mx-auto mb-10">
                        Modelado predictivo de erosión costera en Cartagena con procesamiento de derivadas parciales en tiempo real.
                    </p>
                    <button onClick={() => scrollToSection('amenaza')} className="btn-scifi text-lg px-8 py-4 flex items-center gap-2 mx-auto">
                        Explorar el Fenómeno <ArrowRight className="w-5 h-5" />
                    </button>
                </motion.div>
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer" onClick={() => scrollToSection('amenaza')}>
                    <ChevronDown className="text-cyan-400 w-8 h-8" />
                </div>
            </section>

            {/* SECCIÓN 2: ¿Qué es la Erosión Costera? */}
            <Section id="amenaza" className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <Waves className="text-cyan-400 w-8 h-8" />
                            <h2 className="text-4xl font-bold">La Amenaza Silenciosa</h2>
                        </div>
                        <p className="text-gray-300 text-lg leading-relaxed mb-4">
                            La <span className="text-cyan-400 font-semibold">erosión costera</span> es el proceso de degradación y retroceso de la línea de costa debido a la energía de las olas, corrientes marinas y el aumento del nivel del mar.
                        </p>
                        <p className="text-gray-400">
                            En Cartagena, este fenómeno avanza a un ritmo acelerado, amenazando infraestructuras, ecosistemas y comunidades enteras. Para 2050, se estima una pérdida de hasta <span className="text-cyan-400">8 metros de playa</span> en sectores críticos como Bocagrande.
                        </p>
                    </div>
                    <div className="glass-premium p-4">
                        <CoastlineAnimation />
                        <p className="text-center text-xs text-gray-400 mt-3">Simulación del retroceso de la línea costera (azul: proyección futura)</p>
                    </div>
                </div>
            </Section>

            {/* SECCIÓN 3: El Motor Matemático - Gradiente */}
            <Section id="gradiente" className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold mb-3">El Motor Matemático</h2>
                    <p className="text-gray-400 text-xl">No solo observamos, <span className="text-cyan-400">calculamos</span>.</p>
                </div>
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Zap className="text-cyan-400" />
                            <h3 className="text-2xl font-semibold">Vector Gradiente ∇E</h3>
                        </div>
                        <p className="text-gray-300">
                            El gradiente es la herramienta que nos indica la <span className="text-cyan-400">dirección de máxima pérdida de terreno</span>. Si la superficie de la playa es <span className="font-mono text-cyan-400">E(x,y)</span>, el gradiente apunta hacia donde el terreno sube más rápido; por ende, su inverso nos dice hacia dónde "cae" la playa ante el mar.
                        </p>
                        <div className="bg-black/50 p-4 rounded-xl border border-cyan-500/30 font-mono text-center text-xl neon-glow">
                            ∇E = ∂E/∂x <span className="text-cyan-400">î</span> + ∂E/∂y <span className="text-cyan-400">ĵ</span>
                        </div>
                        <p className="text-gray-400 text-sm">Cada vector gradiente calculado en tiempo real alimenta nuestra simulación 3D.</p>
                    </div>
                    <div className="glass-premium p-6 flex justify-center">
                        <div className="text-center">
                            <div className="text-6xl mb-4">📐</div>
                            <p className="text-cyan-400 font-mono">|∇E| = {gradient[0].toFixed(2)} i + {gradient[1].toFixed(2)} j</p>
                            <p className="text-gray-400 text-sm mt-2">Magnitud del gradiente en {year}</p>
                        </div>
                    </div>
                </div>
            </Section>

            {/* SECCIÓN 4: Variables Críticas (x, y, t) */}
            <Section id="variables" className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold mb-3">Variables Críticas</h2>
                    <p className="text-gray-400">Un modelo multivariable para un fenómeno complejo</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="glass-premium p-6 text-center">
                        <Globe className="text-cyan-400 w-10 h-10 mx-auto mb-3" />
                        <h3 className="text-xl font-bold mb-2">Coordenadas (x, y)</h3>
                        <p className="text-gray-400">Posición geográfica en la costa de Cartagena, desde Bocagrande hasta La Boquilla.</p>
                    </div>
                    <div className="glass-premium p-6 text-center">
                        <Clock className="text-cyan-400 w-10 h-10 mx-auto mb-3" />
                        <h3 className="text-xl font-bold mb-2">Tiempo (t)</h3>
                        <p className="text-gray-400">Proyección hasta 2050 con modelos IPCC RCP 4.5. Cada año modifica la tasa de erosión.</p>
                    </div>
                    <div className="glass-premium p-6 text-center">
                        <TrendingUp className="text-cyan-400 w-10 h-10 mx-auto mb-3" />
                        <h3 className="text-xl font-bold mb-2">Diferencial Total</h3>
                        <p className="text-gray-400 font-mono text-sm">dE = (∂E/∂x)dx + (∂E/∂y)dy + (∂E/∂t)dt</p>
                        <p className="text-gray-400 text-xs mt-2">Pequeños cambios en el nivel del mar o el tiempo impactan la elevación total de nuestras playas.</p>
                    </div>
                </div>
            </Section>

            {/* SECCIÓN 5: Centro de Comando (Dashboard 3D) */}
            <Section id="comando" className="max-w-7xl mx-auto">
                <div className="text-center mb-8">
                    <div className="inline-block px-4 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/50 backdrop-blur-sm mb-4">
                        <span className="text-cyan-300 font-mono text-sm">◉ SISTEMA DE SIMULACIÓN VECTORIAL ACTIVADO</span>
                    </div>
                    <h2 className="text-4xl font-bold">Centro de Comando</h2>
                    <p className="text-gray-400 mt-2">Interactúa con la simulación en tiempo real. Mueve el control temporal y observa el avance del mar.</p>
                </div>

                {/* Aquí va el dashboard completo que ya tenías */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-8">
                        <Simulation3D data={simulationData} year={year} />
                    </div>
                    <div className="lg:col-span-4 space-y-5">
                        <div className="glass-premium p-6">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-gray-400 text-sm uppercase tracking-wider">Erosion Rate</span>
                                <span className="text-cyan-400 text-xs font-mono">cm/year</span>
                            </div>
                            <div className="text-5xl font-bold text-white mb-2">{erosionRate}<span className="text-2xl text-gray-400"> cm/año</span></div>
                            <div className="w-full bg-gray-700/50 rounded-full h-1.5 mt-3">
                                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-1.5 rounded-full" style={{ width: `${Math.min(100, (erosionRate / 8) * 100)}` }}></div>
                            </div>
                        </div>
                        <div className="glass-premium p-6">
                            <div className="text-gray-400 text-sm uppercase tracking-wider mb-3">Vector Gradient</div>
                            <div className="flex items-baseline gap-4">
                                <div><span className="text-cyan-400 text-3xl font-bold">{gradient[0]}</span><span className="text-gray-400 ml-1">∂/∂x</span></div>
                                <span className="text-gray-500 text-xl">+</span>
                                <div><span className="text-cyan-400 text-3xl font-bold">{gradient[1]}</span><span className="text-gray-400 ml-1">∂/∂y</span></div>
                            </div>
                            <div className="mt-3 text-xs text-gray-400 font-mono">∇f = ({gradient[0]}, {gradient[1]}) • dirección máximo incremento</div>
                        </div>
                        <div className="glass-premium p-6">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-gray-400 text-sm uppercase tracking-wider">Risk Level</span>
                                <span className={`text-xl font-bold ${getRiskColor()}`}>{riskLevel}%</span>
                            </div>
                            <div className="w-full bg-gray-700/50 rounded-full h-2">
                                <div className={`h-2 rounded-full ${riskLevel < 40 ? 'bg-emerald-500' : riskLevel < 70 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${riskLevel}%` }}></div>
                            </div>
                        </div>
                        <div className="glass-premium p-6">
                            <div className="text-gray-400 text-sm uppercase tracking-wider mb-3">Sea Level Rise</div>
                            <div className="text-4xl font-bold text-blue-300">{seaLevel}<span className="text-lg text-gray-400"> cm</span></div>
                        </div>
                        <div className="glass-premium p-6">
                            <div className="flex justify-between mb-4">
                                <span className="text-gray-400 text-sm uppercase tracking-wider">Time Control</span>
                                <span className="text-cyan-400 text-xl font-bold">{year}</span>
                            </div>
                            <input type="range" min="2024" max="2050" step="1" value={year} onChange={(e) => handleYearChange(parseInt(e.target.value))} className="w-full" />
                            <div className="flex justify-between mt-2 text-xs text-gray-500">
                                <span>2024</span><span>2030</span><span>2040</span><span>2050</span>
                            </div>
                            <button onClick={() => handleYearChange(2050)} className="btn-scifi w-full mt-5 text-sm">PROJECT TO 2050 →</button>
                        </div>
                    </div>
                </div>
            </Section>

            <Footer />
        </div>
    );
};

export default App;