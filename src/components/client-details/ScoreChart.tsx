
import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

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
          layout="horizontal"
          margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
        >
          <XAxis 
            type="number" 
            domain={[0, 100]}
            tickLine={false}
            axisLine={true}
            tick={{ fill: 'black' }}
          />
          <YAxis 
            type="category"
            dataKey="name"
            tickLine={false}
            axisLine={true}
            tick={{ fill: 'black' }}
            width={70}
          />
          <Tooltip 
            formatter={(value) => [`${value}/100`, 'Score']}
            cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
          />
          <Bar 
            dataKey="score" 
            fill="#ea384c" 
            radius={[0, 4, 4, 0]}
            onClick={(data) => onBarClick(data)}
            label={{
              position: 'right',
              fill: 'black',
              formatter: (item: any) => `${item}`,
              fontSize: 12
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
