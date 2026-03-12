import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { serverurl } from "../App";
import Itemcard from "../pages/ItemCard";

export default function Shop() {
  const { shopId } = useParams();
  const [shop, setShop] = useState(null);
  const [items, setItems] = useState([]);
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchShop = useCallback(async () => {
    if (!shopId) return;
    try {
      setLoading(true);
      const res = await axios.get(`${serverurl}/item/getitembyshop/${shopId}`, { withCredentials: true });
      if (res.data?.success) {
        const shopData = res.data.shop || {};
        setShop(shopData);
        setItems(shopData.items || []);
        setOwner(shopData.owner || null);
      }
    } catch (err) {
      console.error("fetch shop error", err?.response?.data?.message || err?.message);
    } finally {
      setLoading(false);
    }
  }, [shopId]);

  useEffect(() => {
    fetchShop();
  }, [fetchShop]);

  const fadeInUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 } };
  const fadeInLeft = { initial: { opacity: 0, x: -50 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.7 } };
  const fadeInRight = { initial: { opacity: 0, x: 50 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.7 } };

  const formatDate = (date) => (date ? new Date(date).toLocaleString() : "-");

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-12">
      <motion.div {...fadeInUp} className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-3 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 text-transparent bg-clip-text animate-gradient-x">
          {shop?.name || "Loading..."}
        </h1>
        <p className="text-gray-900 font-bold text-lg sm:text-xl">Vingo Shop Profile</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          {...fadeInLeft}
          className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-5 hover:scale-105 hover:shadow-pink-500/50 transition-transform duration-500"
        >
          {shop ? (
            <>
              <div className="relative rounded-2xl overflow-hidden shadow-lg group">
                <img
                  src={shop.image}
                  alt={shop.name}
                  className="w-full h-64 sm:h-72 md:h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-70" />
              </div>
              <div className="mt-4 space-y-2">
                <p className="text-2xl sm:text-3xl font-bold">{shop.name}</p>
                <p className="text-gray-900">{shop.address}</p>
                <p className="text-gray-900">
                  {shop.city}, {shop.state}
                </p>
                <p className="text-sm text-gray-500">Created: {formatDate(shop.createdAt)}</p>
              </div>
            </>
          ) : (
            <div className="h-64 sm:h-72 md:h-80 bg-gray-200 animate-pulse rounded-2xl" />
          )}
        </motion.div>

        <motion.div {...fadeInUp} className="col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {loading ? (
            <p className="text-gray-500 text-center col-span-full py-12">Loading items...</p>
          ) : items.length > 0 ? (
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 40, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ scale: 1.05, y: -5, transition: { duration: 0.3 } }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Itemcard data={item} />
                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            <p className="text-gray-400 text-center col-span-full py-12">No items found</p>
          )}
        </motion.div>

        <motion.div
          {...fadeInRight}
          className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-5 hover:scale-105 hover:shadow-orange-400/50 transition-transform duration-500"
        >
          <h3 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900">Owner Info</h3>
          {owner ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-16 w-16 sm:h-20 sm:w-20 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl sm:text-2xl shadow-lg">
                  {owner.fullname?.[0]?.toUpperCase() || "?"}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{owner.fullname}</p>
                  <p className="text-sm sm:text-base text-gray-900">{owner.role}</p>
                </div>
              </div>
              <p className="flex items-center gap-2 text-sm sm:text-base text-gray-900">
                <i className="fas fa-phone-alt" /> {owner.mobile}
              </p>
              <p className="flex items-center gap-2 text-sm sm:text-base text-gray-900">
                <i className="fas fa-envelope" /> {owner.email}
              </p>
              <p className="text-xs sm:text-sm text-gray-500">
                Owner ID: <code className="bg-gray-100 px-2 py-1 rounded text-gray-900">{owner._id}</code>
              </p>
            </div>
          ) : (
            <div className="h-40 sm:h-48 bg-gray-200 rounded-2xl animate-pulse" />
          )}
        </motion.div>
      </div>
    </div>
  );
}
