import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Simulation3D from './components/Simulation3D';
import Footer from './components/Footer';

const App = () => {
    const [year, setYear] = useState(2025);
    const [erosionRate, setErosionRate] = useState(4.62);
    const [gradient, setGradient] = useState([0.31, 0.10]);
    const [riskLevel, setRiskLevel] = useState(67);
    const [seaLevel, setSeaLevel] = useState(12.4);
    const [simulationData, setSimulationData] = useState(null);

    const fetchData = useCallback(async () => {
        // Datos simulados con tendencia realista
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

    const handleYearChange = (newYear) => {
        setYear(newYear);
    };

    const getRiskColor = () => {
        if (riskLevel < 40) return 'text-emerald-400';
        if (riskLevel < 70) return 'text-yellow-400';
        return 'text-red-500';
    };

    return (
        <div className="min-h-screen bg-gradient-deep text-white relative overflow-hidden">
            {/* Grid animado de fondo */}
            <div className="fixed inset-0 grid-pattern opacity-40 pointer-events-none"></div>

            {/* Partículas flotantes */}
            <div className="fixed inset-0 pointer-events-none">
                {[...Array(30)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-0.5 h-0.5 bg-cyan-400 rounded-full animate-pulse"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            opacity: 0.2 + Math.random() * 0.5
                        }}
                    />
                ))}
            </div>

            <Navbar />

            {/* Hero Section Impactante */}
            <section className="relative pt-24 pb-12 px-4 max-w-7xl mx-auto">
                <div className="text-center mb-12 animate-fadeUp">
                    <div className="inline-block mb-4 px-4 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 backdrop-blur-sm">
                        <span className="text-cyan-400 text-sm font-mono tracking-wider">◉ LIVE COASTAL SIMULATION</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-white via-cyan-300 to-blue-500 bg-clip-text text-transparent">
                        SeaVector 2050
                    </h1>
                    <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                        Modelado predictivo de erosión costera en Cartagena con procesamiento de derivadas parciales en tiempo real
                    </p>
                </div>
            </section>

            {/* Simulación Principal + Paneles */}
            <main className="w-full max-w-7xl mx-auto px-4 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Panel 3D - columna grande - AHORA CON EL COMPONENTE REAL */}
                    <div className="lg:col-span-8">
                        <Simulation3D data={simulationData} year={year} />
                    </div>

                    {/* Panel de Datos - columna pequeña */}
                    <div className="lg:col-span-4 space-y-5">
                        {/* Tarjeta de erosión */}
                        <div className="glass-premium p-6">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-gray-400 text-sm uppercase tracking-wider">Erosion Rate</span>
                                <span className="text-cyan-400 text-xs font-mono">cm/year</span>
                            </div>
                            <div className="text-5xl font-bold text-white mb-2">{erosionRate}<span className="text-2xl text-gray-400"> cm/año</span></div>
                            <div className="w-full bg-gray-700/50 rounded-full h-1.5 mt-3">
                                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-1.5 rounded-full" style={{ width: `${Math.min(100, (erosionRate / 8) * 100)}` }}></div>
                            </div>
                            <div className="text-gray-400 text-xs mt-3 font-mono">△ +{((erosionRate - 4.2)/4.2*100).toFixed(0)}% desde 2024</div>
                        </div>

                        {/* Vector Gradiente */}
                        <div className="glass-premium p-6">
                            <div className="text-gray-400 text-sm uppercase tracking-wider mb-3">Vector Gradient</div>
                            <div className="flex items-baseline gap-4">
                                <div>
                                    <span className="text-cyan-400 text-3xl font-bold">{gradient[0]}</span>
                                    <span className="text-gray-400 ml-1">∂/∂x</span>
                                </div>
                                <span className="text-gray-500 text-xl">+</span>
                                <div>
                                    <span className="text-cyan-400 text-3xl font-bold">{gradient[1]}</span>
                                    <span className="text-gray-400 ml-1">∂/∂y</span>
                                </div>
                            </div>
                            <div className="mt-3 text-xs text-gray-400 font-mono">∇f = ({gradient[0]}, {gradient[1]}) • dirección máximo incremento</div>
                        </div>

                        {/* Nivel de riesgo */}
                        <div className="glass-premium p-6">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-gray-400 text-sm uppercase tracking-wider">Risk Level</span>
                                <span className={`text-xl font-bold ${getRiskColor()}`}>{riskLevel}%</span>
                            </div>
                            <div className="w-full bg-gray-700/50 rounded-full h-2">
                                <div className={`h-2 rounded-full transition-all duration-500 ${riskLevel < 40 ? 'bg-emerald-500' : riskLevel < 70 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${riskLevel}%` }}></div>
                            </div>
                            <div className="mt-3 text-xs text-gray-400 font-mono">Umbral crítico: 75%</div>
                        </div>

                        {/* Nivel del mar */}
                        <div className="glass-premium p-6">
                            <div className="text-gray-400 text-sm uppercase tracking-wider mb-3">Sea Level Rise</div>
                            <div className="text-4xl font-bold text-blue-300">{seaLevel}<span className="text-lg text-gray-400"> cm</span></div>
                            <div className="mt-2 text-xs text-gray-400 font-mono">Modelo RCP 4.5 • IPCC 2026</div>
                        </div>

                        {/* Control de tiempo futurista */}
                        <div className="glass-premium p-6">
                            <div className="flex justify-between mb-4">
                                <span className="text-gray-400 text-sm uppercase tracking-wider">Time Control</span>
                                <span className="text-cyan-400 text-xl font-bold">{year}</span>
                            </div>
                            <input
                                type="range"
                                min="2024"
                                max="2050"
                                step="1"
                                value={year}
                                onChange={(e) => handleYearChange(parseInt(e.target.value))}
                                className="w-full"
                            />
                            <div className="flex justify-between mt-2 text-xs text-gray-500">
                                <span>2024</span>
                                <span>2030</span>
                                <span>2040</span>
                                <span>2050</span>
                            </div>
                            <button
                                onClick={() => handleYearChange(2050)}
                                className="btn-scifi w-full mt-5 text-sm"
                            >
                                PROJECT TO 2050 →
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default App;