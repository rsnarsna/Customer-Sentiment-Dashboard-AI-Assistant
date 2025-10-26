
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { SentimentPoint } from '../types';

interface TrendChartProps {
  data: SentimentPoint[];
}

const TrendChart: React.FC<TrendChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 20,
          left: -10,
          bottom: 5,
        }}
      >
        <defs>
          <linearGradient id="colorSentiment" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis dataKey="reviewNumber" stroke="#94a3b8" label={{ value: 'Review Number', position: 'insideBottom', offset: -10, fill: '#94a3b8' }} />
        <YAxis stroke="#94a3b8" domain={[-1, 1]} label={{ value: 'Sentiment', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(30, 41, 59, 0.8)',
            borderColor: '#475569',
            borderRadius: '0.5rem',
            color: '#e2e8f0',
          }}
        />
        <Legend wrapperStyle={{ color: '#e2e8f0' }} />
        <Line type="monotone" dataKey="sentimentScore" name="Sentiment Score" stroke="#22d3ee" strokeWidth={2} dot={{ r: 4, fill: '#06b6d4' }} activeDot={{ r: 8 }} fill="url(#colorSentiment)" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TrendChart;
