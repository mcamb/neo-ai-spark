
import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList
} from 'recharts';

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
  // Sort data by score (highest to lowest)
  const sortedData = [...data].sort((a, b) => b.score - a.score);
  
  return (
    <div className="h-80 w-full bg-white p-4 rounded-md shadow-sm">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={sortedData}
          layout="horizontal"
          margin={{ top: 5, right: 50, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
          <XAxis 
            type="number" 
            domain={[0, 100]}
            tickLine={false}
            axisLine={true}
          />
          <YAxis 
            type="category" 
            dataKey="name" 
            width={100}
            tickLine={false}
            axisLine={true}
          />
          <Tooltip 
            formatter={(value: number) => [`${value}/100`, 'Score']}
            cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
          />
          <Bar 
            dataKey="score" 
            fill="#9b87f5"
            radius={[0, 4, 4, 0]}
            onClick={(data) => onBarClick(data)}
            cursor="pointer"
          >
            <LabelList 
              dataKey="score" 
              position="right" 
              formatter={(value: number) => `${value}`} 
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
