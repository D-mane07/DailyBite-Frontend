import React, { useEffect, useState } from 'react'
import Delnav from './Delnav'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { motion } from 'framer-motion'
import { serverurl } from '../App'
 import { FaStore, FaUser, FaMapMarkerAlt, FaPhoneAlt, FaBox, FaMotorcycle } from 'react-icons/fa'
import DeliveryTracking from './DeliveryTracking'
const Deliveryboy = () => {
  const { userData } = useSelector((state) => state.user)
  const [assignments, setAssignments] = useState([])
  const [data,setdata]=useState([])
  const [loading, setLoading] = useState(false)
  const [currentAssignment, setCurrentAssignment] = useState(null);
  const getassignment = async () => {
    try {
      setLoading(true)
      const result = await axios.get(`${serverurl}/order/getassignment`, {
        withCredentials: true,
        
      })
      if (result.data.success) {
   
        console.log(result.data)
        setAssignments(result.data.assignments || [])
      }
    } catch (error) {
      console.log(error?.response?.data || error?.message)
      
    } finally {
      setLoading(false)
    }
  }





   const getcurrentorder=async()=>{
   try {
    const result=await axios.get(`${serverurl}/order/getdelorder`,{withCredentials:true})
 
        if(result.data.success){
           setCurrentAssignment(result?.data?.data?.assignment);
;          setdata(result.data.data)
                 console.log(result.data)
        }
   } catch (error) {
    console.log(error?.response?.data || error?.message)
    
   }





 }
const acceptorder = async (assigmentId) => {
  try {
    setLoading(true)

   // ✅ check if undefined or not

    const result = await axios.post(
      `${serverurl}/order/acceptorder/${assigmentId}`,   // ✅ must be a pure string id
      { userId: userData?.User?._id },
      { withCredentials: true }
    )

    if (result.data.success) {
      alert("Order Accepted successfully")
      await   getcurrentorder()
    
    }
  } catch (error) {
    console.log(error?.response?.data || error?.message)
  } finally {
    setLoading(false)
  }
}




  useEffect(() => {
    if (userData) {
      getassignment()
           getcurrentorder()
 
    }
  }, [userData])
  
 
  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-gradient-to-br from-[#fff5f3] to-[#ffece6]">
      <Delnav />

      <div className="mt-28 w-[90%] max-w-6xl">
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl text-center capitalize text-[#ff4d2d] font-extrabold tracking-wide drop-shadow-sm"
        >
          welcome back {userData?.User?.fullname?.toUpperCase()}
        </motion.p>

        {/* location info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5 bg-white/60 p-4 rounded-xl shadow-sm backdrop-blur-md"
        >
          <p className="text-gray-800 font-semibold text-lg">your current location:</p>
          <p className="text-xl font-bold text-[#ff4d2d]">
            longitude: {userData?.User?.location?.coordinates?.[0]}
          </p>
          <p className="text-xl font-bold text-[#ff4d2d]">
            latitude: {userData?.User?.location?.coordinates?.[1]}
          </p>
        </motion.div>

        {/* available orders */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-md border border-orange-100 mt-8">
          <h1 className="text-2xl font-bold text-[#ff4d2d] mb-6 text-center">
            Available Assignments
          </h1>

          {loading && (
            <p className="text-center text-gray-500 animate-pulse">Loading assignments...</p>
          )}

          {!loading && assignments.length === 0 && (
            <p className="text-center text-gray-500">No active assignments</p>
          )}

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 p-8 bg-gradient-to-br from-[#fff4ef] via-[#fffaf8] to-[#fff4ef] min-h-screen">
      {assignments.map((a, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 80, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: i * 0.15, type: "spring" }}
          whileHover={{
            scale: 1.04,
            rotateX: 4,
            rotateY: -4,
            boxShadow: "0 25px 60px rgba(255,77,45,0.35)"
          }}
          className="relative rounded-3xl overflow-hidden bg-white/90 backdrop-blur-2xl border border-[#ffd5c4] shadow-[0_10px_30px_rgba(255,77,45,0.15)] transition-all duration-700 group"
        >
          {/* animated shimmer sweep */}
          <motion.div
            initial={{ x: "-100%" }}
            whileHover={{ x: "150%" }}
            transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity }}
            className="absolute top-0 left-0 w-2/3 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-20"
          />

          {/* shop image (hero) */}
          <motion.div
            className="relative w-full h-60 overflow-hidden"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 100, damping: 10 }}
          >
            <motion.img
              src={a?.shop?.image}
              alt="shop"
              className="w-full h-full object-cover brightness-[0.98] group-hover:brightness-110 group-hover:scale-105 transition-all duration-700"
              whileHover={{
                scale: 1.1,
                rotate: 0.5,
                
              }}
            />
            {/* shimmer glow on top of image */}
            <motion.div
              animate={{
                background: [
                  "linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)",
                  "linear-gradient(240deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)",
                ],
              }}
              transition={{ duration: 3, repeat:Infinity, repeatType: "reverse" }}
              className="absolute inset-0"
            />
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-4">
              <h2 className="text-white font-bold text-xl tracking-wide">{a?.shop?.name}</h2>
              <span className="text-xs text-white/80 capitalize">{a?.status}</span>
            </div>
          </motion.div>

          <div className="relative p-5 space-y-3">
            <p className="text-gray-700 font-semibold">{a?.shop?.address}</p>
            <p className="text-sm text-gray-600">
              Payment: <span className="font-semibold text-[#ff4d2d]">{a?.payment}</span>
            </p>
            <p className="text-sm text-gray-600">
              Customer: <span className="font-semibold">{a?.customer?.name}</span>
            </p>
            <p className="text-sm text-gray-600">
              Owner:{" "}
              <span className="font-semibold text-[#ff4d2d]">
                {a?.owner?.fullname}
              </span>
            </p>
            <p className="text-xs text-gray-500">
              {a?.owner?.email} | {a?.owner?.mobile}
            </p>

            {/* items list animated */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-4 border-t border-[#ffdcd0] pt-3"
            >
              <p className="text-sm font-bold text-gray-800 mb-2">Items:</p>
              <ul className="space-y-2 max-h-32 overflow-y-auto pr-2">
                {a?.items?.map((it, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{
                      scale: 1.03,
                      backgroundColor: "#fff1ee",
                      boxShadow: "0 2px 10px rgba(255,77,45,0.15)"
                    }}
                    className="flex items-center justify-between text-sm bg-[#fff9f7] p-2 rounded-lg border border-[#ffe5dd] transition-all"
                  >
                    <div className="flex items-center space-x-2">
                      {it?.item?.image && (
                        <motion.img
                          src={it?.item?.image}
                          alt={it?.name}
                          className="w-9 h-9 rounded-lg object-cover shadow-sm"
                          whileHover={{ scale: 1.15, rotate: 1 }}
                          transition={{ type: "spring", stiffness: 150 }}
                        />
                      )}
                      <span className="font-medium">{it?.name} × {it?.quantity}</span>
                    </div>
                    <span className="font-bold text-[#ff4d2d]">
                      ${it?.price * it?.quantity}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* total + animated accept */}
            <div className="mt-5 border-t border-[#ffdcd0] pt-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-600">Total:</p>
              <motion.p
                animate={{
                  scale: [1, 1.05, 1],
                  color: ["#ff4d2d", "#ff7a5c", "#ff4d2d"],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-xl font-bold"
              >
                ${a?.total}
              </motion.p>
            </div>

            <p className="text-xs text-gray-400">
              Order #{a?.orderId?.slice(-6)} | {new Date(a?.createdAt).toLocaleString()}
            </p>

            <motion.button
              whileHover={{
                scale: 1.06,
                boxShadow: "0 0 20px rgba(255,77,45,0.4)",
                background: "linear-gradient(90deg, #ff4d2d, #ff7a5c, #ff4d2d)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => acceptorder(a.id)}
              className="mt-5 w-full bg-gradient-to-r from-[#ff4d2d] to-[#ff7a5c] text-white py-3 rounded-xl font-bold tracking-wide shadow-lg hover:shadow-[#ff4d2d]/40 transition-all duration-500"
            >
              Accept Order 🚀
            </motion.button>
          </div>

          {/* glowing animated bottom border */}
          <motion.div
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#ff4d2d] via-[#ffa78d] to-[#ff4d2d] bg-[length:200%_200%]"
          />
       


        </motion.div>
      ))}
    </div>
     

    
    








        </div>
          <div>

   <div className="mt-28 w-[90%] max-w-6xl">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-extrabold text-center mb-10 bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(255,100,50,0.7)]"
        >
          Current Delivery Assignment 
        </motion.h1>

        {loading && (
          <p className="text-center text-gray-400 text-xl animate-pulse">Fetching your assignment...</p>
        )}

        {!loading && currentAssignment && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="rounded-3xl p-8 backdrop-blur-2xl bg-white/10 border border-white/10 shadow-[0_0_60px_rgba(255,77,45,0.25)]"
          >
            {/* top info */}
            <motion.div
              initial={{ y: -15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col md:flex-row justify-between items-center mb-10"
            >
              <div className="flex items-center space-x-4">
                <FaStore className="text-orange-400 text-4xl" />
                <div>
                  <h2 className="text-3xl font-bold text-orange-400">{currentAssignment?.shop?.name}</h2>

                  <p className="text-gray-300 text-sm">
                    Status: <span className="text-pink-400 font-semibold">{currentAssignment?.status}</span>
                  </p>
                </div>
              </div>
              <div className="text-sm text-gray-400">
                Accepted At:{' '}
                <span className="text-orange-400">
                  {new Date(currentAssignment?.acceptedAt).toLocaleString()}
                </span>
              </div>
            </motion.div>

            {/* shop + customer + delivery info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* shop info */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 120 }}
                className="rounded-2xl bg-white/10 border border-white/20 p-6 shadow-inner"
              >
                <h3 className="text-xl font-semibold mb-3 flex items-center space-x-2">
                  <FaStore className="text-orange-400" /> <span>Shop Info</span>
                </h3>
                <p className="text-gray-800 font-bold">Name: {currentAssignment?.shop?.name}</p>
                                  <img src={currentAssignment?.order?.shopOrder?.[0]?.shop?.image}
    className='w-90 h-90 object-cover rounded-lg '    alt="Shop Image" />
                <p className="text-gray-800 font-bold">ID: {currentAssignment?.shop?._id}</p>
                <p className="text-gray-800 font-bold mt-2 text-sm">
                  Shop Order ID: {currentAssignment?.shoporderid}
                </p>
              </motion.div>

              {/* customer info */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 120 }}
                className="rounded-2xl bg-white/10 border border-white/20 p-6 shadow-inner"
              >
                <h3 className="text-xl font-semibold mb-3 flex items-center space-x-2">
                  <FaUser className="text-pink-400" /> <span>Customer Info</span>
                </h3>
                <p className="text-gray-800 font-bold">Name: {currentAssignment?.order?.user?.fullname}</p>
                <p className="text-gray-800 font-bold">Email: {currentAssignment?.order?.user?.email}</p>
                
                <p className="text-gray-800 font-bold">
                  Location: {currentAssignment?.order?.deliveryaddress?.text}
                </p>
              </motion.div>

              {/* delivery boy */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 120 }}
                className="rounded-2xl bg-white/10 border border-white/20 p-6 shadow-inner"
              >
                <h3 className="text-xl font-semibold mb-3 flex items-center space-x-2">
                  <FaMotorcycle className="text-green-400" /> <span>Your Info</span>
                </h3>
                <p className="text-gray-800 font-bold">
                  Name: {currentAssignment?.assignedTo?.fullname}
                </p>
                <p className="text-gray-800 font-bold">
                  Mobile: {currentAssignment?.assignedTo?.mobile}
                </p>
                <p className="text-gray-800 font-bold">
                  Email: {currentAssignment?.assignedTo?.email}
                </p>
              </motion.div>
              <motion.div
  whileHover={{ scale: 1.05 }}
  transition={{ type: 'spring', stiffness: 120 }}
  className="rounded-2xl bg-white/10 border border-white/20 p-6 shadow-inner"
>
  <h3 className="text-xl font-semibold mb-3 flex items-center space-x-2">
    <span>Owner Info</span>
  </h3>

  <p className="text-gray-800 font-bold">
    FullName: {currentAssignment?.order?.shopOrder?.[0]?.owner?.fullname.toUpperCase()}
  </p>

  <p className="text-gray-800 font-bold">
    Email: {currentAssignment?.order?.shopOrder?.[0]?.owner?.email}
  
  </p>

  <p className="text-gray-800 font-bold">
    Mobile: {currentAssignment?.order?.shopOrder?.[0]?.owner?.mobile}
  
  </p>
</motion.div>

            </div>

            {/* map + status timeline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-md"
              >
                <h3 className="text-xl font-semibold mb-3 flex items-center space-x-2">
                  <FaMapMarkerAlt className="text-blue-400" /> <span>Delivery Route</span>
                </h3>
                {/* <div className="h-64 rounded-xl bg-gradient-to-br from-gray-800 via-gray-900 to-black flex items-center justify-center text-gray-500 text-sm">
                  🗺️ Live Map  (lat: {currentAssignment?.customerlocation?.lat}, lon:{' '}
                  {currentAssignment?.customerlocation?.lon})
                </div> */}
                <div>
                   
                   🗺️ Live Map
                 <DeliveryTracking   data={data?.customerlocation}  data2={data?.deliveryboylocation}  data3={currentAssignment?.order?.user?.fullname}/>
            
     



                </div>





              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-md"
              >
                <h3 className="text-xl font-semibold mb-3 flex items-center space-x-2">
                  <FaBox className="text-yellow-400" /> <span>Order Progress</span>
                </h3>

                {/* progress timeline */}
                <div className="relative pl-5 border-l-2 border-orange-400 space-y-4">
                  {['Accepted', 'Out for Delivery', 'Delivered'].map((stage, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.3 }}
                      className="relative"
                    >
                      <div className="absolute -left-[11px] top-1 w-4 h-4 bg-orange-400 rounded-full " />
                      <p className="ml-3 font-semibold text-gray-200">{stage}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* order items */}
            <div className="mt-10 bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
              <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                <FaBox className="text-orange-400" /> <span>Order Items</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentAssignment?.order?.shopOrder?.[0]?.shopOrderItems?.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.2 }}
                    className="p-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10"
                  >
                  
                    <div className="flex justify-between">
                      <img src={item?.item?.image}alt="" className='h-40 w-40 rounded-lg object-cover' />
                      <p className='text-xl font-bold'>{item?.name} × {item?.quantity}</p>
                      <p className="text-orange-400 font-semibold">${item?.price * item?.quantity}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {!loading && !currentAssignment && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center text-gray-400 text-xl mt-10"
          >
            No active assignment found 😔
          </motion.p>
        )}
      </div>
    















          </div>

        {/* Assignment Card */}
    
      </div>
      

        <div>
      </div>
      
    </div>
  )
}

export default Deliveryboy
