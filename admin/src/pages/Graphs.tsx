import { useEffect, useState } from "react";
import MessageVolumeChart from "../charts/MessageVolumeChart";
import axios from "axios";
import UserStatusPieChart from "../charts/UsersStatus";
import ConversationBarChart from "../charts/Conversations";

interface ChartData {
  labels: string[];
  values: number[];
}

const Graphs = () => {
  const uri = import.meta.env.VITE_BACK_END;
  const [isLoadingMessageVolume, setIsLoadingVolume] = useState(false);
  const [selectedDay, setSelectedDay] = useState(7); // Default to 1 (Today)
  const [messageVolumeData, setMessageVolumeData] = useState<ChartData>({
    labels: [],
    values: [],
  });

  const getMessageVolume = async (day: number) => {
    setIsLoadingVolume(true);

    try {
      const response = await axios.get(`${uri}/api/message-volume?day=${day}`, {
        withCredentials: true,
      });
      console.log(response.data);
      setIsLoadingVolume(false);

      setMessageVolumeData(response.data?.data);
    } catch (error) {
      console.error("Error fetching message volume data:", error);
    }
  };

  const handleDayChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setIsLoadingVolume(true);
    const day = Number(event.target.value);
    setSelectedDay(day);
    getMessageVolume(day);
  };

  useEffect(() => {
    getMessageVolume(selectedDay);
  }, []);

  return (
    <>
      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
          <div className="block lg:flex gap-4 justify-between items-center">
            <div className="md:w-[100%] lg:w-[50%]">
              <h1 className="border-l-4 border-green-500 text-xl">
                Message Volume
              </h1>
              <select
                value={selectedDay}
                onChange={handleDayChange}
                className="p-0 mx-1 border border-gray-300 rounded-md shadow-md hover:border-blue-500 hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-700"
              >
                <option className="" value={1}>
                  Today
                </option>
                <option value={7}>This Week</option>
                <option value={30}>This Month</option>
              </select>
              {isLoadingMessageVolume ? (
                <div className="flex justify-center items-center">
                  <div role="status">
                    <svg
                      aria-hidden="true"
                      className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              ) : (
                <>
                  <MessageVolumeChart data={messageVolumeData} />
                </>
              )}
            </div>
            <div className="md:w-[100%] lg:w-[40%]">
              <UserStatusPieChart />
            </div>
          </div>
          <div className="w-full">
            <ConversationBarChart />
          </div>
        </div>
      </div>
    </>
  );
};

export default Graphs;
