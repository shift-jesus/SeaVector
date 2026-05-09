import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { motion } from 'framer-motion';

const Simulation3D = ({ data, year }) => {
    const containerRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const controlsRef = useRef(null);
    const surfaceMeshRef = useRef(null);
    const waterPlaneRef = useRef(null);
    const arrowsGroupRef = useRef(null);
    const raycasterRef = useRef(new THREE.Raycaster());
    const mouseRef = useRef(new THREE.Vector2());

    const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, elevation: 0, angle: 0, floodProb: 0 });
    const [logs, setLogs] = useState([
        "Sistema inicializado. Cargando modelo de elevación...",
        "Renderizado de superficie activado."
    ]);

    const addLog = (message) => {
        setLogs(prev => [...prev.slice(-5), `> ${message}`]);
    };

    // Generar datos de superficie según el año (erosión progresiva)
    const generateSurfaceData = useCallback((currentYear) => {
        const width = 100;
        const height = 100;
        const vertices = [];
        const indices = [];
        const normals = [];
        const colors = [];

        const t = (currentYear - 2024) / 26; // 0 a 1 entre 2024 y 2050
        const erosionFactor = t * 1.5; // máx -1.5m de altura

        for (let i = 0; i <= width; i++) {
            for (let j = 0; j <= height; j++) {
                const x = (i / width) * 40 - 20; // rango -20 a 20
                const z = (j / height) * 40 - 20;
                // Altura base: playa con pendiente suave hacia el mar (z negativo = mar)
                let y = Math.sin(x * 0.3) * Math.cos(z * 0.3) * 0.5 + 1.2;
                // Añadir duna central
                y += Math.exp(-((x) ** 2 + (z + 5) ** 2) / 200) * 0.8;
                // Reducir altura por erosión
                y = Math.max(-0.5, y - erosionFactor * (1 + 0.5 * Math.sin(x * 0.5)));
                vertices.push(x, y, z);

                // Color basado en pendiente (gradiente)
                // Simulamos pendiente derivando aproximada
                const nx = (Math.cos(x * 0.3) * 0.3 * Math.cos(z * 0.3) * 0.5);
                const nz = (Math.sin(x * 0.3) * -Math.sin(z * 0.3) * 0.5);
                const slope = Math.sqrt(nx*nx + nz*nz);
                const isSteep = slope > 0.6;
                const color = isSteep ? new THREE.Color(0xef4444) : new THREE.Color(0xfde68a);
                colors.push(color.r, color.g, color.b);

                // Normales (simplificado)
                normals.push(0, 1, 0);
            }
        }

        // Generar índices para los triángulos
        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                const a = i * (height + 1) + j;
                const b = i * (height + 1) + j + 1;
                const c = (i + 1) * (height + 1) + j;
                const d = (i + 1) * (height + 1) + j + 1;
                indices.push(a, b, c);
                indices.push(b, d, c);
            }
        }

        return { vertices, indices, normals, colors, width, height };
    }, []);

    // Actualizar geometría y vectores gradiente según año
    const updateSimulation = useCallback((currentYear) => {
        if (!surfaceMeshRef.current) return;

        addLog(`Calculando derivadas parciales para t=${currentYear}...`);
        const { vertices, indices, normals, colors, width, height } = generateSurfaceData(currentYear);

        // Actualizar geometría
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));
        geometry.setIndex(indices);
        geometry.computeVertexNormals();

        surfaceMeshRef.current.geometry.dispose();
        surfaceMeshRef.current.geometry = geometry;

        // Calcular vectores gradiente (simulados) y dibujar flechas
        addLog("Generando campo vectorial de gradientes...");
        if (arrowsGroupRef.current) {
            while(arrowsGroupRef.current.children.length > 0) {
                arrowsGroupRef.current.remove(arrowsGroupRef.current.children[0]);
            }
        }

        // Crear flechas en puntos de la cuadrícula (cada 5 unidades)
        const step = 5;
        for (let x = -18; x <= 18; x += step) {
            for (let z = -18; z <= 18; z += step) {
                // Obtener altura aproximada
                let y = Math.sin(x * 0.3) * Math.cos(z * 0.3) * 0.5 + 1.2;
                y += Math.exp(-((x) ** 2 + (z + 5) ** 2) / 200) * 0.8;
                const t = (currentYear - 2024) / 26;
                const erosionFactor = t * 1.5;
                y = Math.max(-0.5, y - erosionFactor * (1 + 0.5 * Math.sin(x * 0.5)));

                // Dirección del gradiente (simulado: apunta hacia el mar, que es -z y -x según ubicación)
                const gradX = -Math.sign(x) * 0.6;
                const gradZ = -0.8;
                const length = Math.sqrt(gradX*gradX + gradZ*gradZ);
                // Normalizar y escalar
                const dirX = gradX / length;
                const dirZ = gradZ / length;
                const arrowLength = 0.8;
                const origin = new THREE.Vector3(x, y + 0.2, z);
                const direction = new THREE.Vector3(dirX, 0, dirZ).normalize();
                const arrowColor = 0x00ffff;

                const arrowHelper = new THREE.ArrowHelper(direction, origin, arrowLength, arrowColor, 0.4, 0.3);
                arrowsGroupRef.current.add(arrowHelper);
            }
        }
        addLog("Simulación de retroceso de costa completada.");
    }, [generateSurfaceData]);

    // Inicialización de la escena Three.js
    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;

        // Escena
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x010510);
        scene.fog = new THREE.FogExp2(0x010510, 0.008);
        sceneRef.current = scene;

        // Cámara
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.set(25, 15, 25);
        camera.lookAt(0, 0, 0);
        cameraRef.current = camera;

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        renderer.shadowMap.enabled = true;
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Controles
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.autoRotate = false;
        controls.enableZoom = true;
        controls.zoomSpeed = 1.2;
        controls.rotateSpeed = 1.0;
        controls.target.set(0, 1, 0);
        controlsRef.current = controls;

        // Luces
        const ambientLight = new THREE.AmbientLight(0x404060);
        scene.add(ambientLight);
        const dirLight = new THREE.DirectionalLight(0xffffff, 1);
        dirLight.position.set(10, 20, 5);
        dirLight.castShadow = true;
        dirLight.receiveShadow = false;
        scene.add(dirLight);
        const backLight = new THREE.PointLight(0x3366ff, 0.3);
        backLight.position.set(-5, 5, -10);
        scene.add(backLight);

        // Malla de superficie
        const geometry = new THREE.BufferGeometry();
        const material = new THREE.MeshStandardMaterial({
            vertexColors: true,
            side: THREE.DoubleSide,
            roughness: 0.6,
            metalness: 0.2,
            emissive: 0x000000,
            flatShading: false
        });
        const surfaceMesh = new THREE.Mesh(geometry, material);
        surfaceMesh.castShadow = true;
        surfaceMesh.receiveShadow = false;
        scene.add(surfaceMesh);
        surfaceMeshRef.current = surfaceMesh;

        // Plano de agua (semitransparente en Z=0)
        const waterGeometry = new THREE.PlaneGeometry(45, 45);
        const waterMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a6eff,
            emissive: 0x004466,
            transparent: true,
            opacity: 0.65,
            side: THREE.DoubleSide
        });
        const waterPlane = new THREE.Mesh(waterGeometry, waterMaterial);
        waterPlane.rotation.x = -Math.PI / 2;
        waterPlane.position.y = 0;
        waterPlane.receiveShadow = false;
        scene.add(waterPlane);
        waterPlaneRef.current = waterPlane;

        // Grupo para flechas
        const arrowsGroup = new THREE.Group();
        scene.add(arrowsGroup);
        arrowsGroupRef.current = arrowsGroup;

        // Grid auxiliar (opcional, estético)
        const gridHelper = new THREE.GridHelper(60, 20, 0x00aaff, 0x336699);
        gridHelper.position.y = -0.8;
        gridHelper.material.transparent = true;
        gridHelper.material.opacity = 0.25;
        scene.add(gridHelper);

        // Animación
        let animationId;
        const animate = () => {
            animationId = requestAnimationFrame(animate);
            controls.update(); // solo si enabled
            renderer.render(scene, camera);
        };
        animate();

        // Manejador de resize
        const handleResize = () => {
            const newWidth = container.clientWidth;
            const newHeight = container.clientHeight;
            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(newWidth, newHeight);
        };
        window.addEventListener('resize', handleResize);

        // Raycaster para tooltip
        const onMouseMove = (event) => {
            const rect = renderer.domElement.getBoundingClientRect();
            const mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            const mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            mouseRef.current.set(mouseX, mouseY);

            raycasterRef.current.setFromCamera(mouseRef.current, camera);
            const intersects = raycasterRef.current.intersectObject(surfaceMesh);
            if (intersects.length > 0) {
                const point = intersects[0].point;
                const elevation = point.y.toFixed(2);
                // Calcular ángulo del gradiente y probabilidad de inundación
                const gradAngle = Math.atan2(
                    Math.sin(point.x * 0.5) * 0.5,
                    Math.cos(point.z * 0.5) * 0.5
                ) * (180 / Math.PI);
                const floodProb = Math.min(100, Math.max(0, Math.floor((1 - (elevation + 0.5) / 2) * 100)));
                setTooltip({
                    visible: true,
                    x: event.clientX + 15,
                    y: event.clientY - 30,
                    elevation,
                    angle: Math.abs(gradAngle).toFixed(0),
                    floodProb
                });
            } else {
                setTooltip(prev => ({ ...prev, visible: false }));
            }
        };

        renderer.domElement.style.cursor = 'crosshair';
        renderer.domElement.addEventListener('mousemove', onMouseMove);

        // Limpieza
        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', handleResize);
            renderer.domElement.removeEventListener('mousemove', onMouseMove);
            if (renderer.domElement && renderer.domElement.parentNode) {
                renderer.domElement.parentNode.removeChild(renderer.domElement);
            }
            if (controlsRef.current) controlsRef.current.dispose();
            scene.clear();
        };
    }, []);

    // Actualizar cuando cambia el año
    useEffect(() => {
        if (surfaceMeshRef.current && year) {
            updateSimulation(year);
        }
    }, [year, updateSimulation]);

    return (
        <div className="relative w-full h-[600px] rounded-2xl overflow-hidden border border-cyan-500/30">
            <div ref={containerRef} className="w-full h-full" />

            {/* Tooltip flotante */}
            {tooltip.visible && (
                <div
                    className="fixed z-50 bg-black/80 backdrop-blur-md border border-cyan-500 rounded-lg px-4 py-2 text-xs font-mono text-white shadow-lg pointer-events-none"
                    style={{ left: tooltip.x, top: tooltip.y }}
                >
                    <div>Elevación Actual: {tooltip.elevation} m</div>
                    <div>Dirección de Erosión: {tooltip.angle}°</div>
                    <div>Probabilidad de Inundación: {tooltip.floodProb}%</div>
                </div>
            )}

            {/* Panel de Status estilo consola */}
            <div className="absolute bottom-4 left-4 right-4 md:right-auto md:w-80 bg-black/70 backdrop-blur-md border border-cyan-500/40 rounded-lg p-3 font-mono text-xs text-cyan-300 shadow-xl">
                <div className="flex items-center gap-2 mb-2 border-b border-cyan-500/30 pb-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    <span className="tracking-wider">STATUS DE RED • CONSOLA</span>
                </div>
                <div className="space-y-1 max-h-32 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-cyan-500">
                    {logs.map((log, idx) => (
                        <div key={idx} className="opacity-80">{log}</div>
                    ))}
                </div>
            </div>

            {/* Leyenda de colores */}
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2 text-xs border border-white/20">
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-amber-300 rounded"></div><span>Arena estable</span></div>
                <div className="flex items-center gap-2 mt-1"><div className="w-3 h-3 bg-red-500 rounded"></div><span>Riesgo de derrumbe</span></div>
                <div className="flex items-center gap-2 mt-1"><div className="w-3 h-3 bg-cyan-400 rounded"></div><span>Vector gradiente</span></div>
            </div>
        </div>
    );
};

export default Simulation3D;