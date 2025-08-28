import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';

ChartJS.register(Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function BarChart({ data, options }) {
  return <Bar data={data} options={options} />;
}
