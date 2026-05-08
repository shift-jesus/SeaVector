import React from 'react';
import { motion } from 'framer-motion';
import { Thermometer, Wind, AlertTriangle } from 'lucide-react';

const DataPanel = ({ erosionRate, gradient, riskLevel, year, onYearChange }) => {
    const getErosionColor = () => {
        if (erosionRate > 4) return 'text-red-500';
        if (erosionRate > 2) return 'text-yellow-500';
        return 'text-green-500';
    };

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="bg-black bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-lg border border-white/10 p-4"
            >
                <h3 className="font-mono text-lg text-cyan-400 flex items-center"><Thermometer className="mr-2" />Erosion Rate</h3>
                <p className={`font-mono text-3xl ${getErosionColor()}`}>{erosionRate.toFixed(2)} cm/year</p>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="bg-black bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-lg border border-white/10 p-4"
            >
                <h3 className="font-mono text-lg text-cyan-400 flex items-center"><Wind className="mr-2" />Vector Gradient</h3>
                <p className="font-mono text-xl">[{gradient[0].toFixed(2)}, {gradient[1].toFixed(2)}]</p>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="bg-black bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-lg border border-white/10 p-4"
            >
                <h3 className="font-mono text-lg text-cyan-400 flex items-center"><AlertTriangle className="mr-2" />Risk Level</h3>
                <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
                    <div className="bg-cyan-400 h-2.5 rounded-full" style={{ width: `${riskLevel}%` }}></div>
                </div>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1.4 }}
                className="bg-black bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-lg border border-white/10 p-4"
            >
                <h3 className="font-mono text-lg text-cyan-400">Time Control</h3>
                <input
                    type="range"
                    min="2024"
                    max="2050"
                    value={year}
                    onChange={(e) => onYearChange(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-center font-mono mt-2">{year}</p>
            </motion.div>
        </div>
    );
};

export default DataPanel;