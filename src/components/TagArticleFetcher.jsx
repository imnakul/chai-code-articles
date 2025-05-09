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
   FaGoogle,
} from 'react-icons/fa'
import { MdArrowOutward } from 'react-icons/md'
import Navbar from './Navbar'
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
import { login, logout } from '../store/userSlice.js'
import { useSelector } from 'react-redux'
import { Footer } from './Footer.jsx'
import {
   setArticles,
   clearArticles,
   setSocials,
   clearSocials,
} from '../store/articleSlice.js'

{
   /* 
//?? SENDING THROUGH GMAIL API - NEED SETUP PROPER TO USE IT, RIGHT NOW CONNECTED WITH
//?? vikkasID account added , right now to send, so anyone can send feedback with one click 
//?? And that will be gone using my id, can make it work for chaicode, detail in notion doc,
// ?? Right now disabling it and adding manual Sending of mail 
*/
}
const sendEmail = async (authorEmail, title, feedback) => {
   console.log('Ab', authorEmail, title, feedback)
   const res = await fetch('/api/sendEmail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
         to: { authorEmail },
         subject: { title },
         message: { feedback },
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
   const [showModal, setShowModal] = useState(false)
   const [progressMessages, setProgressMessages] = useState([])

   const [authorEmail, setAuthorEmail] = useState('')
   const [userEmail, setUserEmail] = useState('')
   const [title, setTitle] = useState('')
   const [feedback, setFeedback] = useState('')
   const [loggedIn, setLoggedIn] = useState(false)
   const [authToken, setAuthToken] = useState('')
   const [QR, setQR] = useState('')

   const [searchTerm, setSearchTerm] = useState('')
   const [sortBy, setSortBy] = useState('')
   const [sortOrder, setSortOrder] = useState('desc')
   const [filterBy, setFilterBy] = useState('')
   const userDetail = useSelector((state) => state.user.userInfo)
   const articles = useSelector((state) => state.article.articles)
   const socials = useSelector((state) => state.article.socials)
   const dispatch = useDispatch()

   useEffect(() => {
      if (userEmail) {
         setUserEmail(userDetail.email)
      }
   }, [userDetail])

   //~ Fetching Articles
   const handleSubmit = async (e) => {
      e.preventDefault()
      setLoading(true)
      dispatch(clearArticles())
      setProgressMessages([]) // Clear previous messages

      try {
         const result = await fetchArticlesWithAllTags(
            [tag1, tag2],
            pages,
            // Progress callback
            (message) => {
               setProgressMessages((prev) => [...prev, message])
            }
         )

         if (result.length === 0) {
            window.alert('No articles found containing both tags.')
         }
         dispatch(setArticles(result))

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
         dispatch(setSocials(socialData))
         console.log('Social data', socialData)
      } catch (err) {
         console.error('Error fetching articles:', err)
         setProgressMessages((prev) => [...prev, `❌ Error: ${err.message}`])
      }

      setLoading(false)
   }

   //~ Function to filter and sort articles
   const getFilteredAndSortedArticles = () => {
      let result = [...articles]

      // Apply search filter
      if (searchTerm) {
         const searchLower = searchTerm.toLowerCase()
         result = result.filter(
            (article) =>
               article.title.toLowerCase().includes(searchLower) ||
               article.brief?.toLowerCase().includes(searchLower) ||
               article.tags.some((tag) =>
                  tag.slug.toLowerCase().includes(searchLower)
               )
         )
      }

      // Apply filters
      if (filterBy) {
         switch (filterBy) {
            case 'lastWeek':
               const weekAgo = new Date()
               weekAgo.setDate(weekAgo.getDate() - 7)
               result = result.filter(
                  (article) => new Date(article.publishedAt) >= weekAgo
               )
               break
            case 'lastMonth':
               const monthAgo = new Date()
               monthAgo.setDate(monthAgo.getDate() - 30)
               result = result.filter(
                  (article) => new Date(article.publishedAt) >= monthAgo
               )
               break
            case 'highViews':
               result = result.filter((article) => article.views >= 1000)
               break
            case 'hasGithub':
               result = result.filter(
                  (article) => socials[article.author.username]?.github
               )
               break
         }
      }

      // Apply sorting
      if (sortBy) {
         result.sort((a, b) => {
            let aValue = a[sortBy]
            let bValue = b[sortBy]

            // Handle date fields
            if (['publishedAt', 'updatedAt'].includes(sortBy)) {
               aValue = new Date(aValue).getTime()
               bValue = new Date(bValue).getTime()
            }

            if (sortOrder === 'asc') {
               return aValue > bValue ? 1 : -1
            }
            return aValue < bValue ? 1 : -1
         })
      }

      return result
   }

   // Get filtered articles
   const filteredArticles = getFilteredAndSortedArticles()

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

         const userInfo = {
            name: user.displayName,
            email: user.email,
            photo: user.photoURL,
            uid: user.uid,
         }

         dispatch(login({ userInfo, userToken: token }))
      } catch (error) {
         console.error('Error signing in with Google:', error)
      } finally {
         setShowModal(false)
      }
   }

   const handleLogout = async () => {
      try {
         await signOut(auth)
         dispatch(logout())
      } catch (error) {
         console.error('Error signing out:', error)
      } finally {
         setShowModal(false)
      }
   }
   //~Authentication Complete

   //~ FeedBack submit
   const handleFeedbackSubmit = async (authorEmail, title, feedback) => {
      await sendEmail(authorEmail, title, feedback)
      setFeedback('')
   }

   return (
      <>
         {/* <div className='bg-[linear-gradient(to_right,_rgb(58,28,113),_rgb(215,109,119),_rgb(255,175,123))] min-h-screen w-full'> */}

         <div class='bg-[linear-gradient(89.7deg,_rgb(0,0,0)_-10.7%,_rgb(53,92,125)_88.8%)] min-h-screen w-full'>
            <Navbar
               showModal={showModal}
               setShowModal={setShowModal}
               QR={QR}
               setQR={setQR}
            />
            {/* //~ SIgn in Modal */}
            {showModal && (
               <Modal
                  showModal={showModal}
                  setShowModal={setShowModal}
                  modalContainerClass='w-[90vw] max-w-md border-2 border-cyan-500 p-4 sm:p-6'
                  header='Login / Logout'
                  handleCloseModalOutsideClick={() => setShowModal(false)}
               >
                  <div className='p-2 sm:p-4'>
                     {!loggedIn ? (
                        <button
                           onClick={handleLogin}
                           className='w-full sm:w-auto bg-cyan-950 text-cyan-300 font-bold py-2 px-4 rounded-lg border border-cyan-500 mx-auto transition-all hover:scale-95 duration-300 hover:bg-cyan-800 focus:bg-cyan-800 flex items-center justify-center gap-2'
                        >
                           <FaGoogle className='text-lg' />
                           <span>Sign In with Google</span>
                        </button>
                     ) : (
                        <div className='flex flex-col items-center justify-between gap-4 w-full p-4'>
                           <div className='flex items-center gap-2 text-center'>
                              <span className='text-white text-sm sm:text-base'>
                                 Logged In User:
                              </span>
                              <span className='font-semibold text-white'>
                                 {userDetail.name}
                              </span>
                           </div>
                           <button
                              onClick={handleLogout}
                              className='w-full sm:w-auto bg-cyan-950 text-cyan-300 font-bold py-2 px-4 rounded-lg border border-cyan-500 mx-auto transition-all hover:scale-95 duration-300 hover:bg-cyan-800 focus:bg-cyan-800'
                           >
                              Log Out
                           </button>
                        </div>
                     )}
                  </div>
               </Modal>
            )}

            {/* //~ QR Modal */}
            {QR && (
               <Modal
                  showModal={QR}
                  setShowModal={setQR}
                  modalContainerClass='w-[90vw] sm:w-full sm:max-w-sm p-4 sm:p-6 lg:p-10'
                  closeModalOutsideClick={() => setQR(false)}
                  header='Scan / Click to Give me a Boost'
               >
                  <div className='flex items-center justify-center w-full p-2'>
                     <a
                        href='https://www.buymeacoffee.com/imnakul'
                        target='_blank'
                        className='block w-full max-w-[200px] sm:max-w-[288px]'
                     >
                        <img
                           src='/qr.png'
                           className='w-full h-auto'
                           alt='Buy me a coffee QR code'
                        />
                     </a>
                  </div>
               </Modal>
            )}

            {/* //?? Loading  */}
            {loading ? (
               <div className='flex flex-col items-center justify-center min-h-[50vh] px-4 sm:px-6 lg:px-8'>
                  <FaSpinner className='text-cyan-400 font-bold text-4xl sm:text-5xl lg:text-6xl animate-spin mb-4' />
                  <p className='text-xl sm:text-2xl font-semibold text-white mb-4 text-center'>
                     Fetching articles...
                  </p>
                  <div className='max-w-md w-full space-y-2 bg-gray-800/50 p-4 rounded-lg'>
                     {progressMessages.map((message, index) => (
                        <p
                           key={index}
                           className='text-xs sm:text-sm text-cyan-300 font-mono'
                           style={{
                              animation: 'fadeIn 0.5s ease-in-out',
                           }}
                        >
                           {message}
                        </p>
                     ))}
                  </div>
               </div>
            ) : (
               <>
                  {/* Form section */}
                  <div className='max-w-sm md:max-w-3xl lg:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12'>
                     <div className='flex flex-col lg:flex-row items-center justify-around gap-6 lg:gap-12'>
                        <img
                           src='/haf.png'
                           alt='Logo'
                           className='w-full max-w-[200px] sm:max-w-[300px] lg:max-w-md hover:scale-105 transition-all duration-800 ease-in-out'
                        />
                        <form
                           onSubmit={handleSubmit}
                           className='w-full max-w-xl bg-black/20 p-4 sm:p-6 lg:p-8 rounded-lg shadow-lg border-2 border-cyan-500'
                        >
                           <h2 className='text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 text-center text-white'>
                              Find Articles by Tags
                           </h2>

                           <div className='space-y-4 sm:space-y-6'>
                              <div>
                                 <label className='mb-2 text-white font-medium flex flex-col sm:flex-row sm:items-center sm:justify-between px-1 gap-2'>
                                    <span>Tag 1</span>
                                    <span className='text-xs text-gray-400'>
                                       its tag slug not tag | small letters only
                                    </span>
                                 </label>
                                 <input
                                    type='text'
                                    value={tag1}
                                    onChange={(e) => setTag1(e.target.value)}
                                    className='w-full border border-cyan-500 bg-gray-400/60 px-4 py-2 sm:py-3 rounded focus:outline-none focus:ring-2 focus:ring-white-500 text-white'
                                    placeholder='e.g., chaicode, chai-code, qdrant, python ,genai, ai'
                                    required
                                 />
                              </div>

                              <div>
                                 <label className='mb-2 text-white font-medium flex flex-col sm:flex-row sm:items-center sm:justify-between px-1 gap-2'>
                                    <span>Tag 2</span>
                                    <span className='text-xs text-gray-400'>
                                       its tag slug not tag | small letters only
                                    </span>
                                 </label>
                                 <input
                                    type='text'
                                    value={tag2}
                                    onChange={(e) => setTag2(e.target.value)}
                                    className='w-full border border-cyan-500 bg-gray-400/60 px-4 py-2 sm:py-3 rounded focus:outline-none focus:ring-2 focus:ring-white-500 text-white'
                                    placeholder='e.g., rag , advanced-rag, generative-ai , query-optimization'
                                    required
                                 />
                              </div>

                              <div>
                                 <label className='mb-2 text-white font-medium flex flex-col sm:flex-row sm:items-center sm:justify-between px-1 gap-2'>
                                    <span>Pages</span>
                                    <span className='text-xs text-gray-400'>
                                       [ 1 Page = 50 Articles ]
                                    </span>
                                 </label>
                                 <input
                                    type='number'
                                    value={pages}
                                    onChange={(e) =>
                                       setPages(Number(e.target.value))
                                    }
                                    className='w-full border border-cyan-500 bg-gray-400/60 px-4 py-2 sm:py-3 rounded focus:outline-none focus:ring-2 focus:ring-white-500 text-white'
                                    min={1}
                                    required
                                 />
                              </div>
                           </div>

                           <div className='flex justify-center mt-6 sm:mt-8'>
                              <button
                                 type='submit'
                                 className='bg-cyan-950 text-cyan-300 font-bold py-2 px-6 sm:px-8 rounded-lg border border-cyan-500 transition-all hover:scale-95 duration-300 hover:bg-cyan-800 focus:bg-cyan-800 cursor-pointer'
                              >
                                 Search
                              </button>
                           </div>
                        </form>
                     </div>
                  </div>

                  {articles.length > 0 && (
                     <>
                        <div className='max-w-6xl mx-auto space-y-6 sm:space-y-10 px-4 sm:px-6 lg:px-8'>
                           {/* Heading */}
                           <div className='relative flex flex-col sm:flex-row items-center justify-center w-full gap-4'>
                              <span className='text-xl sm:text-2xl lg:text-3xl font-semibold text-cyan-200 text-center'>
                                 Found {articles.length} Articles with common
                                 Tags
                              </span>
                              <button
                                 onClick={() => {
                                    setTag1('')
                                    setTag2('')
                                    setPages(1)
                                    dispatch(clearArticles())
                                    dispatch(clearSocials())
                                 }}
                                 className='sm:absolute sm:right-2 bg-red-900/40 text-red-300 font-bold py-1 px-3 rounded-lg border border-red-500 transition-all hover:scale-95 duration-300 hover:bg-red-700 focus:bg-red-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                                 disabled={articles.length === 0}
                              >
                                 Reset
                              </button>
                           </div>

                           {/* Control Panel */}
                           <div className='bg-gray-800/30 p-4 sm:p-6 rounded-lg border border-cyan-500'>
                              <div className='flex flex-col gap-4'>
                                 {/* Search */}
                                 <div className='w-full'>
                                    <input
                                       type='text'
                                       placeholder='Search articles...'
                                       value={searchTerm}
                                       onChange={(e) =>
                                          setSearchTerm(e.target.value)
                                       }
                                       className='w-full px-4 py-2 bg-cyan-950 text-white rounded-lg border border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500'
                                    />
                                 </div>

                                 <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
                                    {/* Sort */}
                                    <div className='flex flex-wrap items-center gap-4 w-full sm:w-auto'>
                                       <select
                                          value={sortBy}
                                          onChange={(e) =>
                                             setSortBy(e.target.value)
                                          }
                                          className='w-full sm:w-auto px-4 py-2 bg-cyan-950 text-white rounded-lg border border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500'
                                       >
                                          <option value=''>Sort by...</option>
                                          <option value='views'>Views</option>
                                          <option value='publishedAt'>
                                             Published Date
                                          </option>
                                          <option value='updatedAt'>
                                             Updated Date
                                          </option>
                                          <option value='responseCount'>
                                             Comments
                                          </option>
                                       </select>

                                       {sortBy && (
                                          <select
                                             value={sortOrder}
                                             onChange={(e) =>
                                                setSortOrder(e.target.value)
                                             }
                                             className='w-full sm:w-auto px-4 py-2 bg-cyan-950 text-white rounded-lg border border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500'
                                          >
                                             <option value='desc'>
                                                Descending
                                             </option>
                                             <option value='asc'>
                                                Ascending
                                             </option>
                                          </select>
                                       )}
                                    </div>

                                    {/* Filter */}
                                    <div className='w-full sm:w-auto'>
                                       <select
                                          value={filterBy}
                                          onChange={(e) =>
                                             setFilterBy(e.target.value)
                                          }
                                          className='w-full px-4 py-2 bg-cyan-950 text-white rounded-lg border border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500'
                                       >
                                          <option value=''>Filter by...</option>
                                          <option value='lastWeek'>
                                             Last 7 days
                                          </option>
                                          <option value='lastMonth'>
                                             Last 30 days
                                          </option>
                                          <option value='highViews'>
                                             100+ views
                                          </option>
                                          <option value='hasGithub'>
                                             Has Email
                                          </option>
                                       </select>
                                    </div>
                                 </div>

                                 {/* Results count */}
                                 <div className='text-gray-300 text-sm sm:text-base'>
                                    Showing {filteredArticles.length} of{' '}
                                    {articles.length} articles
                                 </div>
                              </div>
                           </div>

                           {/* Articles */}
                           {filteredArticles.map((article, i) => (
                              <div
                                 key={i}
                                 className='bg-gray-600/40 p-4 sm:p-6 lg:p-8 rounded-lg shadow-lg mt-4 flex flex-col lg:flex-row items-start justify-between w-full gap-4'
                              >
                                 {/* Article Detail Section */}
                                 <div
                                    className='w-full lg:w-2/3 p-4 bg-cyan-950 border border-cyan-500 rounded-lg flex flex-col
                                    justify-around space-y-6'
                                    key={article.title}
                                 >
                                    {/* Author details with Links */}
                                    <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-0'>
                                       <img
                                          src={article.author.profilePicture}
                                          alt={article.author.name}
                                          className='w-16 h-16 rounded-full sm:mr-6 object-cover border-2 border-cyan-500'
                                       />
                                       <div>
                                          <p className='font-semibold text-lg sm:text-xl text-white'>
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
                                                   <FaGithub /> GitHub{' '}
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
                                                   <FaTwitter /> Twitter{' '}
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
                                                   <FaInstagram /> Instagram{' '}
                                                </a>
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
                                                   <FaGlobe /> Website{' '}
                                                </a>
                                             )}
                                          </div>
                                       </div>
                                    </div>
                                    {/* Article Title with Link */}
                                    <div className=''>
                                       <a
                                          href={article.url}
                                          target='_blank'
                                          rel='noopener noreferrer'
                                          className='text-xl sm:text-2xl lg:text-3xl font-bold text-cyan-300 hover:underline filter-text-glow-hover line-clamp-2'
                                       >
                                          {article.title}
                                       </a>
                                    </div>
                                    {/* Details of article */}
                                    <div className='text-xs sm:text-sm text-white space-y-2'>
                                       <p className=' text-gray-400'>
                                          <strong>Slug:</strong>{' '}
                                          <span className='text-white text-base'>
                                             {article.slug}
                                          </span>
                                       </p>
                                       <p className=' text-gray-400'>
                                          <strong>Published:</strong>{' '}
                                          <span className='text-white text-base'>
                                             {new Date(
                                                article.publishedAt
                                             ).toLocaleString()}
                                          </span>
                                       </p>
                                       <p className=' text-gray-400'>
                                          <strong>Updated:</strong>{' '}
                                          <span className='text-white text-base'>
                                             {new Date(
                                                article.updatedAt
                                             ).toLocaleString()}
                                          </span>
                                       </p>
                                       <p className=' text-gray-400'>
                                          <strong>Views:</strong>{' '}
                                          <span className='text-white text-base'>
                                             {article.views ?? 'N/A'}
                                          </span>{' '}
                                          | <strong>Comments:</strong>{' '}
                                          <span className='text-lg text-white'>
                                             {article.responseCount}
                                          </span>
                                       </p>
                                    </div>
                                    {/* Tag Slugs */}
                                    <div className=' flex flex-wrap gap-2 sm:gap-3'>
                                       {article.tags?.map((tag) => (
                                          <span
                                             key={tag.slug}
                                             className='bg-cyan-500 text-black text-xs px-4 py-2 rounded-full'
                                          >
                                             #{tag.slug}
                                          </span>
                                       ))}
                                    </div>
                                 </div>

                                 {/* Feedback section */}
                                 <div className='bg-cyan-950 p-4 rounded-lg shadow-lg border border-cyan-500 w-full lg:w-1/3'>
                                    <div
                                       className='flex items-center w-full mx-auto'
                                       key={article.title}
                                    >
                                       <h3 className='text-xl sm:text-2xl font-bold text-cyan-300 mb-3 mx-auto'>
                                          Feedback Section
                                       </h3>
                                    </div>
                                    <form
                                       className='space-y-2 sm:space-y-4'
                                       onSubmit={(e) => {
                                          e.preventDefault()
                                          handleFeedbackSubmit(
                                             socials[article.author.username]
                                                ?.email,
                                             `Feedback for: ${article.title}`,
                                             feedback
                                          )
                                       }}
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
                                             htmlFor='title'
                                          >
                                             Title
                                          </label>
                                          <input
                                             type='text'
                                             id='title'
                                             className='w-full border border-gray-600 bg-gray-400/60 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white text-white disabled:bg-gray-600 disabled:cursor-not-allowed'
                                             placeholder='Article Feedback'
                                             value={`Feedback for: ${article.title}`}
                                             required
                                             disabled
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
                                          className='bg-cyan-950  text-cyan-300 font-bold py-2 px-4 rounded-lg border border-cyan-500 transition-all  hover:scale-95 duration-300 hover:bg-cyan-800 focus:bg-cyan-800 cursor-pointer mx-auto w-full'
                                       >
                                          Submit Feedback
                                       </button>
                                    </form>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </>
                  )}
               </>
            )}
            <Footer />
         </div>
      </>
   )
}
