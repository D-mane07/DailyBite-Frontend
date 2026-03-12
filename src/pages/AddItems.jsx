import React, { useState, useRef } from "react";
import axios from "axios";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { serverurl } from "../App";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

const AddItems = () => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    foodtype: "",
    price: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { shopData } = useSelector((state) => state.owner);
  const { userData } = useSelector((state) => state.user);

  const categories = [
    "Starter", "Main-Course", "Desserts", "Beverage", "Snacks", "Salads",
    "Sides", "Appetizer", "Soup", "Bread", "Rice", "Pasta", "Seafood",
    "Vegan", "Vegetarian", "Glutenfree", "Breakfast", "Pizzas", "Burgers",
    "Sandwiches", "Wrap", "Drink", "Fast Food", "South Indian", "North Indian",
    "Chinese", "Continental", "Italian", "Mexican", "Japanese", "Bangladeshi",
    "Non-Vegetarian", "Chicken", "Beef", "Mutton", "Others", "Biryani", "Ramen", "All"
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleBoxClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userData?.User?.role !== "owner") {
      alert("Only owners can add items.");
      navigate("/");
      return;
    }

    if (!shopData?._id) {
      alert("Create your shop first before adding items.");
      navigate("/createeditshop");
      return;
    }

    try {
      setLoading(true);
      const form = new FormData();
      form.append("name", formData.name);
      form.append("category", formData.category);
      form.append("foodtype", formData.foodtype);
      form.append("price", formData.price);
      if (image) form.append("image", image);

      const res = await axios.post(`${serverurl}/item/additem`, form, {
        withCredentials: true,
      });

      if (res.data.success) {
        alert("Item added successfully");
        navigate("/");
      }
    } catch (error) {
      alert(error?.response?.data?.message || "Error adding item");
      console.log(error.response?.data, error.response?.message, error.response?.status);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-gradient-to-br from-orange-50 via-white to-orange-100 py-10 px-4">
      <motion.div 
        initial={{ opacity: 0, y: -50 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl p-8 flex flex-col gap-6 border border-orange-100"
      >
        <motion.h1 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-3xl font-extrabold text-center text-[#ff4d2d] drop-shadow-sm"
        >
          🍔 Add New Food Item
        </motion.h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* item name */}
          <motion.div whileFocus={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
            <label className="text-gray-700 font-semibold">Item Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter food name..."
              className="w-full border rounded-xl p-3 mt-1 focus:ring-2 focus:ring-[#ff4d2d]/60 outline-none transition-transform duration-200"
            />
          </motion.div>

          {/* category */}
          <motion.div whileFocus={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
            <label className="text-gray-700 font-semibold">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full border rounded-xl p-3 mt-1 focus:ring-2 focus:ring-[#ff4d2d]/60 outline-none transition-transform duration-200"
            >
              <option value="">Select Category</option>
              {categories.map((cat, i) => (
                <option key={i} value={cat}>{cat}</option>
              ))}
            </select>
          </motion.div>

          {/* food type */}
          <motion.div whileFocus={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
            <label className="text-gray-700 font-semibold">Food Type</label>
            <select
              name="foodtype"
              value={formData.foodtype}
              onChange={handleChange}
              required
              className="w-full border rounded-xl p-3 mt-1 focus:ring-2 focus:ring-[#ff4d2d]/60 outline-none transition-transform duration-200"
            >
              <option value="">Select Type</option>
              <option value="veg">Veg</option>
              <option value="non-veg">Non-Veg</option>
            </select>
          </motion.div>

          {/* price */}
          <motion.div whileFocus={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
            <label className="text-gray-700 font-semibold">Price (৳)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              placeholder="Enter price..."
              className="w-full border rounded-xl p-3 mt-1 focus:ring-2 focus:ring-[#ff4d2d]/60 outline-none transition-transform duration-200"
            />
          </motion.div>

          {/* image upload */}
          <motion.div 
            onClick={handleBoxClick} 
            whileHover={{ scale: 1.03 }} 
            whileTap={{ scale: 0.97 }} 
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center justify-center border-2 border-dashed border-[#ff4d2d]/50 rounded-2xl py-6 hover:bg-orange-50 cursor-pointer transition-all"
          >
            {preview ? (
              <motion.img
                src={preview}
                alt="preview"
                className="w-32 h-32 object-cover rounded-xl mb-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            ) : (
              <FaCloudUploadAlt size={50} className="text-[#ff4d2d] mb-2" />
            )}
            <span className="font-semibold text-[#ff4d2d]">Upload Image</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
              className="hidden"
            />
          </motion.div>

          {/* submit button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={!loading ? { scale: 1.02 } : {}}
            whileTap={!loading ? { scale: 0.97 } : {}}
            className={`mt-4 bg-[#ff4d2d] text-white font-semibold py-3 rounded-xl transition-all duration-300 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Uploading..." : "Add Item"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddItems;

