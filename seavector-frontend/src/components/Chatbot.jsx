import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Copy } from 'lucide-react';

const Chatbot = ({ isOpen, onClose, isDarkMode, onNotify }) => {
    const [messages, setMessages] = useState([
        { text: "¡Hola! Haz clic en cualquier pregunta para obtener información:", sender: "bot" }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const questions = [
        { id: 1, text: "🌊 ¿Qué es la erosión costera?", answer: "La erosión costera es el proceso de degradación y retroceso de la línea de costa debido a la energía de las olas, corrientes marinas y el aumento del nivel del mar. En Cartagena, avanzamos a 4-5 cm/año, afectando playas como Bocagrande y Castillogrande." },
        { id: 2, text: "📐 ¿Cómo funciona el Vector Gradiente?", answer: "El vector gradiente ∇E nos indica la dirección de máxima pérdida de terreno. Se calcula con derivadas parciales ∂E/∂x y ∂E/∂y. Fórmula: ∇E = ∂E/∂x î + ∂E/∂y ĵ. Indica hacia dónde el terreno sube más rápido; su inverso señala la dirección de pérdida." },
        { id: 3, text: "📅 ¿Qué proyecciones hay para 2050?", answer: "Para 2050, proyectamos una pérdida de hasta 8 metros de playa en Bocagrande según el modelo RCP 4.5 del IPCC. La tasa de erosión aumentará de 4.2 cm/año (2024) a aproximadamente 8.5 cm/año en 2050." },
        { id: 4, text: "💻 ¿Qué tecnología usa SeaVector?", answer: "SeaVector usa: Backend con Java Spring Boot 3.4.4 y SQLite, Frontend con React 18 y Three.js para simulación 3D, y API REST. Todo el código está disponible en GitHub." },
        { id: 5, text: "🏖️ ¿Qué sectores de Cartagena se analizan?", answer: "Analizamos 5 sectores críticos: Bocagrande (-0.012), Castillogrande (-0.010), El Laguito (-0.014), La Boquilla (-0.008) y Marbella (-0.011). Cada uno con coeficientes específicos." }
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleQuestionClick = (question) => {
        setMessages(prev => [...prev, { text: question.text, sender: "user" }]);
        setIsTyping(true);
        setTimeout(() => {
            setMessages(prev => [...prev, { text: question.answer, sender: "bot" }]);
            setIsTyping(false);
        }, 600);
    };

    const handleEmailContact = () => {
        navigator.clipboard.writeText("jcampoy21@campusuninunez.edu.co");
        onNotify("📧 Correo copiado al portapapeles: jcampoy21@campusuninunez.edu.co");
    };

    if (!isOpen) return null;

    return (
        <div className="fixed bottom-20 right-4 sm:right-6 w-[calc(100%-2rem)] sm:w-96 max-w-[400px] z-50">
            <div className={`rounded-2xl shadow-2xl flex flex-col ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border`}>
                {/* Header */}
                <div className={`flex justify-between items-center p-3 rounded-t-2xl ${isDarkMode ? 'bg-gradient-to-r from-cyan-600 to-blue-600' : 'bg-gradient-to-r from-cyan-500 to-blue-500'}`}>
                    <div className="flex items-center gap-2">
                        <MessageCircle className="w-5 h-5 text-white" />
                        <h3 className="font-bold text-white text-sm sm:text-base">Asistente SeaVector</h3>
                    </div>
                    <button onClick={onClose} className="text-white hover:text-gray-200">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Messages area - altura fija con scroll */}
                <div className="h-64 overflow-y-auto p-3 space-y-2">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[85%] p-2 rounded-xl text-sm ${msg.sender === "user" ? (isDarkMode ? 'bg-cyan-600 text-white' : 'bg-cyan-500 text-white') : (isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-800')}`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className={`p-2 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                <div className="flex gap-1">
                                    <span className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                                    <span className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                                    <span className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Preguntas frecuentes - colapsable o con scroll propio */}
                <div className="p-3 border-t border-gray-200 dark:border-gray-700 max-h-48 overflow-y-auto">
                    <p className={`text-xs mb-2 font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>📌 Preguntas frecuentes:</p>
                    <div className="grid grid-cols-1 gap-2">
                        {questions.map((q) => (
                            <button
                                key={q.id}
                                onClick={() => handleQuestionClick(q)}
                                className={`text-left px-2 py-1.5 rounded-lg text-xs transition truncate ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                            >
                                {q.text}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Footer con contacto */}
                <div className={`p-3 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} text-center`}>
                    <p className={`text-xs mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>¿Necesitas más ayuda?</p>
                    <button
                        onClick={handleEmailContact}
                        className={`w-full py-1.5 rounded-lg text-xs transition flex items-center justify-center gap-1 ${isDarkMode ? 'bg-cyan-600 hover:bg-cyan-700 text-white' : 'bg-cyan-500 hover:bg-cyan-600 text-white'}`}
                    >
                        <Copy className="w-3 h-3" />
                        Copiar correo electrónico
                    </button>
                    <p className={`text-[11px] mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        jcampoy21@campusuninunez.edu.co
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;