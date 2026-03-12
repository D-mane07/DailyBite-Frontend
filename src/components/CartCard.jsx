import React from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { RemoveItem, Updatquantity } from "../pages/redux/UserSlice";
import { motion } from "framer-motion";
import { FaTrashAlt } from "react-icons/fa";
const CartCard = ({ data }) => {
  const dispatch = useDispatch();

  const handledecrease = (id, currentqty) => {
    dispatch(Updatquantity({ id, quantity: Math.max(1, currentqty - 1) }));
  };
  const handleincrease = (id, currentqty) => {
    dispatch(Updatquantity({ id, quantity: currentqty + 1 }));
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-md hover:shadow-xl transition-all"
    >
      <div className="flex items-center gap-4">
        <motion.img
          whileHover={{ rotate: 2, scale: 1.05 }}
          src={data.image}
          alt="food"
          className="w-20 h-20 object-cover rounded-xl border"
        />
        <div>
          <h1 className="font-semibold text-gray-800 text-lg">{data.name}</h1>
          <p className="text-gray-500 text-sm">
            ${data.price} × {data.quantity}
          </p>
          <p className="font-bold text-gray-700 mt-1">
            Total: ${data.price * data.quantity}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => handledecrease(data.id, data.quantity)}
          className="p-2 rounded-full bg-red-500/30 hover:bg-red-500/60 transition-all"
        >
          <FaMinus className="text-white text-sm" />
        </motion.button>
        <motion.span
          key={data.quantity}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="mx-2 text-black font-bold text-lg"
        >
          {data.quantity}
        </motion.span>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => handleincrease(data.id, data.quantity)}
          className="p-2 rounded-full bg-green-500/30 hover:bg-green-500/60 transition-all"
        >
          <FaPlus className="text-white text-sm" />
        </motion.button>
                <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => dispatch(RemoveItem({id:data.id }))}
          className="p-2 rounded-full bg-red-500/30 hover:bg--500/60 transition-all"
        >
          <FaTrashAlt className="text-white text-sm" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default CartCard;
