import React, { useState } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { serverurl } from "../App";
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import {Auth} from "./Firebase.jsx"
import { ClipLoader } from "react-spinners"
import { useDispatch } from "react-redux";
import { setUserData } from "./redux/UserSlice.js";

const Signin = () => {
  const primarycolor = "#ff4d2d";
  const hovercolor = "#e64323";
  const bgcolor = "#fff9f5";
  const [showpass, setShowpass] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const [loading, setloading] = useState(false);
  const dispatch = useDispatch();
  const handlechange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    
  };

  const handlesubmit = async (e) => {
    e.preventDefault(); // prevent form refresh
    if (loading) return;

    setloading(true);
    try {
      const result = await axios.post(
        `${serverurl}/user/signin`,
        {
          email: form.email,
          password: form.password,
        },
        { withCredentials: true }
      );

      if (result.data.success) {
        dispatch(setUserData(result.data));
        alert("Signin successful!");
        navigate("/");
      } else {
        alert(result.data.message || "Signin failed");
      }
    } catch (error) {
      console.error("Signin Error:", error.response?.data || error.message);
      alert(`Signin failed: ${error.response?.data?.message || error.message}`);
    } finally {
      setloading(false);
    }
  };

  const googlesignin = async () => {
    if (loading) return;
    setloading(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(Auth, provider);

      const { data } = await axios.post(
        `${serverurl}/user/googlelogin`,
        {
          fullname: result.user.displayName,
          email: result.user.email,
          
        },
        { withCredentials: true }
      );

      if (data.success) {
        dispatch(setUserData(data));
        alert("Google Signin Successful");
        navigate("/");
      } else {
        alert(data.message || "Google Signin failed");
      }
    } catch (error) {
      console.log("google signup error:", error);
      console.log("response:", error.response?.data);
      alert(`Google Signin failed: ${error.response?.data?.message || error.message}`);
    } finally {
      setloading(false);
    }
  };


  return (
    <div
      className="flex justify-center items-center min-h-screen"
      style={{ backgroundColor: bgcolor }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8"
      >
        <h2 className="text-3xl font-bold text-center mb-6" style={{ color: primarycolor }}>
          Welcome Back
        </h2>

        {/* Google Signin (UI only) */}
        <button
          type="button"
          onClick={googlesignin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition mb-4"
        >
          <FcGoogle className="text-2xl" />
          <span className="font-medium text-gray-700">Continue with Google</span>
        </button>

        <div className="flex items-center mb-6">
          <div className="flex-1 h-[1px] bg-gray-300"></div>
          <span className="px-3 text-gray-500 text-sm">OR</span>
          <div className="flex-1 h-[1px] bg-gray-300"></div>
        </div>

        <form onSubmit={handlesubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handlechange}
              required
              className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-[#ff4d2d]"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type={showpass ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handlechange}
              required
              className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-[#ff4d2d]"
            />
            <span
              onClick={() => setShowpass(!showpass)}
              className="absolute right-3 top-9 cursor-pointer text-gray-500"
            >
              {showpass ? <IoMdEyeOff size={22} /> : <IoMdEye size={22} />}
            </span>
          </div>

          <div className="text-right">
            <button
              type="button"
              onClick={() => navigate("/forgetpass")}
              className="text-sm text-[#ff4d2d] hover:text-[#e64323] transition cursor-pointer"
            >
              Forgot Password?
            </button>
          </div>

          <motion.button
         
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg text-white font-semibold shadow-md"
            style={{ backgroundColor: primarycolor }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = hovercolor)}
            onMouseLeave={(e) => (e.target.style.backgroundColor = primarycolor)}
          >
            {loading ? <ClipLoader /> : "Sign In"}
      
          </motion.button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-5">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-[#ff4d2d] font-semibold cursor-pointer hover:text-[#e64323]"
          >
            Sign Up
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default Signin;
