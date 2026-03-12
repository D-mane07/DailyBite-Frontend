import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaListAlt, FaChartLine, FaUserCircle } from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux";
import { serverurl } from "../App";
import axios from "axios";
import { setUserData } from "../pages/redux/UserSlice";
import { IoMdCart } from "react-icons/io";
                   import { FaShop } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const OwnerNav = () => {
  const { userData } = useSelector((state) => state.user);
  const { shopData } = useSelector((state) => state.owner);
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const [scrolling, setScrolling] = useState(false);
const navigate=useNavigate()
  // detect scroll to animate navbar
  useEffect(() => {
    const handleScroll = () => setScrolling(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handlesignout = async () => {
    try {
      await axios.get(`${serverurl}/user/logout`, { withCredentials: true });
      localStorage.removeItem("vingo_auth_token");
      dispatch(setUserData(null));
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  return (
    <motion.nav
      className={`fixed top-0 left-0 w-full z-[9999] px-6 md:px-10 flex items-center justify-between transition-all duration-500 ${
        scrolling
          ? "bg-white/85 backdrop-blur-2xl shadow-[0_4px_25px_rgba(0,0,0,0.08)]"
          : "bg-gradient-to-r from-[#fff9f6] to-[#fff2ee]"
      }`}
      style={{ height: "85px" }}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
    >
      {/* Logo */}
      <motion.h1
        className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#ff4d2d] cursor-pointer select-none"
        whileHover={{ scale: 1.05 }}
      >
        Vingo <span className="text-gray-700 text-lg">Owner</span>
      </motion.h1>

      {/* Nav Buttons */}
      {shopData && (
        <div className="hidden md:flex items-center gap-8" onClick={()=>navigate("/additems")}>
          <motion.button
            whileHover={{ y: -2 }}
            className="flex items-center gap-2 text-gray-800 hover:text-[#ff4d2d] text-base font-semibold transition-all cursor-pointer " onClick={()=>navigate("/additems")}
          >
            <FaPlus className="text-[#ff4d2d]" /> Add Food Item
          </motion.button>

          <motion.button
            whileHover={{ y: -2 }}
            className="flex items-center gap-2 text-gray-800 hover:text-[#ff4d2d] text-base font-semibold transition-all cursor-pointer"
          >
            <FaListAlt className="text-[#ff4d2d]" /> My Food List
          </motion.button>

          <motion.button
            whileHover={{ y: -2 }}
            className="flex items-center gap-2 text-gray-800 hover:text-[#ff4d2d] text-base font-semibold transition-all cursor-pointer"
          >
            <FaChartLine className="text-[#ff4d2d]" /> Analytics
          </motion.button>
          <motion.button
            whileHover={{ y: -2 }}
            className="flex items-center gap-2 text-gray-800 hover:text-[#ff4d2d] text-base font-semibold transition-all cursor-pointer gap-5"
          >
            {" "}
            <button className="px-4 py-2 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] font-semibold hover:scale-110 hover:bg-[#ff4d2d]/20 transition-all duration-300" onClick={()=>navigate("/ownerorders")}>
              My Orders
              <span className="absolute -top-1 -right-1 bg-white text-[#ff4d2d] text-xs font-bold px-1.5 rounded-full shadow-md">
                
              </span>
            </button>
            <button className="text-orange-500 cursor-pointer">
              <IoMdCart size={27} />
            </button>
          </motion.button>
        </div>
      )}

      {/* Right Section */}
      <div className="flex items-center gap-5">
        {/* Profile Circle */}
        {userData?.User?.fullname && (
          <motion.div
            onClick={() => setShowMenu((prev) => !prev)}
            className="text-white bg-[#ff4d2d] font-semibold text-xl rounded-full h-12 w-12 flex items-center justify-center shadow-lg cursor-pointer select-none"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {userData.User.fullname.slice(0, 1).toUpperCase()}
          </motion.div>
        )} 

        {/* Mobile Menu Toggle */}
   { shopData &&   <div
          onClick={() => setShowMenu((prev) => !prev)}
          className="md:hidden flex flex-col gap-1.5 cursor-pointer"
        >
          <span className="w-6 h-0.5 bg-[#ff4d2d] rounded-full"></span>
          <span className="w-6 h-0.5 bg-[#ff4d2d] rounded-full"></span>
          <span className="w-6 h-0.5 bg-[#ff4d2d] rounded-full"></span>
        </div>}
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="absolute top-full left-0 w-full bg-white shadow-lg md:hidden flex flex-col items-start gap-4 px-6 py-5 border-t border-gray-100 backdrop-blur-xl"
          >
     { shopData &&     <button className="flex items-center gap-3 text-gray-700 hover:text-[#ff4d2d] font-semibold text-base"  onClick={()=>navigate("/additems")}>
              <FaPlus className="text-[#ff4d2d] cursor-pointer" /> Add Food Item
            </button> }
       { shopData &&      <button className="px-4 py-2 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] font-semibold hover:scale-110 hover:bg-[#ff4d2d]/20 transition-all duration-300" onClick={()=>navigate("/ownerorders")}>
              My Orders
            </button>}
        {shopData &&      <button className="text-orange-500 cursor-pointer">
              <IoMdCart size={27} />
              <span className="absolute -top-1 -right-1 bg-white text-[#ff4d2d] text-xl font-bold px-1.5 rounded-full shadow-md">
                3
              </span>
            </button>}

      { shopData &&     <button className="flex items-center gap-3 text-gray-700 hover:text-[#ff4d2d] font-semibold text-base">
              <FaListAlt className="text-[#ff4d2d]  cursor-pointer" /> My Food
              List
            </button>}

         {shopData &&   <button className="flex items-center gap-3 text-gray-700 hover:text-[#ff4d2d] font-semibold text-base">
              <FaChartLine className="text-[#ff4d2d] cursor-pointer" />{" "}
              Analytics
            </button>}
            {!shopData ?
                <button className="flex items-center gap-3 text-gray-700 hover:text-[#ff4d2d] font-semibold text-base cursor-pointer" onClick={()=>navigate("/createeditshop")}>
            
            
                <FaShop/>  <span>Add Shop</span>
            </button> : <span className="flex items-center gap-3 text-gray-700 hover:text-[#ff4d2d] font-semibold text-base cursor-pointer"         onClick={()=>navigate("/createeditshop")}>Edit Shop</span> }


            

            <hr className="w-full border-gray-200" />

            <button
              className="flex items-center gap-3 text-[#ff4d2d] font-semibold text-base"
              onClick={handlesignout}
            >
              <IoMdLogOut size={18} /> Log Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Profile Dropdown */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="hidden md:flex flex-col absolute top-[85px] right-10 w-[220px] bg-white/90 backdrop-blur-2xl shadow-xl rounded-2xl p-5 border border-gray-100"
          >
            <div className="font-bold text-gray-800 text-center">
              {userData.User.fullname.toUpperCase()}
            </div>
            <hr className="my-2 border-gray-200" />
            <button
              className="text-[#ff4d2d] font-semibold hover:text-gray-800 transition-all duration-200 flex items-center justify-center gap-2"
              onClick={handlesignout}
            >
              <IoMdLogOut /> Log Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default OwnerNav;
