import { useState } from 'react'
import { sendFeedback } from '../utils/sendFeedback'
import { useSelector } from 'react-redux'

function Feedback() {
   const [name, setName] = useState('')
   const [title, setTitle] = useState('')
   const [feedbackText, setFeedbackText] = useState('')
   const { loggedIn, userInfo } = useSelector((state) => state.user)

   const handleFeedbackSubmit = (e) => {
      e.preventDefault()

      const mailtoLink = `mailto:imnakul44@gmail.com?subject=${encodeURIComponent(
         title
      )}&body=${encodeURIComponent(`Name: ${name}\nMessage:${feedbackText}`)}`
      console.log('m2l', mailtoLink)
      // Open the mail client
      window.location.href = mailtoLink

      // Reset form
      setName('')
      setTitle('')
      setFeedbackText('')
   }
   return (
      <>
         <div className='bg-cyan-950 p-4 rounded-lg shadow-lg border border-cyan-500 w-full max-w-md mx-auto'>
            <form
               className='space-y-2 sm:space-y-4'
               onSubmit={handleFeedbackSubmit}
            >
               <div>
                  <label
                     className='block text-gray-300 font-medium mb-2'
                     htmlFor='senderName'
                  >
                     Name
                  </label>
                  <input
                     type='name'
                     id='senderName'
                     className='w-full border border-gray-600 bg-gray-400/60 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white text-white disabled:bg-gray-600 disabled:cursor-not-allowed'
                     placeholder='Enter Your Name'
                     value={name}
                     onChange={(e) => setName(e.target.value)}
                     required
                  />
               </div>

               <div>
                  <label
                     className='block text-gray-300 font-medium mb-2'
                     htmlFor='title'
                  >
                     Title
                  </label>
                  <input
                     type='text'
                     id='title'
                     className='w-full border border-gray-600 bg-gray-400/60 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white text-white disabled:bg-gray-600 disabled:cursor-not-allowed'
                     placeholder='Feedback Title'
                     value={title}
                     onChange={(e) => setTitle(e.target.value)}
                     required
                  />
               </div>

               <div>
                  <label
                     className='block text-gray-300 font-medium mb-2'
                     htmlFor='feedback'
                  >
                     Feedback
                  </label>
                  <textarea
                     id='feedback'
                     className='w-full border border-gray-600 bg-gray-400/60 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white text-white resize-y'
                     placeholder='Write your feedback here...'
                     value={feedbackText}
                     onChange={(e) => setFeedbackText(e.target.value)}
                     rows='5'
                     required
                  ></textarea>
               </div>

               <button
                  type='submit'
                  className='bg-cyan-950  text-cyan-300 font-bold py-2 px-4 rounded-lg border border-cyan-500 transition-all  hover:scale-95 duration-300 hover:bg-cyan-800 focus:bg-cyan-800 cursor-pointer mx-auto w-full'
               >
                  Submit Feedback
               </button>
            </form>
         </div>
      </>
   )
}
export default Feedback
