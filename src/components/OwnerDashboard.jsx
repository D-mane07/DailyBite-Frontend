import React from "react";
import OwnerNav from "./OwnerNav";
import { useDispatch, useSelector } from "react-redux";
import { FaUtensils, FaEdit, FaBoxOpen, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import UseGetCurrentShop from "../Hooks/Usegetmyshop";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import { serverurl } from "../App";
import { setShopData } from "../pages/redux/OwnerSlice";
import Footer from "./Footer";
const OwnerDashboard = () => {
  const { shopData } = useSelector((state) => state.owner);
  const navigate = useNavigate();
     const dispatch=useDispatch()
  // fetch shop + items on mount
  UseGetCurrentShop();
const handledelete = async (itemId, setItems) => {
  try {
    // 🔹 step 1: confirm delete
    const confirmdelete = window.confirm("are you sure you want to delete this item?");
    if (!confirmdelete) return;

    // 🔹 step 2: show temporary feedback (optional)
    alert("please wait, deleting item...");

    // 🔹 step 3: send delete request
    const response = await axios.delete(`${serverurl}/item/deleteitem/${itemId}`, {
      withCredentials: true,
    });

    // 🔹 step 4: handle success
    if ( response.data.success) {
      alert("item deleted successfully ✅");
       dispatch(setShopData(response.data.shop))
      // remove from ui instantly if setItems provided
      if (typeof setItems === "function") {
        setItems((prev) => prev.filter((i) => i._id !== itemId));
      } else {
        // fallback: reload page to update ui
        setTimeout(() => window.location.reload(), 1000);
      }
    } else {
      alert(response?.data?.message || "something went wrong, please try again.");
    }
  } catch (error) {
    console.error("delete error:", error);
  if (error.code === "ERR_NETWORK") {
    console.log("❌ Network Error - cannot reach backend");
  } else {
    console.log("🔻 Axios Error Details:", error);
  }
    // 🔹 step 5: handle error cleanly
    if (error.response) {
      console.log("response data:", error.response.data);
      console.log("response status:", error.response.status);
      console.log("response headers:", error.response.headers);
      alert(error.response.data.message || "server responded with an error.");
    } else if (error.request) {
      console.log("request error:", error.request);
      alert("no response from server. please check your internet.");
    } else {
      console.log("error message:", error.message);
      alert("unexpected error occurred while deleting the item.");
    }
  }
};


  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-[#fff9f6]">
      <OwnerNav />

      {/* Shop Info */}
      {shopData && (
        <div className="w-full flex flex-col items-center gap-6 px-4 sm:px-6 font-bold text-[#ff4d2d] py-10 bg-gradient-to-b from-orange-50 to-white">
          <h1 className="  mt-14     text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#ff4d2d] to-[#ff8b5c] tracking-wide drop-shadow-md">
            Welcome to{" "}
            {shopData?.name?.charAt(0).toUpperCase() + shopData?.name?.slice(1)}
          </h1>

          <div className="bg-[#ff4d2d]/20 rounded-full h-20 w-20 flex justify-center items-center hover:scale-110 transition-all duration-300 cursor-pointer shadow-md hover:shadow-xl">
            <FaUtensils size={40} className="text-[#ff4d2d]" />
          </div>

          <div className="bg-white shadow-lg hover:shadow-2xl rounded-3xl overflow-hidden border border-orange-100 transition-all duration-300 w-full max-w-3xl relative">
            <img
              src={shopData?.image}
              alt="shopimage"
              className="w-full h-56 sm:h-72 object-cover hover:scale-105 transition-transform duration-500"
            />
            <div
              className="absolute top-4 right-4 bg-white/70 backdrop-blur-sm p-2 rounded-full hover:bg-[#ff4d2d] hover:text-white transition-all duration-300 shadow-md cursor-pointer"
              onClick={() => navigate("/createeditshop")}
            >
              <FaEdit size={24} />
            </div>
          </div>

          <div className="flex flex-col gap-2 text-gray-800">
            <h2 className="font-bold text-3xl">
              {shopData?.name?.charAt(0).toUpperCase() +
                shopData?.name?.slice(1)}
            </h2>
            <p className="font-semibold text-md">{shopData?.city}</p>
            <p className="font-semibold text-md">{shopData?.state}</p>
            <p className="font-semibold text-md">{shopData?.address}</p>
          </div>
        </div>
      )}

      {/* Items */}
      {!shopData?.items || shopData.items.length === 0 ? (
        <div className="w-full flex flex-col items-center justify-center text-center py-16 px-6 bg-gradient-to-b from-orange-50 to-white rounded-3xl shadow-inner mt-6">
          <div className="bg-[#ff4d2d]/15 p-8 rounded-full shadow-md mb-6 flex justify-center items-center transition-transform duration-500 hover:scale-110">
            <FaBoxOpen size={70} className="text-[#ff4d2d]" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#ff4d2d] mb-2">
            No Items Yet
          </h2>
          <p className="text-gray-600 max-w-md mb-6">
            Looks like your shop is empty! Start adding your delicious food
            items 🍔✨
          </p>
          <button
            onClick={() => navigate("/additems")}
            className="flex items-center gap-2 bg-[#ff4d2d] text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-xl hover:bg-[#ff3b18] transition-all duration-300"
          >
            <FaPlus /> Add Your First Item
          </button>
        </div>
      ) : (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 px-4 sm:px-6">
          {shopData.items.map((item) => (
            <div
              key={item._id}
              className="relative bg-gradient-to-b from-white to-[#fff0eb] rounded-2xl shadow-lg p-4 overflow-hidden group hover:shadow-2xl transition-all duration-500"
            >
              {/* Image with hover zoom */}
              <div className="overflow-hidden rounded-xl">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-40 object-cover rounded-xl transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <h3 className="font-extrabold text-[#ff4d2d] text-lg mt-3 group-hover:text-[#ff6a45] transition-colors duration-300">
                {item.name}
              </h3>
              <p className="text-gray-500 text-sm">
                {item.category} • {item.foodtype}
              </p>
              <p className="text-black font-semibold mt-2 text-lg">
                $ {item.price}
              </p>

              {/* Edit button */}
              <div
                className="absolute top-4 right-4 z-10 bg-white/70 backdrop-blur-sm p-3 rounded-full shadow-md cursor-pointer hover:bg-[#ff4d2d] hover:text-white transition-all duration-300 flex items-center justify-center"
                onClick={() => navigate(`/edititem/${item._id}`)}
              >
                <FaEdit size={24} />
              </div>
              <div
                className="absolute bottom-3  right-7 z-10 bg-white/70 backdrop-blur-sm p-3 rounded-full shadow-md cursor-pointer hover:bg-[#ff4d2d] hover:text-white transition-all duration-300 flex items-center justify-center"
               onClick={() => handledelete(item._id)}
              >
                <MdDelete size={24} />
              </div>

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#ff4d2d]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"></div>
            </div>
          ))}
        </div>
      )}
      <Footer/>
    </div>
  );
};

export default OwnerDashboard;
