import React, { useState } from 'react';
import { analyzeReviews } from '../services/aiService';
import type { AnalysisResult, AIProvider } from '../types';
import TrendChart from './TrendChart';
import WordCloud from './WordCloud';
import ProviderSelector from './ProviderSelector';
import { BotIcon } from './icons';

const sampleReviews = `
The new coffee maker is amazing! Brews quickly and the coffee is delicious. 5 stars!
My package arrived late and the box was damaged. Very disappointed with the shipping.
Customer service was incredibly helpful. They resolved my issue in minutes.
The app is a bit buggy, it crashes every now and then. Needs improvement.
I love the design, but the battery life is much shorter than advertised.
The setup was a breeze, I was up and running in less than 5 minutes.
Great value for the price. I would definitely recommend this to a friend.
The product broke after just one week of use. Poor quality.
I had a question and the online chat support was very responsive and friendly.
The user interface is confusing and not intuitive at all.
`;

const SentimentDashboard: React.FC = () => {
  const [reviews, setReviews] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<AIProvider>('google');

  const handleAnalyze = async () => {
    if (!reviews.trim()) {
      setError('Please paste some reviews to analyze.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await analyzeReviews(reviews, provider);
      setAnalysisResult(result);
    } catch (e: any) {
      setError(e.message || 'An error occurred during analysis. Please check your connection and try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseSample = () => {
    setReviews(sampleReviews.trim());
  };

  return (
    <section id="dashboard" className="space-y-8">
      <div className="bg-slate-800/50 rounded-xl shadow-lg p-6 backdrop-blur-sm border border-slate-700">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
            <h2 className="text-2xl font-bold text-cyan-300">1. Input Reviews</h2>
            <ProviderSelector selectedProvider={provider} onChange={setProvider} disabled={isLoading} />
        </div>
        <p className="text-slate-400 mb-4">
          Paste your raw customer reviews below. Each review should ideally be on a new line.
        </p>
        <textarea
          value={reviews}
          onChange={(e) => setReviews(e.target.value)}
          placeholder="Paste reviews here..."
          className="w-full h-48 p-4 bg-slate-900 border border-slate-600 rounded-md focus:ring-2 focus:ring-cyan-400 focus:outline-none transition duration-200 text-slate-300 resize-y"
          disabled={isLoading}
        />
        <div className="mt-4 flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleAnalyze}
            disabled={isLoading || !reviews.trim()}
            className="w-full sm:w-auto flex-grow px-6 py-3 bg-cyan-500 text-slate-900 font-bold rounded-md hover:bg-cyan-400 transition-all duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                Analyzing...
              </>
            ) : (
              'Analyze Sentiment'
            )}
          </button>
          <button
            onClick={handleUseSample}
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-3 bg-slate-700 text-slate-200 font-bold rounded-md hover:bg-slate-600 transition-all duration-200 disabled:opacity-50"
          >
            Use Sample Data
          </button>
        </div>
        {error && <p className="mt-4 text-red-400">{error}</p>}
      </div>

      {analysisResult && (
        <div id="results" className="space-y-8">
          <div className="bg-slate-800/50 rounded-xl shadow-lg p-6 backdrop-blur-sm border border-slate-700">
            <h2 className="text-2xl font-bold mb-4 text-cyan-300 flex items-center gap-3">
              <BotIcon /> Executive Summary
            </h2>
            <div className="prose prose-invert prose-p:text-slate-300 prose-headings:text-cyan-400 prose-strong:text-slate-100" dangerouslySetInnerHTML={{ __html: analysisResult.summary.replace(/\n/g, '<br />') }} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-slate-800/50 rounded-xl shadow-lg p-6 backdrop-blur-sm border border-slate-700">
              <h3 className="text-xl font-bold mb-4 text-cyan-300">Sentiment Trend</h3>
              <div className="h-80 w-full">
                <TrendChart data={analysisResult.sentimentTrend} />
              </div>
            </div>
            <div className="bg-slate-800/50 rounded-xl shadow-lg p-6 backdrop-blur-sm border border-slate-700">
              <h3 className="text-xl font-bold mb-4 text-cyan-300">Keywords Word Cloud</h3>
              <div className="h-80 w-full">
                <WordCloud words={analysisResult.wordCloud} />
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default SentimentDashboard;