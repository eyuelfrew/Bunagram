import { useState } from "react";
interface User {
  name: string;
  profile_pic: string;
}

interface EditUserProps {
  onClose: () => void;
  user: User;
}
const EditUser: React.FC<EditUserProps> = ({ onClose, user }) => {
  const [data, setData] = useState({
    name: user?.name,
    profile_pic: user?.profile_pic,
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };
  const handleSave = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Updated user data:", data);
    onClose();
  };
  return (
    <div
      className="fixed top-0 bottom-0 right-0 left-0
     bg-gray-700 bg-opacity-40 flex items-center justify-center"
    >
      <div className="bg-white p-4 m-1 rounded w-full max-w-sm">
        <h2 className="font-semibold">Profile Details</h2>
        <p className="text-sm">Edit user details</p>
        <form className="grid gap-5" onSubmit={handleSave}>
          <div>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              name="name"
              id="name"
              value={data.name}
              onChange={handleChange}
              className="outline outline-blue-200 w-full py-1 px-2 focus:outline-blue-500"
            />
          </div>
          <div>
            <label htmlFor="pic">photo</label>
            <div></div>
          </div>

          {/*divider component */}
          <div className="bg-slate-400 p-[.5px] w-full"></div>
          {/* divider component */}
          <div className="flex gap-3 ml-auto">
            <button className="border border-blue-500 text-blue-500 px-4 py-1 rounded hover:bg-blue-500 hover:text-white">
              Cancel
            </button>
            <button
              type="submit"
              className="border border-blue-500 bg-blue-500 text-white px-4 py-1 rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
