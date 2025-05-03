
import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';

interface ScoreItem {
  name: string;
  score: number;
  rationale?: string;
}

interface ScoreChartProps {
  data: ScoreItem[];
  onBarClick: (item: ScoreItem) => void;
}

export const ScoreChart: React.FC<ScoreChartProps> = ({ data, onBarClick }) => {
  return (
    <div className="h-72 bg-white p-4 rounded-md">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data.sort((a, b) => b.score - a.score)}
          layout="vertical"
          margin={{ top: 30, right: 50, left: 10, bottom: 30 }}
          onClick={(data) => data && data.activePayload && onBarClick(data.activePayload[0].payload)}
        >
          <XAxis type="number" hide />
          <Tooltip 
            formatter={(value) => [`${value}/100`, 'Score']} 
            cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
          />
          <Bar 
            dataKey="score" 
            fill="#ea384c" 
            radius={[0, 4, 4, 0]}
            label={(props) => {
              const { x, y, width, value } = props;
              return (
                <text 
                  x={x + width + 5} 
                  y={y + 12} 
                  fill="#000000" 
                  textAnchor="start" 
                  dominantBaseline="central"
                  fontSize={12}
                >
                  {value}
                </text>
              );
            }}
            name="Score"
          />
          {/* Custom labels for platform names */}
          {data.map((entry, index) => (
            <g key={`label-${index}`}>
              <text
                x={10}
                y={(index * 38) + 63} // Adjust vertical positioning based on bar height
                fill="#000000"
                textAnchor="start"
                fontSize={12}
                className="cursor-pointer"
                onClick={() => onBarClick(entry)}
              >
                {entry.name}
              </text>
            </g>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
