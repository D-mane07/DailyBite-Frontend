import React from "react";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaStar } from "react-icons/fa";

const Shopcard = ({ data }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.06, rotate: 0.5 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      className="relative w-[340px] sm:w-[400px] md:w-[460px] lg:w-[520px] h-[240px] rounded-3xl overflow-hidden bg-gradient-to-br from-gray-100 via-white to-gray-50 border border-[#ff4d2d]/20 shadow-lg hover:shadow-2xl hover:shadow-[#ff4d2d]/50 transition-all duration-500 cursor-pointer group"
    >
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full overflow-hidden rounded-3xl">
        <img
          src={data.image}
          alt={data.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-hover:rotate-1"
        />
        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-[#ff4d2d]/50 group-hover:via-black/10 group-hover:to-transparent transition-all duration-700"></div>
      </div>

      {/* Glassy Top Reflection */}
      <div className="absolute top-0 left-0 right-0 h-[35%] bg-gradient-to-b from-white/40 to-transparent opacity-70 pointer-events-none rounded-t-3xl"></div>

      {/* Shop Info */}
      <div className="absolute bottom-16 left-5 right-5 flex flex-col gap-2 items-start">
        <h2 className="text-white font-extrabold text-xl md:text-2xl lg:text-3xl drop-shadow-lg tracking-wide capitalize">
          {data.name}
        </h2>

        <div className="flex items-center gap-2 text-gray-200 text-sm md:text-base">
          <FaMapMarkerAlt className="text-[#ff4d2d]" />
          <span className="drop-shadow-md">
            {data.address}, {data.city}, {data.state}
          </span>
        </div>

        {/* Optional rating / premium badge */}
      
      </div>

      {/* Bottom Neon Glow */}
      <div className="absolute bottom-0 left-0 w-full h-[6px] rounded-t-full bg-gradient-to-r from-[#ff4d2d] via-pink-500 to-orange-400 opacity-80 group-hover:opacity-100 blur-[1.5px] transition-all duration-500"></div>

      {/* Floating Glass Badge */}
      {data.isPremium && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileHover={{ opacity: 1, y: 0 }}
          className="absolute top-3 right-3 bg-white/30 backdrop-blur-lg text-[#ff4d2d] font-bold text-xs md:text-sm px-3 py-1 rounded-full shadow-md border border-[#ff4d2d]/40"
        >
          Premium
        </motion.div>
      )}

      {/* Optional animated sparkle / highlight */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        animate={{ opacity: [0.2, 0.1, 0.2] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.div>
  );
};

export default Shopcard;
