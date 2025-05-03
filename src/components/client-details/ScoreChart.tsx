
import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

interface ScoreChartProps {
  data: Array<{
    name: string;
    score: number;
  }>;
}

export const ScoreChart: React.FC<ScoreChartProps> = ({ data }) => {
  return (
    <div className="space-y-6 p-6 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold text-black">Relevance Score</h2>
      </div>
      
      {/* Horizontal Bar Chart without grid lines and axis */}
      <div className="h-72 bg-white p-4 rounded-md mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data.sort((a, b) => b.score - a.score)}
            layout="horizontal"
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <XAxis dataKey="name" hide={true} />
            <YAxis hide={true} />
            <Tooltip 
              formatter={(value) => [`${value}/100`, 'Score']} 
              cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
            />
            <Bar 
              dataKey="score" 
              fill="#ea384c" 
              radius={[4, 4, 0, 0]}
              label={(props) => {
                const { x, y, width, height, value, name } = props;
                return (
                  <g>
                    <text 
                      x={x + width + 5} 
                      y={y + height / 2} 
                      fill="#000000" 
                      textAnchor="start" 
                      dominantBaseline="central"
                      fontSize={12}
                    >
                      {value}
                    </text>
                    <text 
                      x={x - 5} 
                      y={y + height / 2} 
                      fill="#000000" 
                      textAnchor="end" 
                      dominantBaseline="central"
                      fontSize={12}
                    >
                      {name}
                    </text>
                  </g>
                );
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
