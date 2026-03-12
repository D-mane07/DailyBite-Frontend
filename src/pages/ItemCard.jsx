import React, { useEffect, useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import { motion } from "framer-motion"
import { Minus, Plus, Leaf, Drumstick, ChevronLeft, ChevronRight } from "lucide-react"
import { serverurl } from "../App.jsx"
import { setCurrentitems, Addtocart } from "../pages/redux/UserSlice.js"

const ItemCard = () => {

  const dispatch = useDispatch()
  const { currentcity, currentitems } = useSelector((state) => state.user)

  const [loading, setloading] = useState(false)
  const [quantities, setquantities] = useState({})
  const sliderref = useRef()

  // FETCH ITEMS
  useEffect(() => {
    const fetchitems = async () => {
      try {
        setloading(true)
        const { data } = await axios.get(
          `${serverurl}/item/getitembycity/${currentcity}`,
          { withCredentials: true }
        )
        dispatch(setCurrentitems(data.items))
      } catch (error) {
        console.log(error)
      } finally {
        setloading(false)
      }
    }

    if (currentcity) fetchitems()
  }, [currentcity, dispatch])

  // HANDLE QUANTITY LOCAL
  const handleplus = (id) => {
    setquantities((prev) => ({
      ...prev,
      [id]: (prev[id] || 1) + 1,
    }))
  }

  const handleminus = (id) => {
    setquantities((prev) => ({
      ...prev,
      [id]: prev[id] > 1 ? prev[id] - 1 : 1,
    }))
  }

  const handleinput = (id, value) => {
    if (value === "") return
    const qty = Number(value)
    if (qty < 1) return

    setquantities((prev) => ({
      ...prev,
      [id]: qty,
    }))
  }

  // ADD TO CART (ONLY HERE REDUX WILL UPDATE)
  const handleaddtocart = (item) => {
    const quantity = quantities[item._id] || 1
    const shopId =
      typeof item.shop === "object" ? item.shop?._id || item.shop?.id : item.shop

    dispatch(
      Addtocart({
        id: item._id,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity,
        shop: shopId ? String(shopId) : null,
      })
    )
  }

  // SLIDER CONTROLS
  const scrollleft = () => {
    sliderref.current.scrollBy({ left: -300, behavior: "smooth" })
  }

  const scrollright = () => {
    sliderref.current.scrollBy({ left: 300, behavior: "smooth" })
  }

  if (loading) {
    return <div className="text-center py-20 text-xl">Loading Items...</div>
  }

  return (
    <div className="px-6 py-10 relative">

      <motion.h1
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-extrabold text-center mb-12"
      >
        Best Items in <span className="text-orange-600">{currentcity}</span>
      </motion.h1>

      {/* SLIDER BUTTONS */}
      <button
        onClick={scrollleft}
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-xl p-3 rounded-full z-10 cursor-pointer"
      >
        <ChevronLeft />
      </button>

      <button
        onClick={scrollright}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-xl p-3 rounded-full z-10 cursor-pointer"
      >
        <ChevronRight />
      </button>

      {/* HORIZONTAL SLIDER */}
      <div
        ref={sliderref}
        className="flex gap-8 overflow-x-auto scroll-smooth scrollbar-hide"
      >
        {currentitems &&
          currentitems.map((item) => {
            const quantity = quantities[item._id] || 1

            return (
              <motion.div
                key={item._id}
                whileHover={{ scale: 1.05 }}
                className="min-w-[280px] bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/30"
              >
                {/* IMAGE */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover hover:scale-110 transition duration-500"
                  />

                  <div className="absolute top-3 left-3 bg-white p-2 rounded-full shadow-lg">
                    {item.foodtype === "veg" ? (
                      <Leaf className="text-green-600" size={18} />
                    ) : (
                      <Drumstick className="text-red-600" size={18} />
                    )}
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-5 space-y-4">
                  <h2 className="text-xl font-bold">{item.name}</h2>
                  <p className="text-gray-500 text-sm">{item.category}</p>

                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-green-600">
                      ৳ {item.price}
                    </span>

                    <div className="flex items-center bg-gray-100 rounded-full px-2 py-1 gap-2">
                      <button
                        onClick={() => handleminus(item._id)}
                        className="p-1 hover:bg-red-100 rounded-full cursor-pointer"
                      >
                        <Minus size={18} />
                      </button>

                      <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) =>
                          handleinput(item._id, e.target.value)
                        }
                        className="w-12 text-center bg-transparent outline-none"
                      />

                      <button
                        onClick={() => handleplus(item._id)}
                        className="p-1 hover:bg-green-100 rounded-full cursor-pointer"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  </div>

                  {/* ADD TO CART */}
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleaddtocart(item)}
                    className="w-full bg-black text-white py-3 rounded-2xl hover:bg-gray-900 transition cursor-pointer font-semibold"
                  >
                    Add To Cart
                  </motion.button>
                </div>
              </motion.div>
            )
          })}
      </div>
    </div>
  )
}

export default ItemCard
