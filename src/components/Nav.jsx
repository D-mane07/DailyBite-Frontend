import React, { useCallback, useEffect, useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { IoMdCart } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { serverurl } from "../App";
import axios from "axios";
import { setSerachItems, setUserData } from "../pages/redux/UserSlice";
import { useNavigate } from "react-router-dom";

const Nav = () => {
  const { userData, currentcity, cartitems } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [showInfo, setShowInfo] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolling(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignout = async () => {
    try {
      await axios.get(`${serverurl}/user/logout`, { withCredentials: true });
      localStorage.removeItem("vingo_auth_token");
      dispatch(setUserData(null));
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  const handleSearchItems = useCallback(async () => {
    if (!query?.trim()) {
      dispatch(setSerachItems(null));
      return;
    }

    if (!currentcity?.trim()) {
      dispatch(setSerachItems([]));
      return;
    }

    try {
      const res = await axios.get(`${serverurl}/item/searchitems`, {
        params: { query: query.trim(), city: currentcity },
        withCredentials: true,
      });

      if (res?.data?.success) {
        dispatch(setSerachItems(res.data.items ?? []));
      } else {
        dispatch(setSerachItems([]));
      }
    } catch (err) {
      console.error("Error fetching search results:", err?.response?.data?.message || err.message);
      dispatch(setSerachItems(null));
    }
  }, [currentcity, dispatch, query]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query?.trim() && currentcity?.trim()) {
        handleSearchItems();
      } else {
        dispatch(setSerachItems(null));
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [currentcity, dispatch, handleSearchItems, query]);

  return (
    <motion.nav
      className={`fixed top-0 left-0 w-full z-[9999] px-6 md:px-12 flex items-center justify-between transition-all duration-500 ${
        scrolling
          ? "bg-white/80 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.08)]"
          : "bg-gradient-to-r from-[#fff7f4] via-[#fff3ee] to-[#fff0eb]"
      }`}
      style={{ height: "85px" }}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
    >
      <motion.h1
        className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#ff4d2d] cursor-pointer select-none"
        whileHover={{ scale: 1.08 }}
        transition={{ type: "spring", stiffness: 250, damping: 12 }}
      >
        Vingo
      </motion.h1>

      <motion.div
        className="hidden md:flex items-center bg-white rounded-full shadow-sm px-5 py-3 w-1/2 lg:w-1/3 focus-within:shadow-lg transition-all duration-300"
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex items-center gap-2 pr-3 border-r border-gray-200">
          <FaLocationDot size={20} className="text-[#ff4d2d]" />
          <span className="text-sm md:text-base font-semibold text-gray-700 hover:text-[#ff4d2d] cursor-pointer transition-colors">
            {currentcity || "Your City .."}
          </span>
        </div>

        <div className="flex items-center flex-grow pl-3 gap-2">
          <FaSearch size={18} className="text-gray-500" onClick={handleSearchItems} />
          <input
            type="text"
            placeholder="Search delicious food..."
            className="w-full text-gray-700 placeholder-gray-400 focus:outline-none bg-transparent text-sm md:text-base"
            onChange={(e) => setQuery(e.target.value)}
            value={query}
          />
        </div>
      </motion.div>

      <div className="flex items-center gap-4 md:gap-6">
        <motion.button
          className="relative p-2.5 bg-[#ff4d2d] rounded-full text-white shadow-lg hover:shadow-xl hover:bg-[#ff684b] transition-all duration-300"
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.12 }}
        >
          <IoMdCart size={23} onClick={() => navigate("/cartitem")} />
          <span className="absolute -top-1 -right-1 bg-white text-[#ff4d2d] text-xs font-bold px-1.5 rounded-full shadow-md">
            {cartitems?.length ?? 0}
          </span>
        </motion.button>

        <FaSearch
          size={24}
          className="md:hidden text-[#ff4d2d] hover:text-[#ff684b] cursor-pointer transition-colors"
          onClick={() => setShowSearch((prev) => !prev)}
        />

        <motion.button
          onClick={() => navigate("/userorders")}
          className="hidden md:block px-4 py-2 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] font-semibold hover:scale-110 hover:bg-[#ff4d2d]/20 transition-all duration-300"
          whileHover={{ y: -2 }}
        >
          My Orders
        </motion.button>

        {userData?.User?.fullname && (
          <motion.div
            onClick={() => setShowInfo((prev) => !prev)}
            className="text-white bg-[#ff4d2d] font-semibold text-xl rounded-full h-12 w-12 flex items-center justify-center shadow-lg cursor-pointer select-none"
            whileHover={{ scale: 1.12, rotate: 1 }}
            whileTap={{ scale: 0.9 }}
          >
            {userData.User.fullname.slice(0, 1).toUpperCase()}
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute top-full left-0 w-full bg-white shadow-md py-3 px-5 flex items-center gap-3 md:hidden backdrop-blur-2xl"
          >
            <FaSearch size={20} className="text-gray-500" onClick={handleSearchItems} />
            <input
              type="text"
              placeholder="Search something tasty..."
              className="w-full text-gray-700 placeholder-gray-400 focus:outline-none bg-transparent"
              onChange={(e) => setQuery(e.target.value)}
              value={query}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
            className="fixed top-[95px] right-4 md:right-10 w-[220px] bg-white/90 backdrop-blur-2xl shadow-2xl rounded-2xl p-5 flex flex-col gap-3 border border-gray-100"
          >
            <div className="font-bold text-gray-800 hover:text-[#ff4d2d] cursor-pointer transition-colors">
              {userData.User.fullname.toUpperCase()}
            </div>

            <button
              className="md:hidden px-3 py-2 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] font-semibold hover:scale-105 transition-all duration-300"
              onClick={() => navigate("/userorders")}
            >
              My Orders
            </button>

            <button
              className="text-[#ff4d2d] font-bold hover:text-gray-800 transition-all duration-300"
              onClick={handleSignout}
            >
              Log Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Nav;
