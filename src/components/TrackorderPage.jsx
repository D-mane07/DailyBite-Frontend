import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { serverurl } from "../App";
import { useParams, useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const deliveryIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/2972/2972185.png",
  iconSize: [35, 35],
});

const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
  iconSize: [35, 35],
});

const statusSteps = ["pending", "confirmed", "preparing", "out_for_delivery", "delivered"];
const statusLabel = {
  pending: "Order Placed",
  confirmed: "Confirmed",
  preparing: "Preparing",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
};

const TrackorderPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = useCallback(async () => {
    if (!orderId) { setLoading(false); return; }
    try {
      const res = await axios.get(`${serverurl}/order/getorderbyid/${orderId}`, { withCredentials: true });
      if (res.data.success) setOrder(res.data.order);
    } catch (err) {
      console.log(err?.response?.data);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => { fetchOrder(); }, [fetchOrder]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-500 text-lg">Loading order tracking...</p>
    </div>
  );

  if (!order) return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-500">No order found.</p>
    </div>
  );

  const shopOrder = order.shopOrder?.[0];
  const status = shopOrder?.status || "pending";
  const currentStep = statusSteps.indexOf(status);

  const deliveryBoy = shopOrder?.assignedboy;
  const deliveryBoyLat = deliveryBoy?.location?.coordinates?.[1];
  const deliveryBoyLon = deliveryBoy?.location?.coordinates?.[0];
  const hasDeliveryBoy = deliveryBoyLat && deliveryBoyLon;

  const customerLat = order.deliveryaddress?.latitude;
  const customerLon = order.deliveryaddress?.longitude;
  const hasCustomer = customerLat && customerLon;

  const mapCenter = hasDeliveryBoy
    ? [deliveryBoyLat, deliveryBoyLon]
    : hasCustomer
    ? [customerLat, customerLon]
    : [19.0276, 73.0984];

  const polylinePoints = hasDeliveryBoy && hasCustomer
    ? [[deliveryBoyLat, deliveryBoyLon], [customerLat, customerLon]]
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 p-4">
      <div className="max-w-2xl mx-auto">

        <div className="flex items-center gap-3 mb-6">
          <IoMdArrowRoundBack size={28} className="text-[#ff4d2d] cursor-pointer" onClick={() => navigate("/")} />
          <h1 className="text-2xl font-bold text-[#ff4d2d]">Track Order</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 mb-4">
          <h2 className="text-lg font-bold text-gray-700 mb-6">Order Status</h2>
          <div className="flex items-start justify-between relative">
            <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 z-0">
              <div className="h-1 bg-[#ff4d2d]" style={{ width: `${(currentStep / (statusSteps.length - 1)) * 100}%` }}></div>
            </div>
            {statusSteps.map((step, i) => (
              <div key={step} className="flex flex-col items-center z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${i <= currentStep ? "bg-[#ff4d2d] text-white" : "bg-gray-200 text-gray-400"}`}>
                  {i < currentStep ? "✓" : i + 1}
                </div>
                <span className={`text-xs mt-2 text-center max-w-[60px] ${i <= currentStep ? "text-[#ff4d2d] font-semibold" : "text-gray-400"}`}>
                  {statusLabel[step]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {(hasDeliveryBoy || hasCustomer) && (
          <div className="bg-white rounded-2xl shadow-md p-4 mb-4">
            <h2 className="text-lg font-bold text-gray-700 mb-3">
              {hasDeliveryBoy ? "🚴 Delivery Boy Location" : "📍 Delivery Location"}
            </h2>
            <div className="rounded-xl overflow-hidden" style={{ height: "300px" }}>
              <MapContainer center={mapCenter} zoom={14} style={{ height: "100%", width: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {hasDeliveryBoy && (
                  <Marker position={[deliveryBoyLat, deliveryBoyLon]} icon={deliveryIcon}>
                    <Popup>🚴 {deliveryBoy?.fullname || "Delivery Boy"}</Popup>
                  </Marker>
                )}
                {hasCustomer && (
                  <Marker position={[customerLat, customerLon]} icon={userIcon}>
                    <Popup>📍 Your Delivery Address</Popup>
                  </Marker>
                )}
                {polylinePoints.length > 0 && (
                  <Polyline positions={polylinePoints} color="#ff4d2d" dashArray="8" />
                )}
              </MapContainer>
            </div>
            {hasDeliveryBoy && (
              <p className="text-sm text-gray-500 mt-2 text-center">
                🚴 {deliveryBoy?.fullname} • 📞 {deliveryBoy?.mobile}
              </p>
            )}
            {!hasDeliveryBoy && (
              <p className="text-sm text-orange-500 mt-2 text-center">Delivery boy not yet assigned</p>
            )}
          </div>
        )}

        {shopOrder?.shop && (
          <div className="bg-white rounded-2xl shadow-md p-6 mb-4">
            <h2 className="text-lg font-bold text-gray-700 mb-3">Shop</h2>
            <div className="flex items-center gap-4">
              {shopOrder.shop.image && <img src={shopOrder.shop.image} alt="shop" className="w-16 h-16 rounded-xl object-cover" />}
              <div>
                <p className="font-bold text-gray-800">{shopOrder.shop.name}</p>
                <p className="text-gray-500 text-sm">{shopOrder.shop.address}</p>
                <p className="text-gray-500 text-sm">{shopOrder.shop.city}, {shopOrder.shop.state}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-md p-6 mb-4">
          <h2 className="text-lg font-bold text-gray-700 mb-3">Items</h2>
          {shopOrder?.shopOrderItems?.map((item, i) => (
            <div key={i} className="flex items-center gap-4 py-3 border-b last:border-0">
              {item.item?.image && <img src={item.item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover" />}
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{item.name}</p>
                <p className="text-gray-500 text-sm">Qty: {item.quantity} × ₹{item.price}</p>
              </div>
              <p className="font-bold text-[#ff4d2d]">₹{item.quantity * item.price}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-700 mb-3">Summary</h2>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Payment</span>
            <span className="font-semibold">{order.paymentmethod}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Delivery Address</span>
            <span className="font-semibold">{order.deliveryaddress?.text}</span>
          </div>
          <div className="flex justify-between border-t pt-3 mt-2">
            <span className="font-bold text-gray-800">Total</span>
            <span className="font-bold text-[#ff4d2d] text-lg">₹{order.totalamount}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TrackorderPage;