import React, { useEffect } from 'react'
import { FaUserCircle } from 'react-icons/fa'
import { useSelector } from 'react-redux'

export default function Navbar({ showModal, setShowModal }) {
   const handleShowModal = () => {
      setShowModal(!showModal)
   }

   const userInfo = useSelector((state) => state.user.userInfo)
   const loggedIn = useSelector((state) => state.user.loggedIn)
   // console.log(userInfo)

   return (
      <nav className='bg-black/50 text-white-100 p-2 shadow-lg w-full rounded-md '>
         <div className='container mx-auto flex justify-between items-center'>
            {/* Left side: Logo and Title */}
            <div className='flex items-center justify-center gap-4'>
               <img src='/icon.svg' alt='Logo' className='size-14 ' />
               <h1 className='text-4xl bg-gradient-to-b from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent font-bold '>
                  Hashnode Article-Fetcher
               </h1>
            </div>

            {/* Right side: User Placeholder */}
            <div className='flex items-center'>
               <button
                  onClick={handleShowModal}
                  className='flex flex-col items-center '
               >
                  {loggedIn ? (
                     <img
                        src={`${userInfo.photo}`}
                        className='w-10 h-10 rounded-full'
                     />
                  ) : (
                     <FaUserCircle className='text-white text-3xl' />
                  )}

                  <span className='text-white'>
                     {loggedIn ? `${userInfo.name}` : 'Login'}
                  </span>
               </button>
            </div>
         </div>
      </nav>
   )
}
