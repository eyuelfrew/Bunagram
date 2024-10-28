// src/components/charts/MessageVolumeChart.tsx
import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { ChartData, ChartOptions } from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface MessageVolumeChartProps {
  data: {
    labels: string[]; // Labels for x-axis, e.g., ['January', 'February', ...]
    values: number[]; // Data points, e.g., [65, 59, 80, ...]
  };
}

const MessageVolumeChart: React.FC<MessageVolumeChartProps> = ({ data }) => {
  const chartData: ChartData<"line"> = {
    labels: data?.labels,
    datasets: [
      {
        label: "Message Volume",
        data: data?.values,
        fill: false,
        borderColor: "#42A5F5",
        tension: 0.1,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default MessageVolumeChart;
