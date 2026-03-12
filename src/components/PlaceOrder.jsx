import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MdCheckCircle, MdDeliveryDining } from "react-icons/md";
import { FaArrowRight } from "react-icons/fa";

const PlaceOrder = () => {
  const [countdown, setCountdown] = useState(10);
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 🌈 Dreamy background animation */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-[#ffecd2] via-[#fcb69f] to-[#ff9a9e]"
        animate={{
          background: [
            "linear-gradient(to bottom right,#ffecd2,#fcb69f,#ff9a9e)",
            "linear-gradient(to bottom right,#a1c4fd,#c2e9fb,#ffdde1)",
            "linear-gradient(to bottom right,#f6d365,#fda085,#fbc2eb)",
          ],
        }}
        transition={{ duration: 18, repeat: Infinity, repeatType: "mirror" }}
      />

      {/* ✨ Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="z-10 w-[90%] max-w-[800px] bg-white/40 backdrop-blur-3xl rounded-[2.5rem] p-10 border border-white/40 shadow-[0_0_60px_rgba(255,77,45,0.4)] text-center space-y-10"
      >
        {/* ✅ Success icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 10 }}
          className="flex justify-center"
        >
          <MdCheckCircle className="text-green-500" size={90} />
        </motion.div>

        {/* 🧾 Success text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-4xl font-extrabold text-gray-800 drop-shadow-lg">
            Order Placed Successfully 🎉
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Your delicious food is being prepared with love 💖
          </p>
        </motion.div>

        {/* 🚚 Delivery animation */}
        <motion.div
          initial={{ x: "-120%" }}
          animate={{ x: "120%" }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          className="relative flex justify-center mt-8"
        >
          <MdDeliveryDining size={80} className="text-[#ff4d2d] drop-shadow-lg" />
        </motion.div>

        {/* 🧠 Order Details */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <div className="text-left space-y-3">
            <p className="text-gray-700 text-lg">
              <span className="font-semibold text-[#ff4d2d]">Order ID:</span>{" "}
              #VNGO-{Math.floor(Math.random() * 1000000)}
            </p>
            <p className="text-gray-700 text-lg">
              <span className="font-semibold text-[#ff4d2d]">Payment:</span>{" "}
              Cash on Delivery
            </p>
            <p className="text-gray-700 text-lg">
              <span className="font-semibold text-[#ff4d2d]">Delivery:</span>{" "}
              25–35 mins (approx)
            </p>
            <p className="text-gray-700 text-lg">
              <span className="font-semibold text-[#ff4d2d]">Address:</span>{" "}
              Your selected delivery address
            </p>


      
          </div>
        </motion.div>

        {/* ⏳ Countdown redirect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex flex-col items-center justify-center"
        >
          <p className="text-gray-600 text-sm">
            Redirecting to home in{" "}
            <span className="text-[#ff4d2d] font-bold">{countdown}</span> seconds...
          </p>

          <motion.a
            whileHover={{ scale: 1.05 }}
            href="/"
            className="mt-4 flex items-center gap-2 bg-gradient-to-r from-[#ff4d2d] to-[#ff9a9e] text-white px-6 py-3 rounded-full font-semibold text-lg shadow-[0_0_25px_rgba(255,77,45,0.4)]"
          >
            Go to Home <FaArrowRight />
          </motion.a>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PlaceOrder;
