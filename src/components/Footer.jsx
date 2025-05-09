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
      <>         <footer className='bg-white rounded-lg shadow-sm dark:bg-black/20 mt-4 mx-2 sm:mx-4'>
            <div className='w-full max-w-7xl mx-auto p-4'>
               <div className='flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0'>
                  <span className='text-xs sm:text-sm text-gray-500 text-center sm:text-left dark:text-cyan-500'>
                     © 2025{' '}
                     <button
                        onClick={() => {
                           router.push('/')
                        }}
                        className='hover:underline inline-block'
                     >
                        Hashnode Article Finder
                     </button>{' '}
                     - All Rights Reserved.
                  </span>
                  <ul className='flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm font-medium text-gray-500 dark:text-gray-400'>
                     <li>
                        <button
                           onClick={() => handleOpenModal('feedback')}
                           className='text-sm sm:text-base text-cyan-500 hover:underline transition-colors'
                        >
                           Feedback
                        </button>
                     </li>
                     <li>
                        <button
                           onClick={() => handleOpenModal('help')}
                           className='text-sm sm:text-base text-cyan-500 hover:underline transition-colors'
                        >
                           Help
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
