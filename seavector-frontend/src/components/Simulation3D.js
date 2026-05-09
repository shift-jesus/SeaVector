import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const Simulation3D = ({ data, year }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Crear mapa de calor de erosión
        const width = canvas.width = canvas.clientWidth;
        const height = canvas.height = canvas.clientHeight;

        let animationId;

        const draw3DSimulation = () => {
            ctx.clearRect(0, 0, width, height);

            // Fondo negro mate
            ctx.fillStyle = '#05080f';
            ctx.fillRect(0, 0, width, height);

            // Dibujar grid futurista
            ctx.strokeStyle = 'rgba(0, 255, 255, 0.15)';
            ctx.lineWidth = 1;

            const gridSize = 40;
            for (let x = 0; x < width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }
            for (let y = 0; y < height; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }

            // Simular superficie costera con olas dinámicas
            const time = Date.now() * 0.002;
            const erosionFactor = (year - 2024) / 26; // 0 a 1 entre 2024 y 2050

            for (let i = 0; i < 200; i++) {
                const x = Math.random() * width;
                const y = Math.random() * height;
                const distanceToCenter = Math.abs(y - height * 0.7) / height;
                const intensity = Math.sin(x * 0.02 + time) * Math.cos(y * 0.02 + time * 0.5);
                const erosion = distanceToCenter * erosionFactor * 1.5;

                const r = Math.floor(50 + intensity * 100 + erosion * 80);
                const g = Math.floor(100 + intensity * 80 + erosion * 40);
                const b = Math.floor(200 + intensity * 55);

                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.6)`;
                ctx.fillRect(x, y, 3, 3);
            }

            // Dibujar líneas de nivel (topografía)
            for (let level = 0; level < 6; level++) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(0, 255, 255, ${0.1 + level * 0.05})`;
                ctx.lineWidth = 1.5;

                for (let x = 0; x < width; x += 8) {
                    const y = height * 0.5 + Math.sin(x * 0.02 + time) * 30 + (level * 25) + (erosionFactor * 80);
                    if (x === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
            }

            // Flechas de vector gradiente
            const gradientX = 0.31 * width;
            const gradientY = 0.1 * height + erosionFactor * 60;

            ctx.beginPath();
            ctx.moveTo(width * 0.6, height * 0.3);
            ctx.lineTo(width * 0.6 + gradientX, height * 0.3 + gradientY);
            ctx.strokeStyle = '#0ff';
            ctx.lineWidth = 3;
            ctx.stroke();

            // Punta de flecha
            const angle = Math.atan2(gradientY, gradientX);
            const arrowX = width * 0.6 + gradientX;
            const arrowY = height * 0.3 + gradientY;
            ctx.beginPath();
            ctx.moveTo(arrowX, arrowY);
            ctx.lineTo(arrowX - 10 * Math.cos(angle - 0.5), arrowY - 10 * Math.sin(angle - 0.5));
            ctx.lineTo(arrowX - 10 * Math.cos(angle + 0.5), arrowY - 10 * Math.sin(angle + 0.5));
            ctx.fillStyle = '#0ff';
            ctx.fill();

            // Efecto holográfico overlay
            const grad = ctx.createLinearGradient(0, 0, width, height);
            grad.addColorStop(0, 'rgba(0, 255, 255, 0.05)');
            grad.addColorStop(1, 'rgba(0, 50, 150, 0.1)');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, width, height);

            animationId = requestAnimationFrame(draw3DSimulation);
        };

        draw3DSimulation();

        return () => {
            if (animationId) cancelAnimationFrame(animationId);
        };
    }, [year, data]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="glass-premium w-full h-[520px] relative overflow-hidden group"
        >
            <canvas
                ref={canvasRef}
                className="w-full h-full rounded-[28px]"
                style={{ display: 'block' }}
            />

            {/* Overlay de información holográfica */}
            <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md rounded-xl px-3 py-1.5 border border-cyan-500/30">
                <span className="text-cyan-400 text-xs font-mono">LIVE SIMULATION • GRADIENT VECTORS ACTIVE</span>
            </div>

            <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md rounded-xl px-3 py-1.5 border border-white/20">
                <span className="text-white/80 text-xs font-mono">YEAR: {year}</span>
            </div>
        </motion.div>
    );
};

export default Simulation3D;