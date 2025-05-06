import React, { useEffect, useState } from 'react'
import {
   fetchArticlesWithAllTags,
   fetchUserSocialLinks,
} from '../functions/fetcharticles'
import { getGitHubEmail } from '../functions/fetchemail'

export default function TagArticleFetcher() {
   const [tag1, setTag1] = useState('')
   const [tag2, setTag2] = useState('')
   const [pages, setPages] = useState(5)
   const [loading, setLoading] = useState(false)
   const [articles, setArticles] = useState([])
   const [socials, setSocials] = useState({})

   const handleSubmit = async (e) => {
      e.preventDefault()
      setLoading(true)
      setArticles([])

      try {
         const result = await fetchArticlesWithAllTags([tag1, tag2], pages)

         setArticles(result)

         const usernames = [
            ...new Set(result.map((article) => article.author.username)),
         ]

         const socialData = {}
         for (const username of usernames) {
            try {
               // Step 1: Fetch social links
               const links = await fetchUserSocialLinks(username)
               socialData[username] = { ...links }

               // Step 2: If GitHub exists, fetch email
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

   useEffect(() => {
      console.log('articles', articles)
      console.log('socials', socials)
   }, [articles])

   return (
      <div className='min-h-screen p-8 bg-slate-700'>
         {loading ? (
            <div className='flex items-center justify-center h-screen'>
               <div className='text-center'>
                  <div className='loader mb-4 border-t-4 border-blue-500 rounded-full w-16 h-16 animate-spin mx-auto'></div>
                  <p className='text-xl text-gray-600 font-semibold'>
                     Fetching articles...
                  </p>
               </div>
            </div>
         ) : (
            <>
               <form
                  onSubmit={handleSubmit}
                  className='bg-white p-6 rounded-md shadow-md max-w-2xl mx-auto mb-10'
               >
                  <h2 className='text-2xl font-semibold mb-4 text-center text-blue-700'>
                     Find Articles by Tags
                  </h2>

                  <div className='mb-4'>
                     <label className='block mb-1 text-gray-700 font-medium'>
                        Tag 1
                     </label>
                     <input
                        type='text'
                        value={tag1}
                        onChange={(e) => setTag1(e.target.value)}
                        className='w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400'
                        placeholder='e.g., chaicode'
                        required
                     />
                  </div>

                  <div className='mb-4'>
                     <label className='block mb-1 text-gray-700 font-medium'>
                        Tag 2
                     </label>
                     <input
                        type='text'
                        value={tag2}
                        onChange={(e) => setTag2(e.target.value)}
                        className='w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400'
                        placeholder='e.g., rag'
                        required
                     />
                  </div>

                  <div className='mb-6'>
                     <label className='block mb-1 text-gray-700 font-medium'>
                        Pages to Fetch
                     </label>
                     <input
                        type='number'
                        value={pages}
                        onChange={(e) => setPages(Number(e.target.value))}
                        className='w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400'
                        min={1}
                        required
                     />
                  </div>

                  <button
                     type='submit'
                     className='w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition'
                  >
                     Search
                  </button>
               </form>

               {articles.length > 0 && (
                  <div className='max-w-5xl mx-auto space-y-8'>
                     {articles.map((article, i) => (
                        <div key={i} className='bg-white p-6 rounded shadow-md'>
                           {/* Author Info */}
                           <div className='flex items-center mb-4'>
                              <img
                                 src={article.author.profilePicture}
                                 alt={article.author.name}
                                 className='w-12 h-12 rounded-full mr-4 object-cover'
                              />
                              <div>
                                 <p className='font-semibold text-lg'>
                                    {article.author.name}
                                 </p>
                                 <p className='text-sm text-gray-500 mb-1'>
                                    @{article.author.username}
                                 </p>

                                 {(() => {
                                    const links =
                                       socials[article.author.username] || {}
                                    return (
                                       <div className='flex flex-wrap gap-2 text-sm text-blue-600'>
                                          {links.github && (
                                             <a
                                                href={links.github}
                                                target='_blank'
                                                rel='noreferrer'
                                             >
                                                GitHub
                                             </a>
                                          )}
                                          {links.twitter && (
                                             <a
                                                href={links.twitter}
                                                target='_blank'
                                                rel='noreferrer'
                                             >
                                                Twitter
                                             </a>
                                          )}
                                          {links.linkedin && (
                                             <a
                                                href={links.linkedin}
                                                target='_blank'
                                                rel='noreferrer'
                                             >
                                                LinkedIn
                                             </a>
                                          )}
                                          {links.youtube && (
                                             <a
                                                href={links.youtube}
                                                target='_blank'
                                                rel='noreferrer'
                                             >
                                                YouTube
                                             </a>
                                          )}
                                          {links.instagram && (
                                             <a
                                                href={links.instagram}
                                                target='_blank'
                                                rel='noreferrer'
                                             >
                                                Instagram
                                             </a>
                                          )}
                                          {links.facebook && (
                                             <a
                                                href={links.facebook}
                                                target='_blank'
                                                rel='noreferrer'
                                             >
                                                Facebook
                                             </a>
                                          )}
                                          {links.website && (
                                             <a
                                                href={links.website}
                                                target='_blank'
                                                rel='noreferrer'
                                             >
                                                Website
                                             </a>
                                          )}
                                          {links.stackoverflow && (
                                             <a
                                                href={links.stackoverflow}
                                                target='_blank'
                                                rel='noreferrer'
                                             >
                                                StackOverflow
                                             </a>
                                          )}
                                          {links.email && (
                                             <p className='text-sm text-gray-600 mt-1'>
                                                📧 <strong>Email:</strong>{' '}
                                                {links.email}
                                             </p>
                                          )}
                                       </div>
                                    )
                                 })()}
                              </div>
                           </div>

                           {/* Article Title */}
                           <a
                              href={article.url}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='text-2xl font-bold text-blue-700 hover:underline'
                           >
                              {article.title}
                           </a>

                           {/* Meta Info */}
                           <div className='text-sm text-gray-600 mt-2'>
                              <p>
                                 <strong>Slug:</strong> {article.slug}
                              </p>
                              <p>
                                 <strong>Published:</strong>{' '}
                                 {new Date(
                                    article.publishedAt
                                 ).toLocaleString()}
                              </p>
                              <p>
                                 <strong>Updated:</strong>{' '}
                                 {new Date(article.updatedAt).toLocaleString()}
                              </p>
                              <p>
                                 <strong>Views:</strong>{' '}
                                 {article.views ?? 'N/A'} |{' '}
                                 <strong>Comments:</strong>{' '}
                                 {article.responseCount}
                              </p>
                           </div>

                           {/* Tags */}
                           <div className='mt-3 flex flex-wrap gap-2'>
                              {article.tags?.map((tag) => (
                                 <span
                                    key={tag.slug}
                                    className='bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full'
                                 >
                                    #{tag.slug}
                                 </span>
                              ))}
                           </div>
                        </div>
                     ))}
                  </div>
               )}
            </>
         )}
      </div>
   )
}
