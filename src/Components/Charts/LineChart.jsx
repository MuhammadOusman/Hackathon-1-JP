import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from 'chart.js';

ChartJS.register(Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

export default function LineChart({ data, options }) {
  return <Line data={data} options={options} />;
}
