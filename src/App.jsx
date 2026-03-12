import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Signup from './pages/Signup'
import Signin from './pages/Signin'
import ForgetPassword from './pages/ForgetPassword'
import UseGetCurrentUser from './Hooks/UseGetCurrentUser.jsx'
import { useSelector } from 'react-redux'
import Home from './pages/Home.jsx'
import UseGetCurrentCity from './Hooks/UseGetMyCity.jsx'
import UseGetCurrentShop from './Hooks/Usegetmyshop.jsx'
import Createeditshop from './pages/Createeditshop.jsx'
import AddItems from './pages/AddItems.jsx'
import EditItems from './pages/EditItems.jsx'
import Usegetshopbycity from './Hooks/UseGetShopByCity.jsx'
import Usegetitembycity from './Hooks/UseGetItemBycity.jsx'
import CartItem from './pages/CartItem.jsx'
import Checkout from './components/Checkout.jsx'
import PlaceOrder from './components/PlaceOrder.jsx'
import OwnerOrders from './components/OwnerOrders.jsx'
import UseGetOrders from './Hooks/Usegetmyorders.jsx'
import UseGetownerOrders from './Hooks/UsegetMyOwnerOrders.jsx'
import UserMyorders from './components/UserMyorders.jsx'
import useUpdateLocation from './Hooks/Useupdateuserlocation.jsx'
import TrackorderPage from './components/TrackorderPage.jsx'
import Shop from './components/Shop.jsx'
import RouteMetadata from './components/RouteMetadata.jsx'

export const serverurl="https://vingobackend-production.up.railway.app"
const APP = () => {
   const{userData}=useSelector(state=>state.user)
  const authChecked = UseGetCurrentUser();
  const role = userData?.User?.role
  UseGetCurrentCity()
  UseGetCurrentShop()
  Usegetshopbycity()

  Usegetitembycity()
  UseGetOrders()
  UseGetownerOrders()
  useUpdateLocation()

  if (!authChecked) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-[#fff9f6]">
        <h1 className="text-2xl font-semibold text-gray-700">Checking Credintials...</h1>
      </div>
    );
  }
 

  return (
    <div>
      <RouteMetadata />
      <Routes>
          <Route path='/signup' element={!userData ?<Signup/> :<Navigate to={"/"}/>}/>
      <Route path='/signin' element={!userData ?<Signin/>:<Navigate to={"/"}/>}/>
        <Route path='/forgetpass' element={<ForgetPassword/> }/>
             <Route path='/' element={userData ?<Home/>:<Navigate to={"/signup"}/>}/> 

                             <Route path='/createeditshop' element={!userData ? <Navigate to={"/signup"}/> : role === "owner" ? <Createeditshop/> : <Navigate to={"/"}/>}/> 
                                            <Route path='/additems' element={!userData ? <Navigate to={"/signup"}/> : role === "owner" ? <AddItems/> : <Navigate to={"/"}/>}/> 
<Route path="/edititem/:itemId" element={!userData ? <Navigate to={"/signup"}/> : role === "owner" ? <EditItems/> : <Navigate to={"/"}/>}/>
  <Route path='/cartitem' element={userData ?<CartItem/>:<Navigate to={"/signup"}/>}/> 
   <Route path='/checkout' element={userData ?<Checkout/>:<Navigate to={"/signup"}/>}/> 
  <Route path='/placeorder' element={userData ?<PlaceOrder/>:<Navigate to={"/signup"}/>}/> 
   <Route path='/ownerorders' element={!userData ? <Navigate to={"/signup"}/> : role === "owner" ? <OwnerOrders/> : <Navigate to={"/"}/>}/>
      <Route path='/userorders' element={!userData ? <Navigate to={"/signup"}/> : role === "user" ? <UserMyorders/> : <Navigate to={"/"}/>}/>
     <Route path='/trackorder/:orderId' element={userData ?<TrackorderPage/>:<Navigate to={"/signup"}/>}/>
        <Route path='/shop/:shopId' element={userData ?<Shop/>:<Navigate to={"/signup"}/>}/>

      </Routes>
    </div>
  )
}

export default APP
