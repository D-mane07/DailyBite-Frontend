import React from 'react'
import { useSelector } from 'react-redux'
import UserDashboard from '../components/UserDashboard.jsx'
import OwnerDashboard from '../components/OwnerDashboard.jsx'
import Deliveryboy from '../components/Deliveryboy.jsx'

const Home = () => {
  const { userData } = useSelector(state => state.user)

 // debug purpose

  // যদি userData না আসে, loading দেখানো
  if (!userData) {
    return (
      <div className='w-full min-h-screen flex items-center justify-center bg-[#fff9f6]'>
        <h1 className='text-2xl font-semibold text-gray-700'>loading...</h1>
      </div>
    )
  }

  // role lowercase করে compare করা
   const role = userData.User.role

  return (
    <div className='w-full min-h-screen flex flex-col  bg-[#fff9f6]'>
      {role === "user" && <UserDashboard />}
      {role === "owner" && <OwnerDashboard />}
      {role === "deliveryboy" && <Deliveryboy />}
    </div>
  )
}

export default Home
