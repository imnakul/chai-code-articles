import React from 'react'
import { FaUserCircle } from 'react-icons/fa'

export default function Navbar() {
   return (
      <nav className='bg-black/30 text-white-100 p-2 shadow-lg w-full rounded-md '>
         <div className='container mx-auto flex justify-between items-center'>
            {/* Left side: Logo and Title */}
            <div className='flex items-center justify-center gap-2'>
               <img src='/public/icon.svg' alt='Logo' className='size-12 ' />
               <h1 className='text-3xl text-emerald-500 font-bold'>
                  Hashnode: Article Fetcher
               </h1>
            </div>

            {/* Right side: User Placeholder */}
            <div className='flex items-center gap-3'>
               <FaUserCircle className='text-white text-3xl' />
               <span className='text-white'>Logged in User</span>
            </div>
         </div>
      </nav>
   )
}
