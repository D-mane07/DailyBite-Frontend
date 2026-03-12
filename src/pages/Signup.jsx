import React, { useState } from 'react'
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { motion } from "framer-motion";
import { serverurl } from '../App';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import {Auth} from "./Firebase.jsx"
import {useDispatch} from "react-redux"
import { setUserData } from './redux/UserSlice.js';
const Signup = () => {
  const primarycolor = "#ff4d2d";
  const bordercolor = "#ddd";
  const [showpassword, setshowpassword] = useState(false);
  const [role, setRole] = useState("user");
  const [fullname, setfullname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [mobile, setmobile] = useState("");
  const [loading, setloading] = useState(false);
  const navigate = useNavigate();
     const dispatch=useDispatch()
  const handlesignup = async () => {
    if (!fullname || !email || !password || !mobile) {
      return alert("Please fill all fields");
    }

    try {
      setloading(true);
      const result = await axios.post(`${serverurl}/user/signup`, {
        fullname,
        email,
        role,
        mobile,
        password
      }, { withCredentials: true });

     dispatch(setUserData(result.data))
      if (result.data && result.data.success) {
        alert(result.data.message);
        navigate("/signin");
      } else {
        alert(result.data.message || "Signup failed");
      }
    } catch (error) {
      console.log(`Signup error ${error}`);
      alert("Signup failed ❌");
    } finally {
      setloading(false);
    }
  }; 
const googlesignup = async () => {
  try {
    const provider = new GoogleAuthProvider();

    // 🔒 prevent double popup
    const result = await signInWithPopup(Auth, provider)
      .then((res) => res)
      .catch((err) => {
        if (err.code === "auth/cancelled-popup-request" || err.code === "auth/popup-closed-by-user") {
          alert("Google Signin cancelled by user");
          return null; // stop here
        } else {
          throw err; // throw other errors
        }
      });

    if (!result) return; // popup cancelled, stop execution

    const { data } = await axios.post(
      `${serverurl}/user/googlesignup`,
      {
        fullname: result.user.displayName,
        email: result.user.email,
        // optional: role, mobile — only if required
      },
      { withCredentials: true }
    );   
    dispatch(setUserData(data))

    if (data.success) {
      alert("✅ Google Signin Successful!");
      navigate("/");
    } else {
      alert(data.message || "Something went wrong");
    }
  } catch (error) {
    console.error("google signup error:", error);
    alert(`Google Signin failed: ${error.response?.data?.message || error.message}`);
  }
};




  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4 relative overflow-hidden"
      style={{ background: `linear-gradient(135deg, #fff2ec, #ffe0d6)` }}
    >
      <div className="absolute w-[300px] h-[300px] bg-[#ff4d2d]/20 rounded-full blur-3xl top-10 left-10 animate-pulse"></div>
      <div className="absolute w-[250px] h-[250px] bg-[#ff4d2d]/20 rounded-full blur-3xl bottom-10 right-10 animate-pulse"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-2xl p-8 relative z-10"
      >
        <motion.h1
          className="text-5xl font-extrabold text-center mb-2 text-[#ff4d2d]"
          whileHover={{ scale: 1.05 }}
        >
          Vingo
        </motion.h1>
        <p className="text-base sm:text-lg text-gray-700 font-semibold text-center mt-2">
          Signup to get the best food deliveries
        </p>

        {/* Full Name */}
        <div className="mb-4 mt-6">
          <label className="text-lg font-bold text-gray-700 block text-center">Full Name</label>
          <input
            type="text"
            className="w-full border-2 rounded-lg px-3 py-2 mt-2 focus:outline-none focus:border-[#ff4d2d]"
            placeholder="Enter Your Full Name"
            onChange={(e) => setfullname(e.target.value)}
            value={fullname}
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="text-lg font-bold text-gray-700 block text-center">Email</label>
          <input
            type="email"
            className="w-full border-2 rounded-lg px-3 py-2 mt-2 focus:outline-none focus:border-[#ff4d2d]"
            placeholder="Enter Your Valid Email"
            onChange={(e) => setemail(e.target.value)}
            value={email}
          />
        </div>

        {/* Password */}
        <div className="mb-4 relative">
          <label className="text-lg font-bold text-gray-700 block text-center">Password</label>
          <input
            type={!showpassword ? "password" : "text"}
            className="w-full border-2 rounded-lg px-3 py-2 mt-2 focus:outline-none focus:border-[#ff4d2d]"
            placeholder="Enter A Strong Password"
            onChange={(e) => setpassword(e.target.value)}
            value={password}
          />
          <button
            type="button"
            className="absolute right-4 top-[58%] text-[#ff4d2d] text-xl"
            onClick={() => setshowpassword(prev => !prev)}
          >
            {!showpassword ? <IoMdEyeOff /> : <IoMdEye />}
          </button>
        </div>

        {/* Mobile */}
        <div className="mb-4">
          <label className="text-lg font-bold text-gray-700 block text-center">Mobile</label>
          <input
            type="number"
            className="w-full border-2 rounded-lg px-3 py-2 mt-2 focus:outline-none focus:border-[#ff4d2d]"
            placeholder="Enter Your Active Phone Number"
            onChange={(e) => setmobile(e.target.value)}
            value={mobile}
          />
        </div>

        {/* Role Buttons */}
        <div className="mb-4">
          <label className="text-lg font-bold text-gray-700 block text-center">Role</label>
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            {["user", "owner", "deliveryboy"].map((r) => (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                key={r}
                onClick={() => setRole(r)}
                className={`flex-1 border-2 rounded-lg px-3 py-2 text-center font-semibold transition-all duration-300
                  ${role === r
                    ? "bg-gradient-to-r from-[#ff4d2d] to-[#ff6a4d] text-white shadow-md"
                    : "bg-white/80 text-gray-700 hover:bg-gradient-to-r hover:from-[#ffe0d9] hover:to-[#ffd3c6]"
                  }`}
                style={{ borderColor: role === r ? primarycolor : bordercolor }}
              >
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Submit + Google */}
        <div className="flex flex-col gap-3 items-center justify-center mt-6">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
            onClick={handlesignup}
            className={`text-lg sm:text-xl font-bold text-white py-3 w-[80%] sm:w-[300px] rounded-xl shadow-lg
              ${loading ? "opacity-60 cursor-not-allowed" : "bg-gradient-to-r from-[#ff4d2d] to-[#ff6a4d]"}`}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </motion.button>

          {/* Google signup button (UI only) */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={googlesignup}
            className="flex items-center justify-center gap-3 w-[80%] sm:w-[300px] py-3 bg-white border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:shadow-md transition-all duration-300"
          >
            <FcGoogle className="text-2xl" /> Signup with Google
          </motion.button>

          {/* go signin */}
          <p className="text-gray-600 mt-3 text-center">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/signin")}
              className="text-[#ff4d2d] font-semibold cursor-pointer hover:underline"
            >
              Sign in
            </span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
