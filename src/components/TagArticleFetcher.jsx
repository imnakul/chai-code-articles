import React, { useEffect, useState } from 'react'
import {
   fetchArticlesWithAllTags,
   fetchUserSocialLinks,
} from '../utils/fetcharticles.js'
import { getGitHubEmail } from '../utils/fetchemail.js'
import {
   FaGithub,
   FaTwitter,
   FaInstagram,
   FaGlobe,
   FaEnvelope,
   FaSpinner,
} from 'react-icons/fa'
import Navbar from './Navbar'
// import { sendEmail } from '../utils/sendEmail.js'
import Modal from './Modal'
import { FaUserCircle } from 'react-icons/fa'
import { auth, provider } from '../utils/firebaseConfig.js'
import {
   signInWithPopup,
   signOut,
   onAuthStateChanged,
   getIdToken,
} from 'firebase/auth'
import { useDispatch } from 'react-redux'
import { login } from '../store/userSlice.js'
import { useSelector } from 'react-redux'

const sendEmail = async () => {
   const res = await fetch('/api/sendEmail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
         to: 'imnakul44@gmail.com',
         subject: 'Hello!',
         message: 'This is a test email.',
      }),
   })

   const data = await res.json()
   console.log(data)
}

export default function TagArticleFetcher() {
   const [tag1, setTag1] = useState('')
   const [tag2, setTag2] = useState('')
   const [pages, setPages] = useState(5)
   const [loading, setLoading] = useState(false)
   const [articles, setArticles] = useState([])
   const [socials, setSocials] = useState({})
   const [showModal, setShowModal] = useState(false)

   const [authorEmail, setAuthorEmail] = useState('')
   const [userEmail, setUserEmail] = useState('imnakul44@gmail.com')
   const [title, setTitle] = useState('')
   const [feedback, setFeedback] = useState('')
   const [loggedIn, setLoggedIn] = useState(false)
   const [authToken, setAuthToken] = useState('')

   const userDetail = useSelector((state) => state.user.userInfo)
   const dispatch = useDispatch()

   //~ Fetching Articles
   const handleSubmit = async (e) => {
      e.preventDefault()
      setLoading(true)
      setArticles([])

      try {
         const result = await fetchArticlesWithAllTags([tag1, tag2], pages)
         if (result.length === 0) {
            window.alert('No articles found containing both tags.')
         }
         setArticles(result)

         const usernames = [
            ...new Set(result.map((article) => article.author.username)),
         ]

         const socialData = {}
         for (const username of usernames) {
            try {
               const links = await fetchUserSocialLinks(username)
               socialData[username] = { ...links }

               if (links.github) {
                  try {
                     const email = await getGitHubEmail(links.github)
                     socialData[username].email = email || null
                  } catch (emailErr) {
                     console.warn(
                        `❌ Failed to fetch GitHub email for ${username}`,
                        emailErr
                     )
                     socialData[username].email = null
                  }
               } else {
                  socialData[username].email = null
               }
            } catch (err) {
               console.warn(`❌ Failed to fetch socials for ${username}`, err)
               socialData[username] = { email: null }
            }
         }

         setSocials(socialData)
         console.log('Social data', socialData)
      } catch (err) {
         console.error('Error fetching articles:', err)
      }

      setLoading(false)
   }

   //~ Authentication - Login + Logout
   useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
         if (user) {
            setLoggedIn(true)
            getIdToken(user).then((token) => {
               setAuthToken(token)
            })
         } else {
            setLoggedIn(false)
            setAuthToken('')
         }
      })

      return () => unsubscribe()
   }, [])

   const handleLogin = async () => {
      try {
         const result = await signInWithPopup(auth, provider)
         const user = result.user
         const token = await getIdToken(user)
         dispatch

         const userInfo = {
            name: user.displayName,
            email: user.email,
            photo: user.photoURL,
            uid: user.uid,
         }

         dispatch(login({ userInfo, userToken: token }))
      } catch (error) {
         console.error('Error signing in with Google:', error)
      }
   }

   const handleLogout = async () => {
      try {
         await signOut(auth)
         dispatch(logout())
      } catch (error) {
         console.error('Error signing out:', error)
      }
   }
   //~Authentication Complete

   //~ FeedBack submit
   const handleFeedbackSubmit = async (e) => {
      e.preventDefault()
      console.log('values', authorEmail, userEmail, title, feedback)
      sendEmail()
      // await sendEmail(userEmail, authorEmail, title, feedback)
      //    .then((res) => {
      //       console.log('Feedback sent successfully', res)
      //    })
      //    .catch((err) => {
      //       console.error('Error sending feedback', err)
      //    })
   }

   return (
      <>
         {/* <div className='min-h-screen bg-gradient-to-b from-gray-800 via-white-900 to-gray-800 text-white w-full'> */}
         <div className='bg-[linear-gradient(to_right,_rgb(58,28,113),_rgb(215,109,119),_rgb(255,175,123))] min-h-screen'>
            <Navbar
               showModal={showModal}
               setShowModal={setShowModal}
               loggedIn={loggedIn}
            />
            {showModal && (
               <Modal
                  showModal={showModal}
                  setShowModal={setShowModal}
                  modalContainerClass='p-6 bg-emerald-500/40 border border-emerald-500 rounded-lg w-[60vw] sm:w-full sm:max-w-xl'
                  header='User SignIn/SignUp'
               >
                  <div className='bg-gray-800/60 p-2'>
                     {!loggedIn ? (
                        <button onClick={handleLogin} className='text-white'>
                           <FaUserCircle className='inline mr-2' />
                           Sign In with Google
                        </button>
                     ) : (
                        <div className='flex items-center gap-2'>
                           <span className='text-white'>Welcome, User</span>
                           <button
                              onClick={handleLogout}
                              className='text-white'
                           >
                              Log Out
                           </button>
                        </div>
                     )}
                  </div>
               </Modal>
            )}
            {/* //?? Loading  */}
            {loading ? (
               <div className='flex flex-col items-center justify-center h-screen'>
                  <FaSpinner className='text-white text-6xl animate-spin mb-4' />
                  <p className='text-2xl font-semibold text-white'>
                     Fetching articles...
                  </p>
                  <p className='text-base text-white mt-2'>
                     It can take longer than expected, depending on the number
                     of pages.
                  </p>
               </div>
            ) : (
               <>
                  {/* //?? FORM  */}
                  <div className='max-w-5xl  flex items-center justify-around mx-auto gap-20'>
                     <img
                        src='/chaicode.jpg'
                        alt='Logo'
                        className='animate-pulse hover:scale-105 transition-all duration-800 ease-in-out'
                     />
                     <form
                        onSubmit={handleSubmit}
                        className='bg-gray-800/60 p-12 rounded-lg shadow-lg min-w-xl mx-auto my-12'
                     >
                        <h2 className='text-4xl font-bold mb-8 text-center text-white'>
                           Find Articles by Tags
                        </h2>

                        <div className='mb-6'>
                           <label className='block mb-2 text-white font-medium'>
                              Tag 1 - small letters only , this is the title
                              slug
                           </label>
                           <input
                              type='text'
                              value={tag1}
                              onChange={(e) => setTag1(e.target.value)}
                              className='w-full border border-gray-600 bg-gray-400/60 px-5 py-3 rounded focus:outline-none focus:ring-2 focus:ring-white-500 text-white'
                              placeholder='e.g., chaicode'
                              required
                           />
                        </div>

                        <div className='mb-6'>
                           <label className='block mb-2 text-white font-medium'>
                              Tag 2 - small letters only , this is the title
                              slug
                           </label>
                           <input
                              type='text'
                              value={tag2}
                              onChange={(e) => setTag2(e.target.value)}
                              className='w-full border border-gray-600 bg-gray-400/60 px-5 py-3 rounded focus:outline-none focus:ring-2 focus:ring-white-500 text-white'
                              placeholder='e.g., rag'
                              required
                           />
                        </div>

                        <div className='mb-8'>
                           <label className='block mb-2 text-white font-medium'>
                              Pages to Fetch [ 1 Page = 50 Articles ]
                           </label>
                           <input
                              type='number'
                              value={pages}
                              onChange={(e) => setPages(Number(e.target.value))}
                              className='w-full border border-gray-600 bg-gray-400/60 px-5 py-3 rounded focus:outline-none focus:ring-2 focus:ring-white-500 text-white'
                              min={1}
                              required
                           />
                        </div>
                        <div className='flex justify-center'>
                           <button
                              type='submit'
                              className=' bg-white/50  text-black font-bold py-3 px-5 rounded-md border border-emerald-500 mx-auto transition-all  hover:scale-95 duration-300 hover:bg-gray-600'
                           >
                              Search
                           </button>
                        </div>
                     </form>
                     {/* <img
                        src='/chaicode.jpg'
                        alt='Logo'
                        className='animate-pulse'
                     /> */}
                  </div>

                  {articles.length > 0 && (
                     <>
                        <div className='max-w-6xl mx-auto space-y-10'>
                           <div className='flex items-center justify-center w-full '>
                              <span className='text-3xl font-semibold text-gray-200'>
                                 {articles.length} Articles Found with both Tags
                              </span>
                           </div>
                           {articles.map((article, i) => (
                              <div
                                 key={i}
                                 className='bg-gray-800/60 p-8 rounded-lg shadow-lg mt-4 flex flex-items-center justify-between w-full gap-4'
                              >
                                 {/* //?? ARticle Detail SEctioon  */}
                                 <div
                                    className='w-2/3 p-6 bg-emerald-500/20 border border-emerald-500 rounded-lg
                                 '
                                 >
                                    <div className='flex items-center mb-10'>
                                       <img
                                          src={article.author.profilePicture}
                                          alt={article.author.name}
                                          className='w-16 h-16 rounded-full mr-6 object-cover border-2 border-emerald-500'
                                       />
                                       <div>
                                          <p className='font-semibold text-xl text-white'>
                                             {article.author.name}
                                          </p>
                                          <p className='text-sm text-white'>
                                             @{article.author.username}
                                          </p>

                                          <div className='flex flex-wrap gap-3 mt-3 text-blue-400'>
                                             {socials[article.author.username]
                                                ?.github && (
                                                <a
                                                   href={
                                                      socials[
                                                         article.author.username
                                                      ].github
                                                   }
                                                   target='_blank'
                                                   rel='noreferrer'
                                                   className=' hover:underline flex items-center gap-1'
                                                >
                                                   <FaGithub /> GitHub
                                                </a>
                                             )}
                                             {socials[article.author.username]
                                                ?.twitter && (
                                                <a
                                                   href={
                                                      socials[
                                                         article.author.username
                                                      ].twitter
                                                   }
                                                   target='_blank'
                                                   rel='noreferrer'
                                                   className=' hover:underline flex items-center gap-1'
                                                >
                                                   <FaTwitter /> Twitter
                                                </a>
                                             )}
                                             {socials[article.author.username]
                                                ?.instagram && (
                                                <a
                                                   href={
                                                      socials[
                                                         article.author.username
                                                      ].instagram
                                                   }
                                                   target='_blank'
                                                   rel='noreferrer'
                                                   className=' hover:underline flex items-center gap-1'
                                                >
                                                   <FaInstagram /> Instagram
                                                </a>
                                             )}
                                             {socials[article.author.username]
                                                ?.email && (
                                                <p className='text-sm  flex items-center gap-1'>
                                                   <FaEnvelope />{' '}
                                                   {
                                                      socials[
                                                         article.author.username
                                                      ].email
                                                   }
                                                </p>
                                             )}
                                             {socials[article.author.username]
                                                ?.website && (
                                                <a
                                                   href={
                                                      socials[
                                                         article.author.username
                                                      ].website
                                                   }
                                                   target='_blank'
                                                   rel='noreferrer'
                                                   className=' hover:underline flex items-center gap-1'
                                                >
                                                   <FaGlobe /> Website
                                                </a>
                                             )}
                                          </div>
                                       </div>
                                    </div>

                                    <a
                                       href={article.url}
                                       target='_blank'
                                       rel='noopener noreferrer'
                                       className='text-3xl font-bold text-white hover:underline '
                                    >
                                       {article.title}
                                    </a>

                                    <div className='text-sm text-white mt-6 space-y-4'>
                                       <p className='text-lg text-gray-500'>
                                          <strong>Slug:</strong>{' '}
                                          <span className='text-white'>
                                             {article.slug}
                                          </span>
                                       </p>
                                       <p className='text-lg text-gray-500'>
                                          <strong>Published:</strong>{' '}
                                          <span className='text-white'>
                                             {new Date(
                                                article.publishedAt
                                             ).toLocaleString()}
                                          </span>
                                       </p>
                                       <p className='text-lg text-gray-500'>
                                          <strong>Updated:</strong>{' '}
                                          <span className='text-white'>
                                             {new Date(
                                                article.updatedAt
                                             ).toLocaleString()}
                                          </span>
                                       </p>
                                       <p className='text-lg text-gray-500'>
                                          <strong>Views:</strong>{' '}
                                          <span className='text-white'>
                                             {article.views ?? 'N/A'}
                                          </span>{' '}
                                          | <strong>Comments:</strong>{' '}
                                          <span className='text-white'>
                                             {article.responseCount}
                                          </span>
                                       </p>
                                    </div>

                                    <div className='mt-4 flex flex-wrap gap-3'>
                                       {article.tags?.map((tag) => (
                                          <span
                                             key={tag.slug}
                                             className='bg-emerald-500 text-black text-xs px-4 py-2 rounded-full'
                                          >
                                             #{tag.slug}
                                          </span>
                                       ))}
                                    </div>
                                 </div>

                                 {/* //?? Feedback section  */}
                                 <div className='bg-emerald-500/20 p-4 rounded-lg shadow-lg border border-emerald-500 w-1/3'>
                                    {/* <div className='bg-gray-800 p-8 rounded-lg shadow-lg mt-10'> */}
                                    <h3 className='text-2xl font-bold text-gold-400 mb-6 mx-auto'>
                                       Feedback Section
                                    </h3>
                                    <form
                                       className='space-y-2'
                                       onSubmit={handleFeedbackSubmit}
                                    >
                                       <div>
                                          <label
                                             className='block text-gray-300 font-medium mb-2'
                                             htmlFor='authorEmail'
                                          >
                                             Author Email
                                          </label>
                                          <input
                                             type='email'
                                             id='authorEmail'
                                             className='w-full border border-gray-600 bg-gray-400/60 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white text-white disabled:bg-gray-600 disabled:cursor-not-allowed'
                                             placeholder='Enter Author email'
                                             value={
                                                socials[article.author.username]
                                                   ?.email
                                                   ? socials[
                                                        article.author.username
                                                     ]?.email
                                                   : authorEmail
                                             }
                                             onChange={(e) => {
                                                if (
                                                   !socials[
                                                      article.author.username
                                                   ]?.email
                                                ) {
                                                   return setAuthorEmail(
                                                      e.target.value
                                                   )
                                                }
                                             }}
                                             disabled={
                                                socials[article.author.username]
                                                   ?.email
                                             }
                                             required
                                          />
                                       </div>

                                       <div>
                                          <label
                                             className='block text-gray-300 font-medium mb-2'
                                             htmlFor='senderEmail'
                                          >
                                             Sender Email
                                          </label>
                                          <input
                                             type='email'
                                             id='senderEmail'
                                             className='w-full border border-gray-600 bg-gray-400/60 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white text-white disabled:bg-gray-600 disabled:cursor-not-allowed'
                                             placeholder='Your email'
                                             value={userDetail.email}
                                             disabled
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
                                             className='w-full border border-gray-600 bg-gray-400/60 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white text-white'
                                             placeholder='Article Feedback'
                                             value={`Feedback for: ${article.title} `}
                                             onChange={(e) =>
                                                setTitle(e.target.value)
                                             }
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
                                             rows='5'
                                             value={feedback}
                                             onChange={(e) =>
                                                setFeedback(e.target.value)
                                             }
                                             required
                                          ></textarea>
                                       </div>

                                       <button
                                          type='submit'
                                          className='w-full bg-gold-600 hover:bg-gold-700  bg-white/50 hover:bg-white-700 text-black font-bold py-3 px-5 rounded-md border border-emerald-500 mx-auto transition-all  hover:scale-95 duration-300 '
                                       >
                                          Submit Feedback
                                       </button>
                                    </form>
                                    {/* </div> */}
                                 </div>
                              </div>
                           ))}
                        </div>
                     </>
                  )}
               </>
            )}
         </div>
      </>
   )
}
