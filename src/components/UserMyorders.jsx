import React from 'react'
import { useSelector } from 'react-redux'
import UserOrderCard from './UserOrderCard'
import { useNavigate } from 'react-router-dom'

const UserMyorders = () => {
  const navigate=useNavigate()
    const{myorders}=useSelector((state)=>state.user)
    console.log
  return (
    <div className='w-full min-h-screen bg-[#fff9f6] flex justify-center px-4  '>

    <div className='w-full max-w-[800px] p-4'>

      <h1 className='text-gray-800 font-bold text-xl'>My Orders</h1>
    
    <div className='space-y-6'>

   {myorders?.map((order) => (
  <div key={order._id}>
    <UserOrderCard data={order}/>
    <button
      className='bg-orange-600 font-bold text-center w-full'
      onClick={() => navigate(`/trackorder/${order._id}`)}
    >
      Track Order
    </button>
  </div>
))}




    </div>






    </div>









    </div>
  )
}

export default UserMyorders