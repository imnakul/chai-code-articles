// import fs from 'fs/promises'
// import path from 'path'

const HASHNODE_API = 'https://gql.hashnode.com/'

const query = `
  query Tag($slug: String!, $after: String) {
    tag(slug: $slug) {
      id
      name
      slug
      posts(first: 50, after: $after, filter: {sortBy:recent}) {
        edges {
          node {
            title
            slug
            url
            publishedAt
            updatedAt
            
            views
            
            responseCount
            tags {
              name
              slug
            }
            author {
              name
              username
              profilePicture
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`

// async function fetchAllArticlesByTag(slug, maxPages = 60) {
//    console.log(`🔍 Fetching articles for tag: "${slug}"`)
//    let allArticles = []
//    let hasNextPage = true
//    let after = null
//    let page = 1

//    while (hasNextPage && page <= maxPages) {
//       console.log(`  📄 Fetching page ${page} for "${slug}"...`)
//       const response = await fetch(HASHNODE_API, {
//          method: 'POST',
//          headers: { 'Content-Type': 'application/json' },
//          body: JSON.stringify({
//             query,
//             variables: { slug, after },
//          }),
//       })

//       const data = await response.json()

//       if (!response.ok || data.errors) {
//          console.warn(`❌ GraphQL Error for tag "${slug}":`, data.errors)
//          break
//       }

//       const edges = data.data.tag?.posts?.edges || []
//       const articles = edges.map((edge) => edge.node)
//       allArticles.push(...articles)

//       const pageInfo = data.data.tag?.posts?.pageInfo
//       hasNextPage = pageInfo?.hasNextPage
//       after = pageInfo?.endCursor
//       page++
//    }

//    console.log(`✅ Total articles fetched for "${slug}": ${allArticles.length}`)
//    return allArticles
// }

// export async function fetchArticlesWithAllTags(slugs = [], minCommon = 10) {
//    if (slugs.length < 2) {
//       throw new Error('Please provide at least two tag slugs.')
//    }

//    console.log(`🚀 Starting multi-tag article search: ${slugs.join(', ')}`)

//    const [firstTag, ...otherTags] = slugs

//    // Fetch all articles for the first tag
//    const firstArticles = await fetchAllArticlesByTag(firstTag)
//    let commonArticles = [...firstArticles]

//    // For each subsequent tag, filter common articles
//    for (const tag of otherTags) {
//       const nextArticles = await fetchAllArticlesByTag(tag)
//       const urlsInNext = new Set(nextArticles.map((a) => a.url))

//       commonArticles = commonArticles.filter((article) =>
//          urlsInNext.has(article.url)
//       )

//       console.log(
//          `🤝 Common articles after tag "${tag}": ${commonArticles.length}`
//       )

//       // Stop early if we already have enough
//       if (commonArticles.length >= minCommon) break
//    }

//    console.log(`🎯 Final common articles: ${commonArticles.length}`)
//    return commonArticles
// }

//~ Main function

async function fetchAllArticlesByTag(slug, maxPages, onProgress) {
   onProgress?.(`🔍 Fetching articles for tag: "${slug}"`)
   let allArticles = []
   let hasNextPage = true
   let after = null
   let page = 1

   while (hasNextPage && page <= maxPages) {
      console.log(`  📄 Fetching page ${page} for "${slug}"...`)
      const response = await fetch(HASHNODE_API, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
            query,
            variables: { slug, after },
         }),
      })

      const data = await response.json()

      if (!response.ok || data.errors) {
         console.warn(`❌ GraphQL Error for tag "${slug}":`, data.errors)
         break
      }

      const edges = data.data.tag?.posts?.edges || []
      const articles = edges.map((edge) => edge.node)
      allArticles.push(...articles)

      const pageInfo = data.data.tag?.posts?.pageInfo
      hasNextPage = pageInfo?.hasNextPage
      after = pageInfo?.endCursor
      page++
   }

   onProgress?.(
      `✅ Total articles fetched for "${slug}": ${allArticles.length}`
   )
   return allArticles
}

export async function fetchArticlesWithAllTags(
   tags = [],
   maxPages = 10,
   onProgress
) {
   if (tags.length === 0) return []

   onProgress?.(`🚀 Starting multi-tag article search: ${tags.join(', ')}`)

   let commonArticles = await fetchAllArticlesByTag(
      tags[0],
      maxPages,
      onProgress
   )
   //  onProgress?.(
   //     `📊 Found ${commonArticles.length} articles for tag "${tags[0]}"`
   //  )

   for (let i = 1; i < tags.length; i++) {
      onProgress?.(`🔍 Searching articles with tag "${tags[i]}"...`)
      const nextArticles = await fetchAllArticlesByTag(
         tags[i],
         maxPages,
         onProgress
      )

      const urlsInNext = new Set(nextArticles.map((a) => a.url))
      commonArticles = commonArticles.filter((article) =>
         urlsInNext.has(article.url)
      )

      // onProgress?.(
      //    `🤝 Found ${commonArticles.length} common articles with tag "${tags[i]}"`
      // )
   }

   onProgress?.(
      `✅ Search complete! Found ${commonArticles.length} articles with all tags`
   )
   return commonArticles
}

export async function fetchUserSocialLinks(username) {
   const query = `
    query User($username: String!) {
      user(username: $username) {
        socialMediaLinks {
          website
          github
          twitter
          linkedin
          instagram
          facebook
          stackoverflow
          youtube
        }
      }
    }
  `

   const response = await fetch('https://gql.hashnode.com/', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables: { username } }),
   })

   const data = await response.json()
   return data.data.user.socialMediaLinks
}

//?? Function Call
// fetchArticlesWithAllTags(['chaicode', 'rag'], 10)
//    .then(async (common) => {
//       console.log(`📦 Fetched ${common.length} articles with both tags:`)
//       logArticles(common)
//    })
//    .catch(console.error)

// async function logArticles(common) {
//    for (let article of common) {
//       const socialLinks = await fetchUserSocialLinks(article.author.username)
//       article.author.socialMediaLinks = socialLinks
//    }
//    const html = `
//       <!DOCTYPE html>
//       <html>
//         <head>
//           <meta charset="UTF-8">
//           <title>Hashnode Articles</title>
//           <style>
//             body {
//               font-family: sans-serif;
//               line-height: 1.6;
//               margin: 2rem;
//               background: #f9f9f9;
//               color: #333;
//             }
//             .article {
//               background: #fff;
//               border: 1px solid #ddd;
//               border-radius: 8px;
//               padding: 1.2rem;
//               margin-bottom: 1.5rem;
//               box-shadow: 0 1px 3px rgba(0,0,0,0.05);
//             }
//             .author {
//               display: flex;
//               align-items: center;
//               margin-bottom: 0.8rem;
//             }
//             .author img {
//               border-radius: 50%;
//               width: 36px;
//               height: 36px;
//               margin-right: 0.8rem;
//             }
//             .meta {
//               font-size: 0.9em;
//               color: #666;
//             }
//             .tags {
//               margin-top: 0.5rem;
//             }
//             .tag {
//               display: inline-block;
//               background: #e0f2ff;
//               color: #007acc;
//               padding: 2px 6px;
//               border-radius: 4px;
//               margin-right: 5px;
//               font-size: 0.8em;
//             }
//             .social-links a {
//               margin-right: 10px;
//               text-decoration: none;
//               color: #007acc;
//             }
//           </style>
//         </head>
//         <body>
//           <h1>📦 ${common.length} Articles with Both Tags</h1>
//           ${common
//              .map(
//                 (article) => `
//             <div class="article">
//               <div class="author">
//                 <img src="${
//                    article.author.profilePicture
//                 }" alt="Profile picture of ${article.author.name}" />
//                 <div>
//                   <div><strong>${article.author.name}</strong> (@${
//                    article.author.username
//                 })</div>
//                   <div class="social-links">
//                     ${
//                        article.author.socialMediaLinks.github
//                           ? `<a href="${article.author.socialMediaLinks.github}" target="_blank">GitHub</a>`
//                           : ''
//                     }
//                     ${
//                        article.author.socialMediaLinks.twitter
//                           ? `<a href="${article.author.socialMediaLinks.twitter}" target="_blank">Twitter</a>`
//                           : ''
//                     }
//                     ${
//                        article.author.socialMediaLinks.linkedin
//                           ? `<a href="${article.author.socialMediaLinks.linkedin}" target="_blank">LinkedIn</a>`
//                           : ''
//                     }
//                     ${
//                        article.author.socialMediaLinks.instagram
//                           ? `<a href="${article.author.socialMediaLinks.instagram}" target="_blank">Instagram</a>`
//                           : ''
//                     }
//                     ${
//                        article.author.socialMediaLinks.facebook
//                           ? `<a href="${article.author.socialMediaLinks.facebook}" target="_blank">Facebook</a>`
//                           : ''
//                     }
//                     ${
//                        article.author.socialMediaLinks.stackoverflow
//                           ? `<a href="${article.author.socialMediaLinks.stackoverflow}" target="_blank">StackOverflow</a>`
//                           : ''
//                     }
//                     ${
//                        article.author.socialMediaLinks.youtube
//                           ? `<a href="${article.author.socialMediaLinks.youtube}" target="_blank">YouTube</a>`
//                           : ''
//                     }
//                   </div>
//                 </div>
//               </div>
//               <h2><a href="${article.url}" target="_blank">${
//                    article.title
//                 }</a></h2>
//               <div class="meta">
//                 <p><strong>Slug:</strong> ${article.slug}</p>
//                 <p><strong>Published:</strong> ${new Date(
//                    article.publishedAt
//                 ).toLocaleString()}</p>
//                 <p><strong>Updated:</strong> ${new Date(
//                    article.updatedAt
//                 ).toLocaleString()}</p>
//                 <p><strong>Views:</strong> ${
//                    article.views ?? 'N/A'
//                 } | <strong>Comments:</strong> ${article.responseCount}</p>
//               </div>
//               <div class="tags">
//                 ${article.tags
//                    .map((tag) => `<span class="tag">#${tag.slug}</span>`)
//                    .join('')}
//               </div>
//             </div>
//           `
//              )
//              .join('')}
//         </body>
//       </html>
//     `.trim()

//    const logFilePath = path.resolve('./articles_with_social.log.html')
//    await fs.writeFile(logFilePath, html)
//    console.log(`📝 Log saved to ${logFilePath} — open in browser to view.`)
// }
