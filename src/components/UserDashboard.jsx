import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import Nav from "./Nav";
import { categories } from "../Category";
import CategoryCard from "../pages/CategoryCard";
import Shopcard from "../pages/ShopCard";
import { motion } from "framer-motion";
import Itemcard from "../pages/ItemCard";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";

const UserDashboard = () => {
  const { currentcity, currentshops,currentitems, searchitems} = useSelector((state) => state.user);
   const navigate=useNavigate()
  const catescrollref = useRef();
  const shopscrollref = useRef();
   const itemscrollref=useRef()
  const [catScrollBtn, setCatScrollBtn] = useState({ left: false, right: false });
  const [shopScrollBtn, setShopScrollBtn] = useState({ left: false, right: false });
const[itemscrollbtn,setitemscrollbtn]=useState({ left: false, right: false })

  const scrollhandler = (ref, direction) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction === "left" ? -400 : 400,
        behavior: "smooth",
      });
    }
  };

  const updateScrollBtn = (ref, setter) => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setter({
      left: el.scrollLeft > 0,
      right: el.scrollLeft < max,
    });
  };

  useEffect(() => {
    const catEl = catescrollref.current;
    const shopEl = shopscrollref.current;
    const itemE1=itemscrollref.current

    if (catEl) {
      const handleScroll = () => updateScrollBtn(catescrollref, setCatScrollBtn);
      handleScroll();
      catEl.addEventListener("scroll", handleScroll);
      return () => catEl.removeEventListener("scroll", handleScroll);
    }

    if (shopEl) {
      const handleScroll = () => updateScrollBtn(shopscrollref, setShopScrollBtn);
      handleScroll();
      shopEl.addEventListener("scroll", handleScroll);
      return () => shopEl.removeEventListener("scroll", handleScroll);
    }
      if (itemE1) {
      const handleScroll = () => updateScrollBtn(itemscrollref, setitemscrollbtn);
      handleScroll();
      itemE1.addEventListener("scroll", handleScroll);
      return () => itemE1.removeEventListener("scroll", handleScroll);
    }
  }, []);
  
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Nav />

   {
  searchitems && (
    <motion.div
      className="w-full max-w-6xl mx-auto p-6 bg-white shadow-2xl rounded-3xl mt-10 border border-gray-200"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <h1 className="text-gray-900 text-3xl md:text-4xl font-extrabold tracking-tight mb-6">
        🔍 Search Results
      </h1>

      {searchitems.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.08,
              },
            },
          }}
        >
          {searchitems.map((item, i) => (
            <motion.div
              key={i}
              className="cursor-pointer"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}

            >
              <Itemcard data={item} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.p
          className="text-gray-500 italic text-lg mt-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          No items found for your search 😔
        </motion.p>
      )}
    </motion.div>
  )
}






      <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 py-10 mt-[90px] flex flex-col gap-14">
        
        {/* CATEGORY SECTION */}
        <motion.div
          className="flex flex-col gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-gray-800 text-3xl md:text-4xl font-extrabold tracking-tight">
            Inspiration For Your First Order
          </h1>

          <div className="relative">
            {/* Left Scroll Button */}
            {catScrollBtn.left && (
              <button
                onClick={() => scrollhandler(catescrollref, "left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-md shadow-md hover:shadow-xl transition-all rounded-full p-3"
              >
                <FaAngleLeft className="text-[#ff4d2d] text-2xl" />
              </button>
            )}

            {/* Scrollable Category Cards */}
            <div
              ref={catescrollref}
              className="flex overflow-x-auto gap-4 pb-3 mt-2 scroll-smooth hide-scrollbar"
            >
              {categories.map((cate, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <CategoryCard data={cate} />
                </motion.div>
              ))}
            </div>

            {/* Right Scroll Button */}
            {catScrollBtn.right && (
              <button
                onClick={() => scrollhandler(catescrollref, "right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-md shadow-md hover:shadow-xl transition-all rounded-full p-3"
              >
                <FaAngleRight className="text-[#ff4d2d] text-2xl" />
              </button>
            )}
          </div>
        </motion.div>

        {/* SHOP SECTION */}
        <motion.div
          className="flex flex-col gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className="font-extrabold text-gray-900 text-3xl md:text-4xl">
            Best Shops in <span className="text-[#ff4d2d]">{currentcity || "Your City"}</span>
          </h1>

          <div className="relative">
            {/* Left Scroll Button */}
            {shopScrollBtn.left && (
              <button
                onClick={() => scrollhandler(shopscrollref, "left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-md shadow-md hover:shadow-xl transition-all rounded-full p-3"
              >
                <FaAngleLeft className="text-[#ff4d2d] text-2xl" />
              </button>
            )}

            {/* Scrollable Shop Cards */}
            <div
              ref={shopscrollref}
              className="flex overflow-x-auto gap-5 pb-3 mt-3 scroll-smooth hide-scrollbar"
            >
              {currentshops && currentshops.length > 0 ? (
                currentshops.map((shop, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.06 }}   onClick={()=>navigate(`/shop/${shop._id}`)}
                  >
                    <Shopcard data={shop}  />
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-500 italic text-lg">
                  No shops available in this city yet.
                </p>
              )}
            </div>

            {/* Right Scroll Button */}
            {shopScrollBtn.right && (
              <button
                onClick={() => scrollhandler(shopscrollref, "right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-md shadow-md hover:shadow-xl transition-all rounded-full p-3"
              >
                <FaAngleRight className="text-[#ff4d2d] text-2xl" />
              </button>
            )}
                <div
              ref={itemscrollref}
              className="flex overflow-x-auto gap-5 pb-3 mt-3 scroll-smooth hide-scrollbar"
            >
                {itemscrollbtn.right && (
              <button
                onClick={() => scrollhandler(itemscrollref, "left")}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-md shadow-md hover:shadow-xl transition-all rounded-full p-3"
              >
                <FaAngleRight className="text-[#ff4d2d] text-2xl" />
              </button>
            )}
            
            <div>



              
            </div>
             
              {currentitems && currentitems.length > 0 ? (
                currentitems.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <Itemcard data={item} />
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-500 italic text-lg">
                  No items available in this city yet.
                </p>
              )}
            </div>

            {/* Right Scroll Button */}
            {itemscrollbtn.right && (
              <button
                onClick={() => scrollhandler(itemscrollref, "right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-md shadow-md hover:shadow-xl transition-all rounded-full p-3"
              >
                <FaAngleRight className="text-[#ff4d2d] text-2xl" />
              </button>
            )}
          
          </div>
          
        </motion.div>





      </div>
      <Footer/>
    </div>
  );
};

export default UserDashboard;
