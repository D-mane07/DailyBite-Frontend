import React, { useState } from "react"
import { IoMdArrowRoundBack } from "react-icons/io"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { serverurl } from "../App"

const ForgetPassword = () => {
  const [step, setstep] = useState(1)
  const [email, setemail] = useState("")
  const [otp, setotp] = useState("")
  const [newpass, setnewpass] = useState("")
  const [confirmpass, setconfirmpass] = useState("")
  const [loading, setloading] = useState(false)
  const navigate = useNavigate()

  const primarycolor = "#ff4d2d"
  const hovercolor = "#e64323"

  // send otp
  const handlesendotp = async () => {
    if (!email) return alert("Please enter your email!")
    try {
      setloading(true)
      const result = await axios.post(`${serverurl}/user/sendotp`, { email })
      if (result.data.success) {
        alert("OTP sent successfully!")
        setstep(2)
      } else {
        alert(result.data.message || "Failed to send OTP")
      }
    } catch (error) {
      console.log("Send OTP Error:", error)
      alert("Something went wrong! Try again.")
    } finally {
      setloading(false)
    }
  }

  // verify otp
const handleverifyotp = async () => {
  if (!otp) return alert("Enter the OTP sent to your email!");

  try {
    setloading(true);
    const result = await axios.post(`${serverurl}/user/verifyotp`, { email, otp });

    if (result.data.success) {
      alert("OTP verified successfully!");
      setstep(3);
    } else {
      alert(result.data.message || "Invalid OTP");
    }
  } catch (error) {
    // ✅ Full backend error view
    if (error.response) {
      console.log("Backend Response:", error.response.data);
      console.log("Status:", error.response.status);
      console.log("Headers:", error.response.headers);

      alert(`Backend: ${error.response.data.message || "Unknown error"}`);
    } else if (error.request) {
      console.log("No response received:", error.request);
      alert("No response from server");
    } else {
      console.log("Error creating request:", error.message);
      alert("Request setup failed");
    }
  } finally {
    setloading(false);
  }
};


  // reset password
  const handleresetpass = async () => {
    if (newpass !== confirmpass) return alert("Passwords do not match!")
    if (newpass.length < 8) return alert("Password must be at least 8 characters!")

    try {
      setloading(true)
      const result = await axios.post(`${serverurl}/user/resetpass`, {
        email,
        newpass,
      })
      if (result.data.success) {
        alert("Password reset successfully! Redirecting to Sign In...")
        setTimeout(() => navigate("/signin"), 1200)
      } else {
        alert(result.data.message || "Failed to reset password")
      }
    } catch (error) {
      console.log("Reset password error:", error)
      alert("Something went wrong. Try again.")
    } finally {
      setloading(false)
    }
  }

  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-[#fff9f6] p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl w-full max-w-md shadow-xl p-6 relative overflow-hidden"
      >
        <div className="flex items-center gap-3 mb-6">
          <IoMdArrowRoundBack
            size={26}
            className="text-[#ff4d2d] cursor-pointer hover:scale-110 transition-transform"
            onClick={() => navigate("/signin")}
          />
          <h1 className="text-3xl font-bold text-[#ff4d2d]">Forget Password</h1>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
            >
              <label className="text-lg font-semibold text-gray-700 block text-center mb-2">
                Enter Your Email
              </label>
              <input
                type="email"
                placeholder="Enter your valid email"
                className="w-full border-2 rounded-lg px-3 py-2 focus:outline-none focus:border-[#ff4d2d]"
                value={email}
                onChange={(e) => setemail(e.target.value)}
              />
              <button
                onClick={handlesendotp}
                disabled={loading}
                className="w-full mt-4 py-2 rounded-lg text-white font-semibold transition-all duration-200"
                style={{
                  backgroundColor: loading ? "#ffa99c" : primarycolor,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = hovercolor)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = primarycolor)
                }
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
            >
              <label className="text-lg font-semibold text-gray-700 block text-center mb-2">
                Enter OTP
              </label>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                className="w-full border-2 rounded-lg px-3 py-2 focus:outline-none focus:border-[#ff4d2d]"
                value={otp}
                onChange={(e) => setotp(e.target.value)}
              />
              <button
                onClick={handleverifyotp}
                disabled={loading}
                className="w-full mt-4 py-2 rounded-lg text-white font-semibold transition-all duration-200"
                style={{
                  backgroundColor: loading ? "#ffa99c" : primarycolor,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = hovercolor)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = primarycolor)
                }
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
            >
              <label className="text-lg font-semibold text-gray-700 block text-center mb-2">
                New Password
              </label>
              <input
                type="password"
                placeholder="Enter strong new password"
                className="w-full border-2 rounded-lg px-3 py-2 focus:outline-none focus:border-[#ff4d2d]"
                value={newpass}
                onChange={(e) => setnewpass(e.target.value)}
              />
              <label className="text-lg font-semibold text-gray-700 block text-center mt-4 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Re-enter new password"
                className="w-full border-2 rounded-lg px-3 py-2 focus:outline-none focus:border-[#ff4d2d]"
                value={confirmpass}
                onChange={(e) => setconfirmpass(e.target.value)}
              />
              <button
                onClick={handleresetpass}
                disabled={loading}
                className="w-full mt-5 py-2 rounded-lg text-white font-semibold transition-all duration-200"
                style={{
                  backgroundColor: loading ? "#ffa99c" : primarycolor,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = hovercolor)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = primarycolor)
                }
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default ForgetPassword
