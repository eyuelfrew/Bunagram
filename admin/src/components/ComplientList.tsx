import { useState, useEffect } from "react";
import LoadingComliantsSkeleton from "./LoadingComliantsSkeleton";
import { Link } from "react-router-dom";
import axios from "axios";

interface CompliantType {
  _id: string;
  name: string;
  email: string;
  complaintText: string;
  phoneNumber: string;
}
const ComplientList = () => {
  const URI = import.meta.env.VITE_BACK_END;
  const [isLoading, setIsLoading] = useState(false);
  const [compliments, setCompliments] = useState<CompliantType[]>([]);
  const [refrashe, setRefreshe] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deletedItem, setDeletedItem] = useState("");
  const handleRefresh = () => {
    setRefreshe(!refrashe);
  };
  useEffect(() => {
    setIsLoading(true);
    const fetchCompliments = async () => {
      try {
        const response = await axios.get(`${URI}/api/compliments`, {
          withCredentials: true,
        });
        setCompliments(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching compliments:", error);
      }
    };

    fetchCompliments();
  }, [refrashe]);

  const handleDelete = async (id: string) => {
    setDeletedItem(id);
    try {
      setDeleteLoading(true);
      const response = await axios.delete(`${URI}/api/compliments/${id}`, {
        withCredentials: true,
      });
      setDeleteLoading(false);
      setDeletedItem("");
      if (response.status == 200) {
        setCompliments((prevCompliments) =>
          prevCompliments.filter((compliment) => compliment._id !== id)
        );
      } else {
        alert("Error deleting compliment");
      }
    } catch (error) {
      console.error("Error deleting compliment:", error);
    }
  };

  return (
    <>
      <div className="p-4 sm:ml-64 overflow-y-hidden">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
          <div className="flex justify-between mb-3">
            <h1 className="border-l-4 border-red-400 text-2xl">
              Complaint List
            </h1>
            <button
              onClick={handleRefresh}
              className="shadow-lg flex items-center gap-2 p-2 mx-10"
            >
              Refresh
            </button>
          </div>
          <div className="flex w-full  justify-center md:justify-center mb-4 flex-wrap">
            {isLoading ? (
              <LoadingComliantsSkeleton />
            ) : (
              <div className="flex w-full gap-5 justify-center md:justify-center mb-4 flex-wrap">
                {compliments.map((compliment, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-2xl p-4 w-full"
                  >
                    <ul className="space-y-4 flex  flex-col">
                      <li className="flex justify-between items-center p-4 border rounded-lg shadow-sm  ">
                        <div className="flex flex-col space-y-2">
                          <div className="h-4 w-40">
                            <span>Name : {compliment?.name}</span>
                          </div>
                          <div className="h-4  flex">
                            <span>Phone : {compliment?.phoneNumber}</span>
                          </div>
                          <div className="h-4  w-full">
                            <span>Email : {compliment?.email}</span>
                          </div>{" "}
                          <div className="h-4  w-full">
                            <p
                              className="w-80 overflow-hidden truncate
                               ..."
                            >
                              Subject : {compliment?.complaintText}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <div className="h-8 w-20 ">
                            <Link
                              to={`/home/comp/${compliment._id}`}
                              className="text-blue-600 hover:underline"
                            >
                              View
                            </Link>
                          </div>
                          <div className="h-8 w-20 ">
                            {deletedItem === compliment._id && deleteLoading ? (
                              <>
                                {" "}
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
                              </>
                            ) : (
                              <>
                                {" "}
                                <button
                                  onClick={() => handleDelete(compliment._id)}
                                  className="text-red-600 hover:underline"
                                >
                                  Delete
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ComplientList;
