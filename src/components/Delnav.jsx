import React, { useState, useEffect } from "react";
import { FaMotorcycle, FaMapMarkedAlt } from "react-icons/fa";
import { MdDeliveryDining } from "react-icons/md";
import { IoMdNotifications } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverurl } from "../App";
import { useSelector, useDispatch } from "react-redux";
import { setUserData } from "../pages/redux/UserSlice";
// import { setOwnerData } from "../redux/DeliverySlice"; // add if you have it

const Delnav = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [scrolling, setScrolling] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    const handleScroll = () => setScrolling(window.scrollY > 20);
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
      className={`fixed top-0 left-0 w-full z-[9999] px-6 md:px-12 flex items-center justify-between transition-all duration-500 ${
        scrolling
          ? "bg-white/95 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.08)]"
          : "bg-gradient-to-r from-[#ff6a00] via-[#ff7d1a] to-[#ff9100]"
      }`}
      style={{ height: "80px" }}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
    >
      {/* Logo */}
      <motion.h1
        className={`text-3xl md:text-4xl font-extrabold tracking-tight ${
          scrolling ? "text-[#ff6a00]" : "text-white"
        } cursor-pointer select-none`}
        whileHover={{ scale: 1.08 }}
        onClick={() => navigate("/")}
      >
        Vingo<span className="text-white">Rider</span>
      </motion.h1>

      {/* Search (Desktop) */}
      <motion.div
        className={`hidden md:flex items-center bg-white rounded-full shadow-sm px-5 py-3 w-1/3 focus-within:shadow-lg transition-all duration-300`}
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex items-center flex-grow gap-2">
          <FaSearch size={18} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search delivery zones or orders..."
            className="w-full text-gray-700 placeholder-gray-400 focus:outline-none bg-transparent text-sm md:text-base"
          />
        </div>
      </motion.div>

      {/* Right side */}
      <div className="flex items-center gap-4 md:gap-6">
        {/* Orders button */}
        <motion.button
          onClick={() => navigate("/delorders")}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-[#ff6a00] font-semibold shadow-lg hover:bg-[#fff5f0] hover:scale-105 transition-all duration-300"
          whileTap={{ scale: 0.92 }}
        >
          <MdDeliveryDining size={20} />
          My Deliveries
        </motion.button>

        {/* Map icon */}
        <motion.button
          onClick={() => navigate("/delmap")}
          className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-[#ffffff22] text-white font-semibold hover:bg-[#ffffff33] hover:scale-105 transition-all duration-300"
          whileHover={{ y: -2 }}
        >
          <FaMapMarkedAlt size={18} />
          Map
        </motion.button>

        {/* Notifications */}
        <motion.div
          className="relative bg-white p-2.5 rounded-full text-[#ff6a00] shadow-lg cursor-pointer hover:bg-[#fff5f0] transition-all duration-300"
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.12 }}
          onClick={() => navigate("/delnotify")}
        >
          <IoMdNotifications size={22} />
          <span className="absolute -top-1 -right-1 bg-[#ff6a00] text-white text-xs font-bold px-1.5 rounded-full shadow-md">
            3
          </span>
        </motion.div>

        {/* Mobile Search Icon */}
        <FaSearch
          size={24}
          className={`md:hidden cursor-pointer ${
            scrolling ? "text-[#ff6a00]" : "text-white"
          } hover:opacity-80 transition-all`}
          onClick={() => setShowSearch((prev) => !prev)}
        />

        {/* Profile */}
        {userData?.User?.fullname && (
          <motion.div
            onClick={() => setShowInfo((prev) => !prev)}
            className="text-[#ff6a00] bg-white font-bold text-xl rounded-full h-11 w-11 flex items-center justify-center shadow-lg cursor-pointer select-none"
            whileHover={{ scale: 1.12, rotate: 1 }}
            whileTap={{ scale: 0.9 }}
          >
            {userData?.User?.fullname.slice(0, 1).toUpperCase()}
          </motion.div>
        )}
      </div>

      {/* Mobile Search */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute top-full left-0 w-full bg-white shadow-md py-3 px-5 flex items-center gap-3 md:hidden backdrop-blur-2xl"
          >
            <FaSearch size={20} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search delivery tasks..."
              className="w-full text-gray-700 placeholder-gray-400 focus:outline-none bg-transparent"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Dropdown */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
            className="fixed top-[90px] right-4 md:right-10 w-[220px] bg-white/95 backdrop-blur-2xl shadow-2xl rounded-2xl p-5 flex flex-col gap-3 border border-[#ff6a00]/20"
          >
            <div className="font-bold text-[#ff6a00]">
              {userData?.User?.fullname}
            </div>

            <button
              className="px-3 py-2 rounded-lg bg-[#ff6a00]/10 text-[#ff6a00] font-semibold hover:scale-105 transition-all duration-300"
              onClick={() => navigate("/delorders")}
            >
              My Deliveries
            </button>

            <button
              className="text-[#ff6a00] font-bold hover:text-gray-800 transition-all duration-300"
              onClick={handlesignout}
            >
              Log Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Delnav;
