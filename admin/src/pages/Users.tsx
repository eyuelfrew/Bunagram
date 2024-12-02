import axios, { AxiosResponse } from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiFillDelete } from "react-icons/ai";
import { FaUserAltSlash, FaUserCheck, FaUsers } from "react-icons/fa";
interface User {
  _id: string;
  name: string;
  email: string;
  phone_number: string;
  banded: boolean;
  deletedAccount: boolean;
}
const Users = () => {
  const URI = import.meta.env.VITE_BACK_END;
  const [users, setUsers] = useState<User[]>([]);
  const [reload, setReload] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [DeleteloadingUserId, setDeletedId] = useState("");
  const [loadingUserId, setUserId] = useState("");
  const handleReload = () => {
    setReload(!reload);
  };
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${URI}/api/users`, {
        withCredentials: true,
      });
      setUsers(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, [reload]);
  const handleActivate = async (id: string) => {
    setUserId(id);
    try {
      const response = await axios.get(`${URI}/api/users/activate/${id}`, {
        withCredentials: true,
      });
      setUserId("");
      if (response.data.status === 1) {
        toast.success(response.data.message);
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === id ? { ...user, banded: false } : user
          )
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleBanUser = async (id: string) => {
    setUserId(id);
    try {
      const response = await axios.get(`${URI}/api/users/${id}`, {
        withCredentials: true,
      });
      setUserId("");
      if (response.data.status === 1) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === id ? { ...user, banded: true } : user
          )
        );
        toast.success(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleSearch = async (e: ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${URI}/api/search`,
        { query: e.target.value },
        { withCredentials: true }
      );
      setIsLoading(false);
      setUsers(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const handeleFilter = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${URI}/api/filter`,
        { query: e.target.value },
        { withCredentials: true }
      );
      setIsLoading(false);
      setUsers(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeletUser = async (id: string) => {
    setDeletedId(id);
    try {
      const response: AxiosResponse = await axios.delete(
        `${URI}/api/users/${id}`,
        { withCredentials: true }
      );
      setDeletedId("");

      if (response.data.status === 1) {
        toast.success(response.data.message);
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };
  return (
    <div className="p-4 sm:ml-64">
      <div className="p-4  rounded-lg dark:border-gray-700">
        <div className="flex justify-between mb-3">
          <h1 className="text-2xl flex items-center gap-3">
            <FaUsers size={40} />
            Users
          </h1>
          <button
            onClick={handleReload}
            className="shadow-lg flex items-center gap-2 p-2 mx-10"
          >
            Refresh
          </button>
        </div>

        <div className="flex w-full justify-center md:justify-center md:gap-1 lg:justify-between mb-4 flex-wrap">
          <div className="bg-white shadow-lg rounded-lg w-full max-h-[400px] overflow-hidden">
            <div className="flex gap-4 mb-4">
              <input
                type="text"
                placeholder="Search users"
                // value={searchTerm}
                onChange={handleSearch}
                className="px-2 border w-96 h-9 rounded-lg"
              />
              {/* Status Filter */}
              <select
                // value={statusFilter}
                onChange={handeleFilter}
                className="px-2 w-52 border h-9 rounded-lg"
              >
                <option value="">All Users</option>
                <option value="false">Active</option>
                <option value="true">Inactive</option>
              </select>
            </div>
            <table className="min-w-full">
              <thead className="sticky top-0 bg-blue-200 z-10">
                <tr>
                  <th className="px-4 py-2 text-left">Full Name</th>
                  <th className="px-0 py-2 text-left">Email</th>
                  <th className="px-8 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
            </table>
            {/* Scrollable wrapper around tbody */}
            <div className="max-h-[100%] overflow-y-auto ">
              <table className="min-w-full">
                <tbody className="bg-white divide-y divide-gray-200">
                  {isLoading
                    ? Array.from({ length: 10 }).map((_, index) => (
                        <tr key={index} className="border-b">
                          <td className="px-4 py-2">
                            <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse"></div>
                          </td>
                          <td className="px-4 py-2">
                            <div className="h-4 bg-gray-300 rounded w-1/2 animate-pulse"></div>
                          </td>
                          <td className="px-4 py-2 text-center">
                            <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto animate-pulse"></div>
                          </td>
                          <td className="px-4 py-2 text-center">
                            <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto animate-pulse"></div>
                          </td>
                        </tr>
                      ))
                    : users.map((user, index) => (
                        <tr key={index} className="border-b ">
                          <td className="px-4 py-2  max-w-28 truncate ...">
                            {user.name}
                          </td>
                          <td className="px-4 py-2 max-w-28 truncate ...">
                            {user.email}
                          </td>
                          <td
                            className={`
                          px-4 py-2   max-w-28 truncate ... text-center tex`}
                          >
                            <span
                              className={`px-2 py-1 rounded-full gap-3 flex items-center justify-center`}
                            >
                              {user.banded ? (
                                <>
                                  <FaUserAltSlash className="text-red-600" />
                                  Baned
                                </>
                              ) : (
                                <>
                                  <FaUserCheck className="text-green-500" />
                                  Active
                                </>
                              )}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-center space-x-2  max-w-28 truncate ... ">
                            {user.banded ? (
                              <>
                                <>
                                  {loadingUserId === user._id ? (
                                    <button className="w-9 px-3 py-1 text-sm font-semibold justify-center   text-white rounded shadow">
                                      <svg
                                        aria-hidden="true"
                                        className="w-4 text-gray-200 animate-spin fill-blue-600"
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
                                      <span className="sr-only">
                                        Loading...
                                      </span>
                                    </button>
                                  ) : (
                                    <>
                                      {" "}
                                      <button
                                        onClick={() => handleActivate(user._id)}
                                        className="px-3 py-1 text-sm font-semibold bg-green-500  text-white rounded shadow"
                                      >
                                        Activate
                                      </button>
                                    </>
                                  )}
                                </>
                              </>
                            ) : (
                              <>
                                {loadingUserId === user._id ? (
                                  <button className="w-9 px-3 py-1 text-sm font-semibold justify-center   text-white rounded shadow">
                                    <svg
                                      aria-hidden="true"
                                      className="w-4 text-gray-200 animate-spin fill-blue-600"
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
                                  </button>
                                ) : (
                                  <>
                                    <button
                                      onClick={() => handleBanUser(user._id)}
                                      className="px-3 py-1 text-sm font-semibold bg-red-500  text-white rounded shadow"
                                    >
                                      Deactivate
                                    </button>
                                  </>
                                )}
                              </>
                            )}

                            {DeleteloadingUserId === user._id ? (
                              <button className="w-9 px-3 py-1 text-sm font-semibold justify-center   text-white rounded shadow">
                                <svg
                                  aria-hidden="true"
                                  className="w-4 text-gray-200 animate-spin fill-blue-600"
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
                              </button>
                            ) : (
                              <>
                                {" "}
                                <button
                                  onClick={() => handleDeletUser(user._id)}
                                  className="px-3 py-1 text-sm font-semibold bg-red-500 hover:bg-red-600 text-white rounded shadow"
                                >
                                  <AiFillDelete />
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
