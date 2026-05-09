// src/components/Chatbot.jsx
import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Copy } from 'lucide-react';

const Chatbot = ({ isOpen, onClose, isDarkMode, onNotify }) => {
  const [messages, setMessages] = useState([
    { text: "¡Hola! Soy el asistente de SeaVector. Haz clic en cualquier pregunta para obtener información:", sender: "bot" }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const questions = [
    { id: 1, text: "🌊 ¿Qué es la erosión costera?", answer: "La erosión costera es el proceso de degradación y retroceso de la línea de costa debido a la energía de las olas, corrientes marinas y el aumento del nivel del mar. En Cartagena, avanzamos a 4-5 cm/año, afectando playas como Bocagrande y Castillogrande." },
    { id: 2, text: "📐 ¿Cómo funciona el Vector Gradiente?", answer: "El vector gradiente ∇E nos indica la dirección de máxima pérdida de terreno. Se calcula con derivadas parciales ∂E/∂x y ∂E/∂y. Fórmula: ∇E = ∂E/∂x î + ∂E/∂y ĵ." },
    { id: 3, text: "📅 ¿Qué proyecciones hay para 2050?", answer: "Para 2050, proyectamos una pérdida de hasta 8 metros de playa en Bocagrande según el modelo RCP 4.5 del IPCC." },
    { id: 4, text: "💻 ¿Qué tecnología usa SeaVector?", answer: "SeaVector usa: Backend con Java Spring Boot y SQLite, Frontend con React y Three.js." },
    { id: 5, text: "🏖️ ¿Qué sectores de Cartagena se analizan?", answer: "Analizamos 5 sectores: Bocagrande, Castillogrande, El Laguito, La Boquilla y Marbella." }
  ];

  useEffect(() => {
    if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
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
    <div className={`fixed bottom-24 right-6 w-96 rounded-2xl shadow-2xl z-50 ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border flex flex-col`}>
      <div className={`flex justify-between items-center p-4 rounded-t-2xl ${isDarkMode ? 'bg-gradient-to-r from-cyan-600 to-blue-600' : 'bg-gradient-to-r from-cyan-500 to-blue-500'}`}>
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-white" />
          <h3 className="font-bold text-white">Asistente SeaVector</h3>
        </div>
        <button onClick={onClose} className="text-white hover:text-gray-200">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="h-80 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] p-3 rounded-xl ${msg.sender === "user" ? (isDarkMode ? 'bg-cyan-600 text-white' : 'bg-cyan-500 text-white') : (isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-800')}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <p className={`text-xs mb-2 font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>📌 Preguntas frecuentes:</p>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {questions.map((q) => (
            <button key={q.id} onClick={() => handleQuestionClick(q)} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}>
              {q.text}
            </button>
          ))}
        </div>
      </div>
      <div className={`p-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <p className={`text-xs text-center mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>¿Necesitas más ayuda?</p>
        <button onClick={handleEmailContact} className={`w-full py-2 rounded-lg text-sm transition flex items-center justify-center gap-2 ${isDarkMode ? 'bg-cyan-600 hover:bg-cyan-700 text-white' : 'bg-cyan-500 hover:bg-cyan-600 text-white'}`}>
          <Copy className="w-4 h-4" />
          Copiar correo electrónico
        </button>
        <p className={`text-xs text-center mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>jcampoy21@campusuninunez.edu.co</p>
      </div>
    </div>
  );
};

export default Chatbot;