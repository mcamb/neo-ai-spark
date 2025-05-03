
import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell
} from 'recharts';

interface ScoreItem {
  name: string;
  score: number;
  rationale?: string;
}

interface ScoreChartProps {
  data: ScoreItem[];
  onBarClick: (platform: string, rationale: string) => void;
}

export const ScoreChart: React.FC<ScoreChartProps> = ({ data, onBarClick }) => {
  // Sort data by score (highest to lowest)
  const sortedData = [...data].sort((a, b) => b.score - a.score);
  
  // Colors for bars
  const barColor = '#9b87f5';

  const handleBarClick = (data: any) => {
    const { name, rationale } = data;
    if (rationale && name) {
      onBarClick(name, rationale);
    }
  };
  
  return (
    <div className="w-full h-[400px] bg-white rounded-md">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={sortedData}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 80, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
          <XAxis
            type="number"
            domain={[0, 100]}
            tickCount={6}
          />
          <YAxis
            dataKey="name"
            type="category"
            width={80}
            tick={{ fontSize: 13 }}
          />
          <Tooltip
            formatter={(value: number) => [`${value}/100`, 'Score']}
            cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
          />
          <Bar
            dataKey="score"
            radius={[0, 4, 4, 0]}
            label={{ position: 'right', formatter: (value: number) => `${value}`, fill: '#333' }}
            onClick={handleBarClick}
            cursor="pointer"
          >
            {sortedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={barColor} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
