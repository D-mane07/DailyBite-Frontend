import React from "react";
import { motion } from "framer-motion";

const CategoryCard = ({ data }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05, rotate: 0.3 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      className="relative w-[280px] sm:w-[340px] md:w-[380px] lg:w-[420px] h-[180px] rounded-3xl overflow-hidden bg-gradient-to-br from-gray-100 via-white to-gray-50 border border-[#ff4d2d]/20 shadow-md hover:shadow-2xl hover:shadow-[#ff4d2d]/40 transition-all duration-500 cursor-pointer group"
    >
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full overflow-hidden rounded-3xl">
        <img
          src={data.image}
          alt={data.category}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-hover:rotate-1"
        />
        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent group-hover:from-[#ff4d2d]/40 group-hover:via-black/5 group-hover:to-transparent transition-all duration-700"></div>
      </div>

      {/* Glassy Top Highlight */}
      <div className="absolute top-0 left-0 right-0 h-[35%] bg-gradient-to-b from-white/40 to-transparent opacity-70 pointer-events-none rounded-t-3xl"></div>

      {/* Category Name */}
      <div className="absolute bottom-5 left-5 right-5 text-center">
        <h2 className="text-white font-extrabold text-lg md:text-xl lg:text-2xl drop-shadow-lg tracking-wide capitalize">
          {data.category}
        </h2>
      </div>

      {/* Bottom Neon Glow */}
      <div className="absolute bottom-0 left-0 w-full h-[5px] bg-gradient-to-r from-[#ff4d2d] via-pink-500 to-orange-400 rounded-t-full opacity-80 group-hover:opacity-100 blur-[1.5px] transition-all duration-500"></div>

      {/* Optional floating badge */}
      {data.isFeatured && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileHover={{ opacity: 1, y: 0 }}
          className="absolute top-3 right-3 bg-white/30 backdrop-blur-lg text-[#ff4d2d] font-bold text-xs md:text-sm px-3 py-1 rounded-full shadow-md border border-[#ff4d2d]/40"
        >
          Featured
        </motion.div>
      )}
    </motion.div>
  );
};

export default CategoryCard;
