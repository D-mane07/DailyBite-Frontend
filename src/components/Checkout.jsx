import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import { BiCurrentLocation } from "react-icons/bi";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import { useDispatch, useSelector } from "react-redux";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { motion } from "framer-motion";
import { setAddress, setLocation } from "../pages/redux/MapSlice";
import { MdDeliveryDining } from "react-icons/md";
 import {serverurl} from "../App.jsx"
import { useNavigate } from "react-router-dom";
import vingologo from "../../public/Vingo.png"
const EXTERNAL_REQUEST_CONFIG = {
  withCredentials: false,
  timeout: 12000,
};

const publicHttp = axios.create({
  withCredentials: false,
  timeout: 12000,
});
// 🧭 Custom glossy map marker
const customIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149060.png",
  iconSize: [50, 50],
  iconAnchor: [25, 50],
  popupAnchor: [0, -45],
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [50, 50],
  shadowAnchor: [12, 45],
});

// 🌀 Smooth map re-center
const Recentermap = ({ location }) => {
  const map = useMap();
  useEffect(() => {
    if (location?.lat && location?.lon) {
      map.flyTo([location.lat, location.lon], 16, { animate: true });
    }
  }, [location, map]);
  return null;
};

// 🧩 Helper: get current address by lat/lng
const getcurrentaddress = async (lat, lng, dispatch) => {
  try {
    const result = await publicHttp.get(
      `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&format=json&apiKey=${
        import.meta.env.VITE_GEO_API
      }`,
      EXTERNAL_REQUEST_CONFIG
    );
    const formatted =
      result?.data?.results?.[0]?.formatted || "Unknown location";
    dispatch(setAddress(formatted));
  } catch (error) {
    console.log(error);
  }
};

const Checkout = () => {
  const dispatch = useDispatch();
  const { location, address } = useSelector((state) => state.Map);
  const [addressinput, setaddressinput] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentmethod, setpaymentmethod] = useState("Cod");
  const { totalamount } = useSelector((state) => state.user);
    const [delmobile,setdelmobile]=useState("")
  const deliveryfee = totalamount > 3000? 0 : 100;
  const totalamountwithdeliveryfee = totalamount + deliveryfee;
  const { cartitems } = useSelector((state) => state.user);
   const navigate=useNavigate()
  // 🔄 sync redux address to input
  useEffect(() => {
    if (address) setaddressinput(address);
  }, [address]);

  // 🎯 on marker drag
  const ondragend = async (e) => {
    const { lat, lng } = e.target._latlng;
    dispatch(setLocation({ lat: lat, lon: lng }));
    await getcurrentaddress(lat, lng, dispatch);
  };

  // 🔍 Search address → lat/lon
  // 🔍 Search address → lat/lon
  const getlatlangbyaddress = async () => {
    try {
      setLoading(true);

      const result = await publicHttp.get(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
          addressinput
        )}&format=json&apiKey=${import.meta.env.VITE_GEO_API}`,
        EXTERNAL_REQUEST_CONFIG
      );

      const loc = result?.data?.results?.[0];

      if (loc && loc.lat && loc.lon) {
        // update redux location & address
        dispatch(setLocation({ lat: loc.lat, lon: loc.lon }));
        dispatch(setAddress(loc.formatted));
      } else {
        alert("No matching address found, please try again!");
      }
    } catch (error) {
      console.error("Error fetching address:", error.response?.data || error);
      alert("Address search failed. Please check your API key or spelling.");
    } finally {
      setLoading(false);
    }
  };

  // 🎯 Get current GPS location
  const getcurrentlocation = async () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          dispatch(setLocation({ lat: latitude, lon: longitude }));
          await getcurrentaddress(latitude, longitude, dispatch);
          setLoading(false);
        },
        (error) => {
          console.log(error);
          setLoading(false);
        }
      );
    } else {
      alert("Geolocation not supported!");
      setLoading(false);
    }
  };

  const getShopId = (item) => {
    const rawShop = item?.shop ?? item?.shopId ?? null;
    if (!rawShop) return null;
    if (typeof rawShop === "object") {
      return rawShop?._id || rawShop?.id || null;
    }
    return rawShop;
  };

  const normalizeCartItems = (items = []) => {
    return items.map((item) => ({
      ...item,
      id: item?.id || item?._id || null,
      shop: getShopId(item),
      quantity: Number(item?.quantity) > 0 ? Number(item.quantity) : 1,
      price: Number(item?.price) || 0,
    }));
  };


  const handleplaceorder = async () => {
    try {
      const normalizedCartItems = normalizeCartItems(cartitems);
      const invalidCartItem = normalizedCartItems.find((item) => !item.id);

      if (invalidCartItem) {
        alert(
          "Some cart items are invalid. Please remove and re-add the item, then place the order again."
        );
        return;
      }

      const payload = {
        cartitems: normalizedCartItems,
        paymentmethod,
        deliveryaddress: {
          text: addressinput,
          latitude: location?.lat,
          longitude: location?.lon,
        },
        delmobile,
        totalamount: totalamountwithdeliveryfee,
      };

      const result = await axios.post(`${serverurl}/order/placeorder`, payload, { withCredentials: true });

      if (result.data.success) {
        alert("🎉 Order Placed Successfully!");
        
        navigate("/placeorder")
        console.log(result.data)

      } else {
        alert(result.data.message || "Failed to place order");
      }
    } catch (error) {
      console.log("Error:", error?.response?.data || error.message);
      alert(error?.response?.data?.message || "Something went wrong!");
    }
  };

  return (












    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* 🌈 Animated dreamy gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-[#ffecd2] via-[#fcb69f] to-[#ff9a9e]"
        animate={{
          background: [
            "linear-gradient(to bottom right,#ffecd2,#fcb69f,#ff9a9e)",
            "linear-gradient(to bottom right,#a1c4fd,#c2e9fb,#ffdde1)",
            "linear-gradient(to bottom right,#f6d365,#fda085,#fbc2eb)",
          ],
        }}
        transition={{ duration: 15, repeat: Infinity, repeatType: "mirror" }}
      />

      {/* 🧊 Checkout Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-[950px] backdrop-blur-3xl bg-white/30 rounded-[2rem] shadow-[0_0_60px_rgba(255,77,45,0.4)] border border-white/40 p-8 space-y-8 z-10"
      >
        <motion.div
  initial={{ opacity: 0, y: -40 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  className="flex flex-col items-center justify-center mb-12"
>

  {/* Floating Logo */}
  <motion.img
    src={vingologo}
    alt="vingologo"
    animate={{ y: [0, -8, 0] }}
    transition={{
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    }}
    className="h-34 w-34 object-contain drop-shadow-[0_0_25px_rgba(255,77,45,0.6)]"
  />

  {/* Main Heading */}
  <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#ff4d2d] via-[#ff6a3d] to-[#ff7f50] text-center drop-shadow-2xl mt-4 tracking-wide">
    Vingo Checkout
  </h1>

  {/* Glow Line */}
 

</motion.div>
       

        {/* 📍 Address Input */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <span className="text-[#ff4d2d]">📍</span> Delivery Location
          </h2>

          <div className="relative">
            <div className="flex items-center gap-3">
              <input
                type="text"
                className="flex-1 border border-gray-300 focus:outline-none focus:border-[#ff4d2d] rounded-2xl p-3 text-md text-gray-800 shadow-inner bg-white/50 backdrop-blur-sm"
                placeholder="Enter your delivery address"
                value={addressinput}
                onChange={(e) => setaddressinput(e.target.value)}
              />

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={getlatlangbyaddress}
                className="p-3 rounded-2xl bg-[#ff4d2d] text-white hover:bg-[#e03a18] shadow-lg shadow-orange-300 transition"
              >
                {loading ? (
                  <div className="animate-spin h-5 w-5 border-t-2 border-white rounded-full mx-auto"></div>
                ) : (
                  <FaSearch size={22} />
                )}
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={getcurrentlocation}
                className="p-3 rounded-2xl bg-[#6a11cb] text-white hover:bg-[#520ea1] shadow-lg shadow-purple-300 transition"
              >
                {loading ? (
                  <div className="animate-spin h-5 w-5 border-t-2 border-white rounded-full mx-auto"></div>
                ) : (
                  <BiCurrentLocation size={24} />
                )}
              </motion.button>




       
            </div>
                   <div className="mt-5 flex-cols">
                <input type="Number"  placeholder="Enter your valid delivery Number"    onChange={(e)=> setdelmobile(e.target.value)}   value={delmobile}   className="w-full  focus:outline-none   p-6  border focus:border-[#ff4d2d] rounded-2xl" />
          



              </div>
          </div>

          {/* 🗺️ Interactive Map */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="rounded-[2rem] border border-gray-200 overflow-hidden shadow-2xl mt-6 relative"
          >
            <div className="h-[420px] w-full relative">
              <MapContainer
                center={[location?.lat || 23.8103, location?.lon || 90.4125]}
                zoom={15}
                scrollWheelZoom={true}
                className="h-full w-full z-10"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Recentermap location={location} />
                <Marker
                  icon={customIcon}
                  position={[
                    location?.lat || 23.8103,
                    location?.lon || 90.4125,
                  ]}
                  draggable
                  eventHandlers={{ dragend: ondragend }}
                />
              </MapContainer>

              {/* 💫 Floating pulse animation */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-12 h-12 rounded-full bg-[#ff4d2d]/30 animate-ping"></div>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="mt-8">
          <h2 className="font-bold text-lg mb-5 text-gray-800 text-center tracking-wide">
            💳 Choose Your Payment Method
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 💵 Cash on Delivery */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setpaymentmethod("Cod")}
              className={`flex items-center gap-4 rounded-2xl border p-5 cursor-pointer transition-all duration-300 ${
                paymentmethod === "Cod"
                  ? "border-[#ff4d2d] bg-gradient-to-r from-orange-50 to-orange-100 shadow-[0_0_25px_rgba(255,77,45,0.3)]"
                  : "border-gray-200 hover:border-[#ff4d2d]/60 bg-white"
              }`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 shadow-inner">
                <MdDeliveryDining className="text-green-600" size={28} />
              </div>

              <div>
                <p
                  className={`font-semibold text-[16px] ${
                    paymentmethod === "Cod" ? "text-[#ff4d2d]" : "text-gray-700"
                  }`}
                >
                  Cash on Delivery
                </p>
                <p className="text-xs text-gray-500">
                  Pay when your food arrives at your door
                </p>
              </div>
            </motion.div>

            {/* 🌐 Online Payment */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setpaymentmethod("Online")}
              className={`flex items-center gap-4 rounded-2xl border p-5 cursor-pointer transition-all duration-300 ${
                paymentmethod === "Online"
                  ? "border-[#ff4d2d] bg-gradient-to-r from-orange-50 to-orange-100 shadow-[0_0_25px_rgba(255,77,45,0.3)]"
                  : "border-gray-200 hover:border-[#ff4d2d]/60 bg-white"
              }`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 shadow-inner">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-blue-600"
                  width="28"
                  height="28"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 7.5h19.5M3.75 7.5v9.75A2.25 2.25 0 006 19.5h12a2.25 2.25 0 002.25-2.25V7.5m-1.5 0V6A2.25 2.25 0 0016.5 3.75h-9A2.25 2.25 0 005.25 6v1.5m3.75 7.5h6.75"
                  />
                </svg>
              </div>

              <div>
                <p
                  className={`font-semibold text-[16px] ${
                    paymentmethod === "Online"
                      ? "text-[#ff4d2d]"
                      : "text-gray-700"
                  }`}
                >
                  Online Payment
                </p>
                <p className="text-xs text-gray-500">
                  Pay securely via card, mobile banking or wallet
                </p>
              </div>
            </motion.div>
          </div>
        </section>
        <section className="mt-10">
          <h2 className="text-xl font-extrabold text-gray-800 text-center mb-6 tracking-wide">
            🧾 Order Summary
          </h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-gray-200 bg-white/60 backdrop-blur-xl shadow-[0_0_35px_rgba(0,0,0,0.05)] p-5 space-y-3 max-h-[260px] overflow-y-auto"
          >
            {cartitems.length > 0 ? (
              cartitems.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-white/70 hover:bg-orange-50 transition-all duration-300 rounded-2xl p-3 shadow-sm"
                >
                  {/* 🛍️ Item name + qty */}
                  <div className="flex flex-col">
                    <p className="font-semibold text-gray-800 text-[15px] leading-tight">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Qty: <span className="font-medium">{item.quantity}</span>
                    </p>
                  </div>

                  {/* 💰 Price */}
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-700">
                      {item.price} × {item.quantity}
                    </p>
                    <p className="text-base font-bold text-[#ff4d2d]">
                      {totalamount}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 text-sm italic">
                No items in your cart
              </p>
            )}
          </motion.div>

          {/* 🧮 Total Summary */}
          <div className="mt-6 bg-gradient-to-r from-[#ff9a9e] to-[#ff4d2d] rounded-2xl p-4 text-white shadow-[0_0_40px_rgba(255,77,45,0.4)]">
            <div className="flex justify-between text-lg font-semibold mb-1">
              <span>Subtotal</span>
              <span>{totalamount}</span>
            </div>

            <div className="flex justify-between text-sm opacity-90">
              <span>Delivery Fee</span>
              <span className="font-bold">
                {" "}
                {deliveryfee == "0" ? "Free" : deliveryfee}
              </span>
            </div>

            <div className="border-t border-white/40 my-2"></div>

            <div className="flex justify-between text-xl font-bold tracking-wide">
              <span>Total</span>
              <span>{totalamount + deliveryfee}</span>
            </div>
          </div>
        </section>

        {/* ✅ Confirm Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleplaceorder}
          className="w-full bg-gradient-to-r from-[#ff4d2d] via-[#ff7033] to-[#ff9a9e] text-white font-bold py-4 rounded-[1.5rem] shadow-[0_0_40px_rgba(255,77,45,0.5)] hover:shadow-[0_0_60px_rgba(255,77,45,0.8)] transition text-xl tracking-wide"
        >
  {paymentmethod=="Cod" ?"Place Order" :"Pay & place the order"}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Checkout;
