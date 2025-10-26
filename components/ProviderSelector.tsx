import React from 'react';
import type { AIProvider } from '../types';
import { GoogleIcon, OpenAIIcon, MistralIcon } from './icons';

interface ProviderSelectorProps {
  selectedProvider: AIProvider;
  onChange: (provider: AIProvider) => void;
  disabled?: boolean;
}

const providers = [
  { id: 'google', name: 'Google', icon: <GoogleIcon /> },
  { id: 'openai', name: 'OpenAI', icon: <OpenAIIcon /> },
  { id: 'mistral', name: 'Mistral', icon: <MistralIcon /> },
];

const ProviderSelector: React.FC<ProviderSelectorProps> = ({ selectedProvider, onChange, disabled }) => {
  return (
    <div className="flex items-center gap-1 rounded-lg bg-slate-700/50 p-1 border border-slate-600">
      {providers.map((provider) => (
        <button
          key={provider.id}
          onClick={() => onChange(provider.id as AIProvider)}
          disabled={disabled}
          className={`flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-md transition-colors duration-200 ${
            selectedProvider === provider.id
              ? 'bg-slate-800 text-cyan-300 shadow-sm'
              : 'text-slate-300 hover:bg-slate-600/50'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          aria-pressed={selectedProvider === provider.id}
        >
          {provider.icon}
          <span className="hidden sm:inline">{provider.name}</span>
        </button>
      ))}
    </div>
  );
};

export default ProviderSelector;
