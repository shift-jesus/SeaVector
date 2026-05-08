import React from 'react';
import { motion } from 'framer-motion';

const CurnLogo1 = () => (
    <svg width="100" height="30" viewBox="0 0 100 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <text x="10" y="20" fontFamily="Arial" fontSize="16" fill="white">CURN</text>
    </svg>
);

const CurnLogo2 = () => (
    <svg width="100" height="30" viewBox="0 0 100 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <text x="10" y="20" fontFamily="Arial" fontSize="16" fill="white">Logo</text>
    </svg>
);

const Footer = () => {
    return (
        <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.4 }}
            className="text-center p-8 mt-16"
        >
            <p>Grupo 4 - Jesus Campo</p>
            <div className="flex justify-center space-x-4 mt-2">
                <CurnLogo1 />
                <CurnLogo2 />
            </div>
        </motion.footer>
    );
};

export default Footer;