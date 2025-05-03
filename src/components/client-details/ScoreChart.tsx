
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
}

export const ScoreChart: React.FC<ScoreChartProps> = ({ data }) => {
  // Sort data by score (highest to lowest)
  const sortedData = [...data].sort((a, b) => b.score - a.score);
  
  return (
    <div className="h-80 w-full bg-white p-4 rounded-md shadow-sm">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={sortedData}
          layout="horizontal"
          margin={{ top: 5, right: 50, left: 20, bottom: 5 }}
          barGap={8}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
          <XAxis 
            type="number" 
            domain={[0, 100]}
            tickLine={false}
            axisLine={true}
            tick={{ fill: '#333333', fontSize: 12 }}
          />
          <YAxis 
            type="category"
            dataKey="name"
            tickLine={false}
            axisLine={true}
            tick={{ fill: '#333333', fontSize: 13 }}
            width={120}
          />
          <Tooltip 
            formatter={(value: number) => [`${value}/100`, 'Score']}
            cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
            contentStyle={{ 
              borderRadius: '4px', 
              border: '1px solid #e0e0e0',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
            }}
          />
          <Bar 
            dataKey="score" 
            fill="#9b87f5"
            radius={[0, 4, 4, 0]}
            animationDuration={800}
            className="transition-opacity"
          >
            <LabelList 
              dataKey="score" 
              position="right"
              offset={10}
              fill="#333333"
              fontSize={12}
              formatter={(value: number) => `${value}`}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
