
import React from 'react';
import SentimentDashboard from './components/SentimentDashboard';
import Chatbot from './components/Chatbot';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Customer Sentiment Dashboard
          </h1>
          <p className="mt-2 text-slate-400">
            Powered by Gemini - Analyze reviews and chat with our AI assistant.
          </p>
        </header>

        <main className="space-y-12">
          <SentimentDashboard />
          <div className="border-t border-slate-700/50 my-12"></div>
          <Chatbot />
        </main>

        <footer className="text-center mt-12 text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} AI-Powered Insights. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
