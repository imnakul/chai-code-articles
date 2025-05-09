import React, { useEffect } from 'react'
import { FaUserCircle } from 'react-icons/fa'

import { useSelector } from 'react-redux'

export default function Navbar({ showModal, setShowModal, QR, setQR }) {
   const handleShowModal = () => {
      setShowModal(!showModal)
   }

   const userInfo = useSelector((state) => state.user.userInfo)
   const loggedIn = useSelector((state) => state.user.loggedIn)
   let photoUrl
   // console.log(userInfo)
   if (loggedIn) {
      photoUrl = userInfo.photo
   }

   return (
      <nav className='bg-black/20 text-white-100 p-1 shadow-lg w-full rounded-md border-b border-cyan-500'>
         <div className='container mx-auto flex justify-between items-center'>
            {/* Left side: Logo and Title */}
            <div className='flex items-center justify-center gap-2'>
               <img
                  src='/logo3.png'
                  alt='Logo'
                  className='size-15 filter-glow'
               />
               <h1 className='text-3xl bg-gradient-to-b from-cyan-400  to-cyan-600 bg-clip-text text-transparent font-bold filter-text-glow'>
                  Hashnode Article-Finder
               </h1>
            </div>

            {/* //?? Right side  */}
            <div className='flex items-center gap-4 justify-center px-2 py-1'>
               <button onClick={handleShowModal} className='flex items-center '>
                  {loggedIn ? (
                     <img
                        src={
                           photoUrl || (
                              <FaUserCircle className='text-cyan-600 size-10 cursor-pointer border-2 border-cyan-500 rounded-full' />
                           )
                        }
                        className='w-10 h-10 rounded-full cursor-pointer border-2 border-cyan-500'
                     />
                  ) : (
                     <span className='text-cyan-300 border border-cyan-500 rounded-full size-10 text-xs pt-2.5 font-bold cursor-pointer'>
                        Login
                     </span>
                  )}

                  {/* <span className='text-white ml-2'>
                     {loggedIn ? `${userInfo.name}` : 'Login'}
                  </span> */}
               </button>

               <button onClick={() => setQR(!QR)} className=''>
                  <img
                     src='https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExZnplZnJ5ZWZmc3ZlaWg2bGU5eGZ0N2JzMDVoczk3bnNqMjJ0MXd6NiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/TDQOtnWgsBx99cNoyH/giphy.gif'
                     className='size-10 cursor-pointer border-2 border-cyan-500 rounded-full'
                  />
               </button>
            </div>
         </div>
      </nav>
   )
}
