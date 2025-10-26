import React, { useState, useRef, useEffect } from 'react';
import { sendMessage } from '../services/aiService';
import type { ChatMessage, AIProvider } from '../types';
import type { GenerateContentResponse } from '@google/genai';
import { SendIcon, BotIcon, UserIcon, ThinkingIcon } from './icons';
import ProviderSelector from './ProviderSelector';

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [thinkingMode, setThinkingMode] = useState<boolean>(false);
  const [provider, setProvider] = useState<AIProvider>('google');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  useEffect(() => {
    setMessages([]);
  }, [thinkingMode, provider]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    const currentInput = input;
    const currentMessages = [...messages, userMessage];
    
    setMessages(currentMessages);
    setInput('');
    setIsLoading(true);
    
    try {
      const response = await sendMessage(provider, messages, currentInput, thinkingMode);
      
      // FIX: Changed the check from `instanceof ReadableStream` to `typeof response !== 'string'`
      // because the streaming response from the service is an AsyncIterable, not a ReadableStream.
      if (provider === 'google' && typeof response !== 'string') {
        let fullResponse = '';
        setMessages(prev => [...prev, { role: 'model', content: '' }]); // Add a placeholder
        
        for await (const chunk of response) {
            fullResponse += chunk.text;
            setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1].content = fullResponse;
                return newMessages;
            });
        }
      } else {
        // Handle non-streaming response for other providers
        const fullResponse = response as string;
        setMessages(prev => [...prev, { role: 'model', content: fullResponse }]);
      }
    } catch (error: any) {
        console.error('Chatbot error:', error);
        setMessages((prev) => [...prev, { role: 'model', content: `Sorry, I encountered an error: ${error.message}` }]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <section id="chatbot" className="bg-slate-800/50 rounded-xl shadow-lg p-6 backdrop-blur-sm border border-slate-700">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
        <h2 className="text-2xl font-bold text-cyan-300">AI Assistant</h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <ProviderSelector selectedProvider={provider} onChange={setProvider} disabled={isLoading} />
          <div className="flex items-center space-x-3">
            <ThinkingIcon />
            <span className={`font-medium ${thinkingMode ? 'text-cyan-400' : 'text-slate-400'}`}>
              Thinking Mode
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={thinkingMode} onChange={() => setThinkingMode(!thinkingMode)} className="sr-only peer" />
              <div className="w-11 h-6 bg-slate-600 rounded-full peer peer-focus:ring-2 peer-focus:ring-cyan-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
            </label>
          </div>
        </div>
      </div>
      <div className="h-96 bg-slate-900 rounded-md p-4 flex flex-col space-y-4 overflow-y-auto mb-4 border border-slate-700">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'model' && <div className="w-8 h-8 flex-shrink-0 bg-slate-700 rounded-full flex items-center justify-center"><BotIcon /></div>}
            <div className={`max-w-md p-3 rounded-lg ${msg.role === 'user' ? 'bg-cyan-500 text-slate-900' : 'bg-slate-700 text-slate-200'}`}>
                {msg.content || <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>}
            </div>
            {msg.role === 'user' && <div className="w-8 h-8 flex-shrink-0 bg-slate-700 rounded-full flex items-center justify-center"><UserIcon /></div>}
          </div>
        ))}
        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <div className="flex items-start gap-3 justify-start">
            <div className="w-8 h-8 flex-shrink-0 bg-slate-700 rounded-full flex items-center justify-center"><BotIcon /></div>
            <div className="max-w-md p-3 rounded-lg bg-slate-700 text-slate-200 flex items-center gap-2">
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-75"></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-150"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex gap-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
          placeholder={thinkingMode ? "Ask a complex question..." : "Ask a question..."}
          className="flex-grow p-3 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-cyan-400 focus:outline-none transition duration-200 text-slate-200"
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="px-5 py-3 bg-cyan-500 text-slate-900 font-bold rounded-md hover:bg-cyan-400 transition-all duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed"
        >
          <SendIcon />
        </button>
      </div>
    </section>
  );
};

export default Chatbot;