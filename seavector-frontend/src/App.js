import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Simulation3D from './components/Simulation3D';
import DataPanel from './components/DataPanel';
import Footer from './components/Footer';

const App = () => {
    const [year, setYear] = useState(2024);
    const [sector, setSector] = useState('Bocagrande');
    const [simulationData, setSimulationData] = useState(null);
    const [erosionRate, setErosionRate] = useState(0);
    const [gradient, setGradient] = useState([0, 0]);
    const [riskLevel, setRiskLevel] = useState(0);

    const fetchData = useCallback(async () => {
        try {
            // Replace with your actual API endpoint
            // const response = await axios.get(`http://localhost:8080/api/simulate?year=${year}&sector=${sector}`);
            // setSimulationData(response.data.surface);
            // setErosionRate(response.data.erosionRate);
            // setGradient(response.data.gradient);
            // setRiskLevel(response.data.riskLevel);

            // Mock data for demonstration
            const z = Array.from({ length: 50 }, () => Array.from({ length: 50 }, () => Math.random() * (year - 2023)));
            setSimulationData({
                x: Array.from({ length: 50 }, (_, i) => i),
                y: Array.from({ length: 50 }, (_, i) => i),
                z: z,
                type: 'surface',
                colorscale: 'YlGnBu'
            });
            setErosionRate(Math.random() * 5);
            setGradient([Math.random(), Math.random()]);
            setRiskLevel(Math.random() * 100);

        } catch (error) {
            console.error("Error fetching simulation data:", error);
        }
    }, [year, sector]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleYearChange = (newYear) => {
        setYear(newYear);
    };

    return (
        <div className="min-h-screen bg-ocean-deep text-white radial-gradient grid-pattern">
            <Navbar />
            <Hero />
            <main className="w-full max-w-7xl mx-auto mt-16 grid grid-cols-12 gap-8 px-4">
                <div className="col-span-12 lg:col-span-8">
                    <Simulation3D data={simulationData} />
                </div>
                <div className="col-span-12 lg:col-span-4">
                    <DataPanel
                        erosionRate={erosionRate}
                        gradient={gradient}
                        riskLevel={riskLevel}
                        year={year}
                        onYearChange={handleYearChange}
                    />
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default App;