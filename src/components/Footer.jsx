import { useState } from 'react'
import ContactDetails from './Contact'
import Modal from './Modal'
import Feedback from './Feedback'

export function Footer() {
   const [showModal, setShowModal] = useState(false)
   const [modalContent, setModalContent] = useState(null)

   const handleOpenModal = (content) => {
      setModalContent(content)
      setShowModal(true)
   }

   return (
      <>
         {' '}
         <footer className='absolute bottom-0 left-0 right-0 shadow-sm bg-black/20 mx-0'>
            <div className='w-full max-w-7xl mx-auto p-4 backdrop-blur-md'>
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
                  </span>{' '}
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
                           Contact
                        </button>
                     </li>
                     <li>
                        <button
                           onClick={() => handleOpenModal('faq')}
                           className='text-sm sm:text-base text-cyan-500 hover:underline transition-colors'
                        >
                           FAQs
                        </button>
                     </li>
                  </ul>
               </div>
               {/* <hr className='my-6 border-gray-200 sm:mx-auto dark:border-gray-700' /> */}
            </div>
         </footer>{' '}
         {showModal && (
            <Modal
               showModal={showModal}
               setShowModal={setShowModal}
               header={
                  modalContent === 'help'
                     ? 'Contact'
                     : modalContent === 'faq'
                     ? 'Frequently Asked Questions'
                     : 'Feedback'
               }
            >
               {modalContent === 'faq' ? (
                  <div className='space-y-6 text-left max-h-[70vh] overflow-y-auto px-4'>
                     <div className='space-y-4'>
                        <div>
                           <h3 className='text-lg font-semibold text-cyan-300'>
                              Is Login Necessary?
                           </h3>
                           <p className='text-gray-300'>
                              No, it's optional. Login is helpful for
                              organization or if you want to send feedback
                              without needing to add your email every time.
                           </p>
                        </div>
                        <hr className='border-cyan-900' />

                        <div>
                           <h3 className='text-lg font-semibold text-cyan-300'>
                              What are tag slugs?
                           </h3>
                           <p className='text-gray-300'>
                              Tag slugs are the URL-friendly versions of tags
                              used in Hashnode articles. For example,
                              'javascript' or 'react-js'.
                           </p>
                        </div>
                        <hr className='border-cyan-900' />

                        <div>
                           <h3 className='text-lg font-semibold text-cyan-300'>
                              How to Visit Articles?
                           </h3>
                           <p className='text-gray-300'>
                              Articles Heading itself is a direct link to the
                              article on Hashnode.
                           </p>
                        </div>
                        <hr className='border-cyan-900' />

                        <div>
                           <h3 className='text-lg font-semibold text-cyan-300'>
                              Author Email - why not available for everyone ?
                           </h3>
                           <p className='text-gray-300'>
                              There was no direct way to get Email. Trust Me! I
                              thought about it a lot, finally got a way, we are
                              extracting email from Github links. So, Author
                              Email only available for users who have added
                              Github Link in their Hashnode Profile.
                           </p>
                        </div>
                        <hr className='border-cyan-900' />

                        <div>
                           <h3 className='text-lg font-semibold text-cyan-300'>
                              What are the PreRequisites to make this work in
                              BEST WAY for an ORG ?
                           </h3>
                           <p className='text-gray-300'>
                              Two requirements for Best Result: <br></br>1. Ask
                              your students to use two Tags - everyone should
                              atleast add those two e.g. 'chai-code' & 'rag'{' '}
                              <br></br>2. Ask your students to add github link
                              in their Hashnode Profile. Just with these two
                              basic steps ORG will be able to send individual
                              feedbacks right into thier mail Box.
                           </p>
                        </div>
                        <hr className='border-cyan-900' />
                        <div>
                           <h3 className='text-lg font-semibold text-cyan-300'>
                              Best Feature for Orgs:
                           </h3>
                           <p className='text-gray-300'>
                              I have added Gmail API in this project. So, Orgs
                              can do a one time setup with their workspace or
                              gmail account, which needs some permissions to
                              send emails with ONE CLICK. After that step, Orgs
                              can allow multiple Members from Orgs, to send
                              feedbacks, and all feedbacks to users will be
                              received from same ORG MAIL .<br></br>
                              Kindly Contact me for this feature to work.
                           </p>
                        </div>
                        <hr className='border-cyan-900 mb-4' />
                     </div>
                  </div>
               ) : modalContent === 'feedback' ? (
                  <Feedback />
               ) : (
                  <ContactDetails />
               )}
            </Modal>
         )}
      </>
   )
}
