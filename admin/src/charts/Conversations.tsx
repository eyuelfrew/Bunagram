import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ConversationBarChart: React.FC = () => {
  const uri = import.meta.env.VITE_BACK_END;
  const [data, setData] = useState<{ labels: string[]; values: number[] }>({
    labels: [],
    values: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${uri}/api/conversation-data`, {
          withCredentials: true,
        });
        setData(response.data);
      } catch (error) {
        console.error("Error fetching conversation data:", error);
      }
    };
    fetchData();
  }, []);

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: "Conversations Created",
        data: data.values,
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="mt-11">
      <h2 className="border-l-4 border-yellow-400 text-xl">
        Conversations Created Over Time
      </h2>
      <Bar data={chartData} />
    </div>
  );
};

export default ConversationBarChart;
