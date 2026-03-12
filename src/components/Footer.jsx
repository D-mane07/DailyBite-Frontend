import React from "react";
import { motion } from "framer-motion";
import { FaFacebook, FaInstagram, FaYoutube, FaLinkedin } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate=useNavigate()
  return (
    <footer className="w-full bg-black text-gray-300 pt-14 pb-10 px-6 md:px-16 lg:px-24 border-t border-gray-800">
      
      {/* TOP — GRID LINKS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
        
        {/* About */}
        <div>
          <h3 className="text-white font-bold text-xl mb-4">About Vingo</h3>
          <ul className="space-y-2">
            {["Company Info", "Careers", "Press Releases", "Vingo Services"].map((item, idx) => (
              <li
                key={idx}
                className="hover:text-[#ff4d2d] transition-colors duration-300 cursor-pointer"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Help */}
        <div>
          <h3 className="text-white font-bold text-xl mb-4">Help</h3>
          <ul className="space-y-2">
            {["Your Orders", "Returns", "Refund Policy", "Customer Support"].map((item, idx) => (
              <li
                key={idx}
                className="hover:text-[#ff4d2d] transition-colors duration-300 cursor-pointer"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Connect */}
        <div>
          <h3 className="text-white font-bold text-xl mb-4">Connect With Us</h3>
          <ul className="space-y-2">
            {["Our Team", "Partnerships", "Affiliate Program", "Investor Relations"].map((item, idx) => (
              <li
                key={idx}
                className="hover:text-[#ff4d2d] transition-colors duration-300 cursor-pointer"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Policies */}
        <div>
          <h3 className="text-white font-bold text-xl mb-4">Policies</h3>
          <ul className="space-y-2">
            {["Privacy Policy", "Terms & Conditions", "Licenses", "Cookies"].map((item, idx) => (
              <li
                key={idx}
                className="hover:text-[#ff4d2d] transition-colors duration-300 cursor-pointer"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* SOCIAL LINKS */}
   <div className="flex items-center justify-center gap-7 mb-10">

  {/* Facebook */}
  <motion.a
    href="https://www.facebook.com/rafi.hossian.71"
    target="_blank"
    rel="noopener noreferrer"
    whileHover={{ scale: 1.2 }}
    className="text-gray-300 hover:text-[#ff4d2d] transition-colors cursor-pointer"
  >
    <FaFacebook size={28} />
  </motion.a>

  {/* Instagram */}
  <motion.a
    href="https://www.instagram.com/rafihushen01/"
    target="_blank"
    rel="noopener noreferrer"
    whileHover={{ scale: 1.2 }}
    className="text-gray-300 hover:text-[#ff4d2d] transition-colors cursor-pointer"
  >
    <FaInstagram size={28} />
  </motion.a>

  {/* YouTube */}


  {/* LinkedIn */}
  <motion.a
    href="https://www.linkedin.com/in/rafi-khan-749b95385/"
    target="_blank"
    rel="noopener noreferrer"
    whileHover={{ scale: 1.2 }}
    className="text-gray-300 hover:text-[#ff4d2d] transition-colors cursor-pointer"
  >
    <FaLinkedin size={28} />
  </motion.a>

</div>


      {/* CREDIT SECTION */}
      <div className="text-center text-gray-400 text-sm border-t border-gray-800 pt-6">
        <p className="mb-1">
          © {new Date().getFullYear()} <span className="text-white font-semibold">Vingo</span>. All Rights Reserved.
        </p>
        <p className="tracking-wide">
         
            <motion.a
    href="https://mdrafikhan.vercel.app"

    whileHover={{ scale: 1.2 }}
    className="text-[#ff4d2d] font-bold hover:text-[#ff4d2d] transition-colors cursor-pointer"
  >
    Developer By Md Rafi Khan
    
  </motion.a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
