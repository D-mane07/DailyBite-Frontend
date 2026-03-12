import axios from "axios";
import React, { useState } from "react";
import { serverurl } from "../App";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaUtensils } from "react-icons/fa";
import { setShopData } from "./redux/OwnerSlice";

const Createeditshop = () => {
  const navigate = useNavigate();
  const { shopData } = useSelector((state) => state.owner);
  const {currentcity,currentstate,currentaddress}=useSelector((state)=>state.user)
const[name,setname]=useState(shopData?.name ||"")
const[state,setstate]=useState(shopData?.state || currentstate)
const[city,setcity]=useState(shopData?.city ||currentcity)
const[address,setaddress]=useState(shopData?.address ||currentaddress)

const[frontendimage,setfrontendimage]=useState(shopData?.image ||"")
const[backendimage,setbackendimage]=useState(null)
const handleimage=(e)=>{


  const file=e.target.files[0]
  setbackendimage(file

  )
setfrontendimage(URL.createObjectURL(file))
}

const dispatch=useDispatch()
const handlecreateditshop = async (e) => {
  e.preventDefault();
  try {
    const formdata = new FormData();
    formdata.append("name", name);
    formdata.append("state", state);
    formdata.append("city", city);
    formdata.append("address", address);
    if (backendimage) formdata.append("image", backendimage);

    const result = await axios.post(
      `${serverurl}/shop/createeditshop`,
      formdata,
      { withCredentials: true }
    );

    if (result.data.success) {
      shopData
        ? alert("Shop Updated successfully")
        : alert("Shop created successfully");
        console.log("shop data set:", result.data);

      dispatch(setShopData(result.data.shop));
      navigate("/");
    }
  } catch (error) {
    console.log(error.response?.data || error.message);
  }
};

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-orange-100 via-white to-orange-50 px-5">
      
      {/* back button */}
      <div className="absolute top-6 left-6 text-[#ff4d2d] cursor-pointer hover:scale-110 transition-all duration-300">
        <IoIosArrowRoundBack size={40} onClick={() => navigate("/")} />
      </div>

      {/* main card */}
      <div className="w-full max-w-lg bg-white shadow-2xl rounded-3xl border border-orange-200 p-8">
        
        {/* header */}
       <h1
  className="text-3xl font-extrabold text-gray-700 tracking-wide cursor-pointer"
  onClick={() => {
    if (shopData) navigate("/createeditshop");
    else alert("Please create your shop first!");
  }}
>
  {shopData ? "Edit Shop" : "Add Your Shop"}
</h1>


        {/* form */}
        <form className="space-y-5" onSubmit={handlecreateditshop}>
          {/* name */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2 text-center">Shop Name</label>
            <input
              type="text"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-[#ff4d2d] focus:ring-0 outline-none transition-all duration-300 shadow-sm"
              placeholder="Enter your shop name"
              onChange={(e)=>setname(e.target.value)}
              value={name}
            />
          </div>

          {/* state & city */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2 text-center">State</label>
              <input
                type="text"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-[#ff4d2d] focus:ring-0 outline-none transition-all duration-300 shadow-sm"
                placeholder="Enter shop state"
                  onChange={(e)=>setstate(e.target.value)}
              value={state}
              />
            </div>
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2 text-center">City</label>
              <input
                type="text"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-[#ff4d2d] focus:ring-0 outline-none transition-all duration-300 shadow-sm"
                placeholder="Enter Your City"
                  onChange={(e)=>setcity(e.target.value)}
              value={city}
              />
            </div>
          </div>

          {/* address */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2 text-center">Full Address</label>
            <input
              type="text"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-[#ff4d2d] focus:ring-0 outline-none transition-all duration-300 shadow-sm"
              placeholder="Enter your full shop address"
                onChange={(e)=>setaddress(e.target.value)}
              value={address}
            />
          </div>

          {/* image */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2 text-center">Shop Image</label>
            <input
              type="file"
              className="w-full border-2 border-dashed border-gray-300 rounded-xl px-4 py-3 text-gray-500 bg-orange-50/40 hover:border-[#ff4d2d] cursor-pointer transition-all duration-300"
               onChange={handleimage}
                
 
 />
 { frontendimage &&<div className="mt-6">


  <img src={frontendimage} alt="Shop Image"  className="w-full h-48 object-cover rounded-lg border"/>
 </div>}
          </div>

          {/* button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#ff4d2d] to-orange-400 text-white font-semibold py-3 rounded-xl mt-4 shadow-md hover:shadow-lg hover:opacity-90 transition-all duration-300"
          >
            {shopData ? "Update Shop" : "Create Shop"}
          </button>
        </form>
      </div>

      {/* footer text */}
      <p className="mt-5 text-gray-400 text-sm text-center">
        powered by <span className="text-[#ff4d2d] font-semibold">vingo</span>
      </p>
    </div>
  );
};

export default Createeditshop;
