import { useState } from "react";
import { HelpDesktSVG } from "../components/svgs/Svgs";
import axios from "axios";
import toast from "react-hot-toast";

import { Link } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";

const ComplimentForm = () => {
  const URI = import.meta.env.VITE_BACK_END_URL;
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    complaintText: "",
  });

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${URI}/api/compliments`, formData);

      if (response.data.status == 1) {
        toast.success(response.data.message);

        const TELEGRAM_BOT_TOKEN =
          "7914262940:AAESr0zuVAp84lIDSng-chB1YyqNLRc7pJY";
        const CHAT_ID = "1117810217";
        const message =
          `*New Compliment Received:*\n\n` +
          `*Name:* ${formData.name}\n` +
          `*Phone:* ${formData.phoneNumber}\n` +
          `*Email:* [${formData.email}](mailto:${formData.email})\n` +
          `*Message:* \`${formData.complaintText}\``;
        try {
          await axios.post(
            `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
            {
              chat_id: CHAT_ID,
              text: message,
              parse_mode: "Markdown",
            }
          );
          setFormData({
            name: "",
            phoneNumber: "",
            email: "",
            complaintText: "",
          });
        } catch (error) {
          console.error("Error sending message to Telegram:", error);
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to submit compliment");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-pink-300 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-10 max-w-2xl w-full flex items-start space-x-6">
        <div className="w-52 flex flex-col ">
          <div>
            <Link className="flex items-center text-lg text-slate-500" to={"/"}>
              <IoIosArrowRoundBack />
              back
            </Link>
          </div>
          <HelpDesktSVG />
        </div>

        <div className="w-2/3">
          <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
            Send a complaint
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-pink-400 focus:border-pink-400 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-pink-400 focus:border-pink-400 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-pink-400 focus:border-pink-400 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="complaintText"
                className="block text-sm font-medium text-gray-700"
              >
                complaint
              </label>
              <textarea
                id="complaintText"
                name="complaintText"
                value={formData.complaintText}
                onChange={handleChange}
                required
                rows={4}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-pink-400 focus:border-pink-400 sm:text-sm"
              ></textarea>
            </div>

            <div className="flex">
              <button
                type="submit"
                className="w-full text-slate-600 font-bold py-2 px-4 rounded-full shadow-lg transition ease-in-out duration-200 hover:shadow-xl hover:bg-opacity-20"
              >
                Submit complaint
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ComplimentForm;
