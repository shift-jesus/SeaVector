import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
    const scrollToSimulation = () => {
        const simulationSection = document.querySelector('main');
        simulationSection.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <header className="flex flex-col items-center justify-center text-center px-4 py-16">
            <motion.h1
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-white"
            >
                Coastal Erosion Simulation
            </motion.h1>
            <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                onClick={scrollToSimulation}
                className="relative mt-8 px-8 py-3 bg-cyan-500 text-black font-bold rounded-full overflow-hidden"
            >
                <span className="relative z-10">Launch Simulation</span>
                <span className="scan-effect"></span>
            </motion.button>
        </header>
    );
};

export default Hero;