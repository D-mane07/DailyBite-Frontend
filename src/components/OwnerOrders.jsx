import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { serverurl } from "../App.jsx";
import { MapPin, CreditCard, Package, ShoppingBag, Clock } from "lucide-react";
import axios from "axios";
import { updateownerorderstatus } from "../pages/redux/OwnerSlice.js";



const OwnerOrders = () => {
  const [freeboys, setfreeboys] = useState([])
  const { ownerorders } = useSelector((state) => state.owner);
  const dispatch = useDispatch()
  useEffect(() => {
    console.log("ownerorders loaded:", ownerorders);
  }, [ownerorders]);

  if (!ownerorders || ownerorders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-gray-500">
        <Package className="w-14 h-14 mb-4 text-gray-400 animate-bounce" />
        <p className="text-lg font-medium tracking-wide">no orders found</p>
      </div>
    );
  }
  const handlestatus = async ({ orderId, shopId, status }) => {
    try {
      const result = await axios.post(
        `${serverurl}/order/updatestatus/${orderId}/${shopId}`,
        { status },
        { withCredentials: true }
      );

      if (result.data.success) {
        dispatch(updateownerorderstatus({ orderId, shopId, status }))
        setfreeboys(result.data.broadcastedboys)
        
        console.log(result.data.broadcastedboys)

      }
    } catch (error) {
      console.log("❌ status update error:", error.response?.data || error.message);
    }
  };


  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 tracking-wide">
        owner orders
      </h2>

      <div className="space-y-8">
        {ownerorders.map((order) => (
          <motion.div
            key={order._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-3xl shadow-xl p-6 border border-gray-200 hover:scale-[1.01] transition-transform duration-300"
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  order id:{" "}
                  <span className="text-gray-500 font-mono">
                    {order._id.slice(-6)}
                  </span>
                </h3>
                <p className="text-sm text-gray-500">
                  created at: {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              <span
                className={`px-3 py-1 text-sm font-medium rounded-full capitalize ${order.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : order.status === "preparing"
                      ? "bg-blue-100 text-blue-700"
                      : order.status === "out of delivery"
                        ? "bg-orange-100 text-orange-700"
                        : order.status === "delivered"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                  }`}
              >
                {order.status}
              </span>

            </div>

            {order.shopOrder.map((shoporder) => (
              <div key={shoporder._id} className="mt-4">
                <div className="flex items-center gap-3 mb-3">
                  <ShoppingBag className="w-5 h-5 text-gray-600" />
                  <p className="text-gray-700 text-sm md:text-base">
                    shop:{" "}
                    <span className="font-semibold text-gray-800">
                      {shoporder.shop.name}
                    </span>
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {shoporder.shopOrderItems.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center gap-4 border border-gray-100 rounded-2xl p-4 bg-gray-50 hover:shadow-lg transition-shadow duration-300"
                    >
                      <img
                        src={item.item.image}
                        alt={item.item.name}
                        className="w-20 h-20 rounded-xl object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="text-gray-800 font-semibold text-base md:text-lg">
                          {item.item.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          quantity:{" "}
                          <span className="font-medium">{item.quantity}</span>
                        </p>
                        <p className="text-sm text-gray-600">
                          price: ${item.item.price}
                        </p>
                        <p className="text-sm font-semibold text-gray-800 mt-1">
                          subtotal: ${item.item.price * item.quantity}
                        </p>
                        <select
                          onChange={(e) =>
                            handlestatus({
                              orderId: order._id,
                              shopId: shoporder.shop._id,
                              status: e.target.value,
                            })
                          }
                          className="rounded-md border px-3 py-1 text-sm focus:outline-none focus:ring-2 border-[#ff4d2d] text-[#ff4d2d] mt-3"
                        >

                          <option value="pending">Pending</option>
                          <option value="preparing">Preparing</option>
                          <option value="out of delivery">
                            Out of Delivery
                          </option>

                        </select>

                        <p className="text-right text-[#ff4d2d]">
                          Order Status: {shoporder.status}
                        </p>
                        {shoporder.status == "out of delivery" &&

                           <div className="mt-3 p-3 border rounded-lg text-sm bg-orange-100">
    <p className="font-semibold mb-2 text-gray-700">Available Delivery Boys</p>

    {freeboys && freeboys.length > 0 ? (
      freeboys.map((b) => (
        <div
          key={b._id}
          className="border border-orange-300 rounded-lg p-2 mb-2 bg-white shadow-sm"
        >
          <p className="font-semibold text-gray-800">{b.fullname}</p>
          <p className="text-gray-600 text-sm">{b.mobile}</p>
          

         {shoporder?.assignedboy?.assignedTo && (
  <p className="text-green-600 font-medium">
    Assigned: {shoporder?.assignedboy?.assignedTo.fullname} ({shoporder?.assignedboy?.assignedTo.mobile})
    {console.log("🔍 ShopOrder assignedboy:", shoporder.assignedboy)}
  </p>
)}

{!shoporder.assignedboy && shoporder.assigment?.assignedTo && (
  <p className="text-blue-600 font-medium">
    Assigned via delivery record: {shoporder.assigment.assignedTo.fullname}
    {shoporder.assigment.assignedTo.mobile}
  </p>
)}

        </div>
      ))
    ) : (
      <div className="text-gray-500">No delivery boys available</div>
    )}
  </div>



                        }
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="mt-6 border-t border-gray-200 pt-4 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-gray-700 text-sm md:text-base">
                <CreditCard className="w-5 h-5 text-gray-600" />
                <span>payment: {order.paymentmethod}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-700 text-sm md:text-base">
                <Clock className="w-5 h-5 text-gray-600" />
                <span>
                  total amount: <b>৳{order.totalamount}</b>
                </span>
              </div>

              <div className="flex items-center gap-2 text-gray-700 text-sm md:text-base">
                <MapPin className="w-5 h-5 text-gray-600" />
                <a
                  href={`https://www.google.com/maps?q=${order.deliveryaddress.latitude},${order.deliveryaddress.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-800 transition-colors"
                >
                  {order.deliveryaddress.text}
                </a>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-lg"
              >
                <p className="text-gray-800 font-semibold text-capitilize">
                  Coustomer Name: {order?.user?.fullname || "N/A"}
                </p>
                <p className="text-gray-800 font-semibold">
                  Coustomer Email: {order?.user?.email || "N/A"}
                </p>
                <p className="text-gray-800 font-semibold">
                  Coustomer Mobile: {order?.delmobile || "N/A" }
                </p>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default OwnerOrders;
