import React, { useState } from "react";
import axios from "axios";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { serverurl } from "../App";

const EditItems = () => {
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
    const { itemId } = useParams();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const form = new FormData();
      form.append("name", formData.name);
      form.append("category", formData.category);
      form.append("foodtype", formData.foodtype);
      form.append("price", formData.price);
      if (image) form.append("image", image);

    const res = await axios.put(`${serverurl}/item/edititem/${itemId}`, form, {
  withCredentials: true,
});

      

      if (res.data.success) {
        alert("✅ Item updated successfully!");
        navigate("/");
      }
    } catch (error) {
  setLoading(false);

  // Print full error
  console.error("Full error object:", error);

  // Print server response if available
  if (error.response) {
    console.error("Server response:", error.response.data);
    console.error("Status code:", error.response.status);
    console.error("Headers:", error.response.headers);
  } else if (error.request) {
    console.error("No response received, request was:", error.request);
  } else {
    console.error("Error setting up request:", error.message);
  }

  alert("❌ Error updating item. Check console for details.");
}
 finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-gradient-to-br from-orange-50 via-white to-orange-100 py-10 px-4">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl p-8 flex flex-col gap-6 border border-orange-100">
        <h1 className="text-3xl font-extrabold text-center text-[#ff4d2d] drop-shadow-sm">
          🍔 Edit Food Item
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* item name */}
          <div>
            <label className="text-gray-700 font-semibold">Item Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter food name..."
              className="w-full border rounded-xl p-3 mt-1 focus:ring-2 focus:ring-[#ff4d2d]/60 outline-none"
            />
          </div>

          {/* category */}
          <div>
            <label className="text-gray-700 font-semibold">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full border rounded-xl p-3 mt-1 focus:ring-2 focus:ring-[#ff4d2d]/60 outline-none"
            >
              <option value="">Select Category</option>
              {categories.map((cat, i) => (
                <option key={i} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* food type */}
          <div>
            <label className="text-gray-700 font-semibold">Food Type</label>
            <select
              name="foodtype"
              value={formData.foodtype}
              onChange={handleChange}
              required
              className="w-full border rounded-xl p-3 mt-1 focus:ring-2 focus:ring-[#ff4d2d]/60 outline-none"
            >
              <option value="">Select Type</option>
              <option value="veg">Veg</option>
              <option value="non-veg">Non-Veg</option>
            </select>
          </div>

          {/* price */}
          <div>
            <label className="text-gray-700 font-semibold">Price ($)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              placeholder="Enter price..."
              className="w-full border rounded-xl p-3 mt-1 focus:ring-2 focus:ring-[#ff4d2d]/60 outline-none"
            />
          </div>

          {/* image upload */}
       <div className="relative flex flex-col items-center justify-center border-2 border-dashed border-[#ff4d2d]/50 rounded-2xl py-6 hover:bg-orange-50 transition-all cursor-pointer">
  {preview ? (
    <img
      src={preview}
      alt="preview"
      className="w-32 h-32 object-cover rounded-xl mb-3"
    />
  ) : (
    <FaCloudUploadAlt size={50} className="text-[#ff4d2d] mb-2" />
  )}

  <input
    type="file"
    accept="image/*"
    onChange={handleImageChange}
    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
  />
  <span className="font-semibold text-[#ff4d2d] mt-2">Upload Image</span>
</div>

          {/* submit button */}
          <button
            type="submit"
            disabled={loading}
            className={`mt-4 bg-[#ff4d2d] text-white font-semibold py-3 rounded-xl hover:bg-[#ff3b18] transition-all duration-300 ${
              loading ? "opacity-70 cursor-not-allowed" : "hover:scale-[1.02]"
            }`}
          >
            {loading ? "Uploading..." : "Edit Item"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditItems;
