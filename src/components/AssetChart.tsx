import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { ChartData } from '../types';
import { format } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface AssetChartProps {
  data: ChartData;
  title: string;
}

export function AssetChart({ data, title }: AssetChartProps) {
  const chartData = {
    labels: data.timestamps.map(ts => format(new Date(ts), 'MMM d, HH:mm')),
    datasets: [
      {
        label: title,
        data: data.prices,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: title,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <Line data={chartData} options={options} />
    </div>
  );
}