import axios from "axios";
import { useEffect, useState } from "react";
import { IoArrowBackOutline } from "react-icons/io5";
import { Link, useParams } from "react-router-dom";
interface CompliantType {
  _id: string;
  name: string;
  email: string;
  complaintText: string;
  createdAt: string;
}
const Complaint = () => {
  const URI = import.meta.env.VITE_BACK_END;
  const [complaint, setComlaint] = useState<CompliantType>();
  const { id } = useParams();
  const fetchSingleCompliant = async () => {
    try {
      const resposne = await axios.get(`${URI}/api/compliments/${id}`, {
        withCredentials: true,
      });
      console.log(resposne.data);
      setComlaint(resposne.data);
    } catch (error) {
      console.log(error);
    }
  };
  const formatDate = (dateString: string | number | Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    fetchSingleCompliant();
  }, []);
  return (
    <>
      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
          <div className="flex justify-between mb-3">
            <Link to={"/home/support"} className="flex items-center text-xl">
              <IoArrowBackOutline />
              Back
            </Link>
          </div>
          <div className="flex w-full justify-center md:justify-center mb-4 flex-wrap overflow-hidden">
            <div className="bg-white rounded-xl shadow-2xl p-10 w-full">
              <p className="flex items-center gap-3">
                <span className="text-lg text-slate-600">Submition Date</span>:{" "}
                <span className="text-red-400">
                  {complaint?.createdAt && formatDate(complaint.createdAt)}{" "}
                </span>
              </p>
              <p className="flex items-center gap-3">
                <span className="text-lg text-slate-600">User Name:</span>
                <span className="text-md"> {complaint?.name}</span>
              </p>{" "}
              <Link
                className="flex items-center gap-3"
                to={`maileTo:${complaint?.email}`}
              >
                <span className="text-lg text-slate-600">User Email:</span>
                <span className="underline text-md"> {complaint?.email}</span>
              </Link>
              <span className="text-lg mt-4 text-slate-600">Subject:</span>
              <p className="w-full  text-wrap text-md break-words">
                {" "}
                {complaint?.complaintText}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Complaint;
