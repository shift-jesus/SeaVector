import React from 'react';
import Plot from 'react-plotly.js';
import { motion } from 'framer-motion';

const Simulation3D = ({ data }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="h-[600px] bg-black bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-lg border border-white/10"
        >
            {data && (
                <Plot
                    data={[data]}
                    layout={{
                        title: 'Erosion Surface',
                        autosize: true,
                        scene: {
                            xaxis: { title: 'X (Longitude)' },
                            yaxis: { title: 'Y (Latitude)' },
                            zaxis: { title: 'Z (Elevation)' },
                        },
                        paper_bgcolor: 'rgba(0,0,0,0)',
                        plot_bgcolor: 'rgba(0,0,0,0)',
                        font: {
                            color: 'white'
                        }
                    }}
                    style={{ width: '100%', height: '100%' }}
                    useResizeHandler={true}
                />
            )}
        </motion.div>
    );
};

export default Simulation3D;