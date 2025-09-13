

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition: any;
if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'pt-BR';
    recognition.interimResults = false;
}


type Message = {
  id: string;
  text: string;
  sender: 'user' | 'ai';
};

type AIStatus = 'idle' | 'listening' | 'thinking' | 'speaking';

const GenesisAIApp: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<AIStatus>('idle');
  const aiRef = useRef<GoogleGenAI | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      if(process.env.API_KEY) {
          aiRef.current = new GoogleGenAI({ apiKey: process.env.API_KEY });
      } else {
          console.error("API_KEY environment variable not set.");
          setMessages(prev => [...prev, {id: 'error-1', text: "API_KEY não configurada. A funcionalidade de IA está desativada.", sender: 'ai'}]);
      }
    } catch (e) {
        console.error("Error initializing GoogleGenAI", e);
        setMessages(prev => [...prev, {id: 'error-2', text: "Falha ao inicializar o serviço de IA.", sender: 'ai'}]);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const speak = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) {
      console.log('Speech synthesis not supported.');
      setStatus('idle');
      return;
    }
    setStatus('speaking');
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.onend = () => setStatus('idle');
    utterance.onerror = () => {
      console.error('Error in speech synthesis.');
      setStatus('idle');
    }
    window.speechSynthesis.speak(utterance);
  }, []);


  const generateResponse = useCallback(async (prompt: string) => {
    if (!aiRef.current) {
      speak("O serviço de IA não está disponível.");
      return;
    }

    setStatus('thinking');
    
    try {
      const response = await aiRef.current.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const aiText = response.text;
      setMessages(prev => [...prev, { id: `ai-${Date.now()}`, text: aiText, sender: 'ai' }]);
      speak(aiText);
    } catch (error) {
      console.error('Error generating content:', error);
      const errorMessage = 'Desculpe, não consegui processar sua solicitação.';
      setMessages(prev => [...prev, { id: `ai-err-${Date.now()}`, text: errorMessage, sender: 'ai' }]);
      speak(errorMessage);
    } finally {
        // FIX: Use functional update to get current status and avoid bugs from stale closures.
        // If the AI is speaking, let it finish, otherwise reset to idle.
        setStatus(currentStatus => (currentStatus === 'speaking' ? currentStatus : 'idle'));
    }
  }, [speak]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newUserMessage: Message = { id: `user-${Date.now()}`, text: input, sender: 'user' };
    setMessages(prev => [...prev, newUserMessage]);
    generateResponse(input);
    setInput('');
  };

  const handleMicClick = () => {
    if (!recognition) {
        alert("Reconhecimento de voz não é suportado neste navegador.");
        return;
    }

    if (status === 'listening') {
      recognition.stop();
      setStatus('idle');
    } else {
      setStatus('listening');
      recognition.start();

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        const newUserMessage: Message = { id: `user-${Date.now()}`, text: transcript, sender: 'user' };
        setMessages(prev => [...prev, newUserMessage]);
        generateResponse(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setStatus('idle');
      };

      // FIX: The original check `if (status === 'listening')` caused a TypeScript error
      // because `status` was a stale value from a closure where its type was narrowed.
      // Using a functional update provides the current status, fixing the bug and the error.
      recognition.onend = () => {
        setStatus(currentStatus => (currentStatus === 'listening' ? 'idle' : currentStatus));
      };
    }
  };

  const statusIndicator = () => {
    const baseClasses = "w-20 h-20 rounded-full border-4 transition-all duration-300 flex items-center justify-center";
    switch (status) {
      case 'listening':
        return <div className={`${baseClasses} border-red-500 bg-red-500/20 animate-pulse`}>
           <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
        </div>;
      case 'thinking':
        return <div className={`${baseClasses} border-yellow-400 bg-yellow-400/20 animate-spin`}></div>;
      case 'speaking':
        return <div className={`${baseClasses} border-blue-400 bg-blue-400/20 animate-pulse`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.636 5.636a9 9 0 0112.728 0M8.464 15.536a5 5 0 010-7.072" /></svg>
        </div>;
      default:
        return <div className={`${baseClasses} border-yellow-500/50 bg-gray-800/20`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.553L16.5 21.75l-.398-1.197a3.375 3.375 0 00-2.455-2.455L12.75 18l1.197-.398a3.375 3.375 0 002.455-2.455L16.5 14.25l.398 1.197a3.375 3.375 0 002.455 2.455L20.25 18l-1.197.398a3.375 3.375 0 00-2.455 2.455z" /></svg>
        </div>;
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-gray-900/70 rounded-b-md text-white">
      <div className="flex-shrink-0 p-4 flex flex-col items-center justify-center space-y-2 border-b border-yellow-500/20">
        {statusIndicator()}
        <p className="text-sm text-gray-400 capitalize">{status}</p>
      </div>

      <div className="flex-grow p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg ${msg.sender === 'user' ? 'bg-yellow-600/80' : 'bg-gray-700/80'}`}>
              <p className="text-white">{msg.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex-shrink-0 p-2 border-t border-yellow-500/20 flex items-center space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Digite sua mensagem..."
          className="flex-grow bg-gray-800 text-white px-3 py-2 rounded-md border border-yellow-500/30 focus:outline-none focus:ring-1 focus:ring-yellow-400 text-sm"
          disabled={status !== 'idle'}
        />
        <button
          onClick={handleMicClick}
          className={`p-2 rounded-full transition-colors ${status === 'listening' ? 'bg-red-500' : 'bg-yellow-600 hover:bg-yellow-500'}`}
          disabled={status !== 'idle' && status !== 'listening'}
          aria-label={status === 'listening' ? 'Stop listening' : 'Start listening'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
        </button>
      </div>
    </div>
  );
};

export default GenesisAIApp;
