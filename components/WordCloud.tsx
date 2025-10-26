
import React, { useEffect, useRef, useState } from 'react';
import type { WordCloudWord } from '../types';

interface WordCloudProps {
  words: WordCloudWord[];
}

// d3 and d3.layout are expected to be available globally from the scripts in index.html
declare const d3: any;

const WordCloud: React.FC<WordCloudProps> = ({ words }) => {
  const ref = useRef<SVGSVGElement>(null);
  const [layoutWords, setLayoutWords] = useState<any[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (words && ref.current && containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        
        const maxFreq = Math.max(...words.map(w => w.value), 0);
        const minFreq = Math.min(...words.map(w => w.value), Infinity);

        const fontSizeScale = d3.scaleSqrt()
            .domain([minFreq, maxFreq])
            .range([12, 60]);

      d3.layout.cloud()
        .size([width, height])
        .words(words.map(d => ({ text: d.text, size: fontSizeScale(d.value) })))
        .padding(5)
        .rotate(() => (~~(Math.random() * 6) - 3) * 30)
        .font("Impact")
        .fontSize((d: any) => d.size)
        .on("end", (newWords: any[]) => {
            setLayoutWords(newWords);
        })
        .start();
    }
  }, [words]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      <svg ref={ref} width="100%" height="100%">
        <g transform={`translate(${containerRef.current?.getBoundingClientRect().width / 2},${containerRef.current?.getBoundingClientRect().height / 2})`}>
          {layoutWords.map((word, i) => (
            <text
              key={word.text + i}
              textAnchor="middle"
              transform={`translate(${word.x}, ${word.y}) rotate(${word.rotate})`}
              style={{ fontSize: word.size, fill: d3.schemeCategory10[i % 10], fontFamily: 'Impact', cursor: 'pointer' }}
            >
              {word.text}
            </text>
          ))}
        </g>
      </svg>
    </div>
  );
};

export default WordCloud;
