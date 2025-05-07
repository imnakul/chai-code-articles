import { useState } from 'react'
import ContactDetails from './Contact'
import Modal from './Modal'

export function Footer() {
   const [showModal, setShowModal] = useState(false)
   const [modalContent, setModalContent] = useState(null)

   const handleOpenModal = (content) => {
      setModalContent(content)
      setShowModal(true)
   }

   return (
      <>
         <footer className='bg-white rounded-lg shadow-sm dark:bg-black/20 mt-4 mx-4 '>
            <div className='w-full max-w-7xl mx-auto px-4 py-1 '>
               <div className='sm:flex sm:items-center sm:justify-between py-2'>
                  {/* <button className='flex items-center mb-6 sm:mb-0 space-x-1 rtl:space-x-reverse'>
                     <img
                        src='/logo2.png'
                        className='size-12'
                        alt='Hashnode Article Finder Logo'
                     />
                     <span className='self-center font-bold text-black text-xl whitespace-nowrap dark:text-white'>
                        Hashnode Article Finder
                     </span>
                  </button> */}
                  <span className='block text-sm text-gray-500 sm:text-center dark:text-cyan-500'>
                     © 2025{' '}
                     <button
                        onClick={() => {
                           router.push('/')
                        }}
                        className='hover:underline'
                     >
                        Hashnode Article Finder -{' '}
                     </button>
                     All Rights Reserved.
                  </span>
                  <ul className='flex flex-wrap items-center mb-4 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400'>
                     <li>
                        <button
                           onClick={() => handleOpenModal('feedback')}
                           className='hover:underline me-4 md:me-6 cursor-pointer'
                        >
                           <span className='text-base text-cyan-500 hover:underline'>
                              Feedback
                           </span>
                        </button>
                     </li>
                     <li>
                        <button
                           onClick={() => handleOpenModal('help')}
                           className='hover:underline me-4 md:me-6 cursor-pointer'
                        >
                           <span className='text-base text-cyan-500 hover:underline'>
                              Help
                           </span>
                        </button>
                     </li>
                  </ul>
               </div>
               {/* <hr className='my-6 border-gray-200 sm:mx-auto dark:border-gray-700' /> */}
            </div>
         </footer>

         {showModal && (
            <Modal
               showModal={showModal}
               setShowModal={setShowModal}
               header={modalContent === 'help' ? 'Contact' : 'Feedback'}
            >
               {modalContent === 'feedback' ? 'Feedback' : <ContactDetails />}
            </Modal>
         )}
      </>
   )
}
