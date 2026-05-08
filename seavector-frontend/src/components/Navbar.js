import React from 'react';
import { motion } from 'framer-motion';

const Navbar = () => {
    return (
        <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex justify-between items-center p-8"
        >
            <div className="text-2xl font-bold text-cyan-400" style={{ textShadow: '0 0 10px #00B7FF' }}>
                SeaVector
            </div>
            <div className="flex space-x-6">
                <a href="#about" className="hover:text-cyan-400 transition-colors">About</a>
                <a href="#contact" className="hover:text-cyan-400 transition-colors">Contact</a>
            </div>
        </motion.nav>
    );
};

export default Navbar;