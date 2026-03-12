import React from "react";
import { useSelector } from "react-redux";
import CartCard from "../components/CartCard";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const cartitems = useSelector((state) => state.user.cartitems);
    const {userData} = useSelector((state) => state.user);
  const {totalamount}=useSelector((state)=>state.user)
   const navigate=useNavigate()
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#f9fafc] via-[#f1f5f9] to-[#e5e7eb] p-6 md:p-10">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-extrabold text-gray-800 text-center mb-10"
      >
        🛍️ {userData.User.fullname}
      </motion.h1>

      <div className="max-w-4xl mx-auto flex flex-col gap-5">
        <AnimatePresence>
          {cartitems.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center text-gray-500 text-xl mt-20"
            >
              Your cart is empty 😢 <br /> Go add some delicious food!
            </motion.div>
          ) : (
            cartitems.map((data) => (
              <motion.div
                key={data.id}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <CartCard data={data} />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {cartitems.length > 0 && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-md shadow-lg border-t border-gray-200 p-5 flex justify-between items-center"
        >
          <div>
            <p className="text-gray-600 text-sm">Total Price</p>
            <h2 className="text-2xl font-bold text-gray-800">$ {totalamount}</h2>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={()=>navigate("/checkout")}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-2xl font-semibold shadow-md hover:shadow-lg transition-all"
          >
            Checkout
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default CartPage;
