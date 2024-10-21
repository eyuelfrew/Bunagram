// import { ChangeEvent } from "react";
// import { FaTimes } from "react-icons/fa";
// import { FaArrowLeft } from "react-icons/fa6";
// import { VerificationMenuSVG } from "../svgs/Svgs";
// import { useSelector } from "react-redux";
// import { Root_State } from "../../store/store";

// const ForgotPass = () => {
//   const darkMode = useSelector((state: Root_State) => state.theme.darkMode);
//   function handeleTwoStepPasswordChange(
//     event: ChangeEvent<HTMLInputElement>
//   ): void {
//     throw new Error("Function not implemented.");
//   }

//   return (
//     <>
//       {verifyTwoStep && (
//         <div
//           onClick={handleCloseAllMenu}
//           className="fixed bg-black opacity-60 h-screen w-full flex justify-center items-center z-[2000]  inset-0"
//         ></div>
//       )}
//       <div
//         className={`${
//           verifyTwoStep ? "" : "hidden"
//         } absolute flex w-full justify-center items-center `}
//       >
//         <div
//           className={`${
//             darkMode
//               ? "bg-[var(--light-dark-color)]"
//               : "bg-[var(--cobalt-blue)]"
//           } rounded-xl mt-6  w-[69%] lg:w-[25%] flex flex-col z-[2400]`}
//         >
//           <div className="flex items-center justify-between p-4">
//             <div>
//               <button
//                 onClick={handleBackToSettings}
//                 className="flex items-center gap-2 text-xl text-slate-300 hover:text-slate-400"
//               >
//                 <FaArrowLeft />
//                 back
//               </button>
//             </div>
//             <div>
//               <button className="text-xl " onClick={handleCloseAllMenu}>
//                 <FaTimes
//                   size={20}
//                   className="text-slate-300 hover:text-slate-400"
//                 />
//               </button>
//             </div>
//           </div>
//           <div className="flex flex-col px-2 py-1  justify-center mb-4 ">
//             <div className="flex justify-center">
//               {" "}
//               <VerificationMenuSVG />
//             </div>
//             <h2 className="text-slate-200 text-lg font-light text-center">
//               Inster your cloud-password
//             </h2>
//           </div>
//           <div>
//             <div className="flex justify-center flex-col items-center">
//               <input
//                 className={`px-2 rounded-xl h-10 ${
//                   darkMode
//                     ? "bg-[var(--dark-bg-color)] text-slate-400 "
//                     : "bg-slate-300"
//                 } focus:outline-none`}
//                 type="password"
//                 onChange={handeleTwoStepPasswordChange}
//                 value={password}
//               />
//               <div className="w-full text-center">
//                 <span className="text-red-500">{loginInError}</span>
//               </div>
//               <div className="w-full px-2">
//                 <span className="text-sm">Forgot password?</span>
//               </div>
//             </div>
//             <div
//               //   onClick={handleVerfyPassword}
//               className="flex  px-3 items-center  mt-4 py-2 justify-center"
//             >
//               <button
//                 type="submit"
//                 className={`${
//                   darkMode ? " text-slate-300" : " text-slate-300"
//                 } w-full   font-light text-lg px-4 gap-3  items-center   rounded-md`}
//               >
//                 verify
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ForgotPass;
