import { motion, AnimatePresence } from 'framer-motion'

function Modal({
   showModal,
   setShowModal,
   modalContainerClass = 'w-[80vw] sm:w-full sm:max-w-xl',
   closeModalOutsideClick,
   header,
   children,
}) {
   return (
      <>
         <AnimatePresence>
            {showModal && (
               <motion.div
                  className='fixed inset-0 z-50 overflow-y-auto'
                  initial='hidden'
                  animate='visible'
                  exit='exit'
               >
                  {/*//~ Overlay */}
                  <motion.div
                     className='fixed inset-0 bg-black/30 bg-opacity-50 backdrop-blur-sm'
                     variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1, transition: { duration: 0.3 } },
                        exit: { opacity: 0, transition: { duration: 0.2 } },
                     }}
                     onClick={closeModalOutsideClick}
                  />

                  {/*//~ Modal Container */}
                  <div className='flex min-h-full items-center justify-center p-4'>
                     <motion.div
                        variants={{
                           hidden: { opacity: 0, y: 40, scale: 0.95 },
                           visible: {
                              opacity: 1,
                              y: 0,
                              scale: 1,
                              transition: {
                                 duration: 0.65,
                                 ease: [0.22, 1, 0.36, 1],
                              },
                           },
                           exit: {
                              opacity: 0,
                              y: 20,
                              scale: 0.95,
                              transition: { duration: 0.45 },
                           },
                        }}
                        initial='hidden'
                        animate='visible'
                        exit='exit'
                        className={`relative transform overflow-hidden rounded-lg backdrop-blur-lg  px-3 pt-1 pb-3 text-left shadow-xl  sm:p-6 bg-cyan-700/60 ${modalContainerClass}`}
                     >
                        {/*//~ Close Button */}
                        <div className='absolute right-0 top-0 pr-4 pt-4'>
                           <button
                              onClick={() => setShowModal(false)}
                              className='rounded-md text-gray-800 dark:text-gray-400 hover:text-gray-500 hover:bg-gray-800 p-1'
                           >
                              <span className='sr-only'>Close</span>
                              <svg
                                 className='h-6 w-6'
                                 fill='none'
                                 viewBox='0 0 24 24'
                                 strokeWidth='1.5'
                                 stroke='currentColor'
                              >
                                 <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    d='M6 18L18 6M6 6l12 12'
                                 />
                              </svg>
                           </button>
                        </div>

                        {/*//~ Modal Content */}
                        <div className='mt-3 text-center sm:mt-0'>
                           <h3 className='text-lg font-semibold leading-6 text-gray-50 '>
                              {header}
                           </h3>
                           <div className='mt-4'>{children}</div>
                        </div>
                     </motion.div>
                  </div>
               </motion.div>
            )}
         </AnimatePresence>
      </>
   )
}
export default Modal
