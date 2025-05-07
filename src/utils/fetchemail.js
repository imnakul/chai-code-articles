// If using Node.js, install node-fetch

// Function to extract the GitHub username from the URL
function extractGitHubUsername(url) {
   const regex = /https:\/\/github\.com\/([a-zA-Z0-9_-]+)/
   const match = url.match(regex)
   if (match) {
      return match[1]
   } else {
      throw new Error('Invalid GitHub URL')
   }
}

// Function to fetch the GitHub user's email from commits
export async function getGitHubEmail(githubUrl) {
   try {
      // Extract the username from the URL
      const username = extractGitHubUsername(githubUrl)

      // Fetch the user's repositories
      const reposResponse = await fetch(
         `https://api.github.com/users/${username}/repos`
      )
      const repos = await reposResponse.json()

      if (repos.message && repos.message.includes('rate limit')) {
         throw new Error('⚠️ GitHub rate limit exceeded. Use a token.')
      }

      if (!repos || repos.length === 0) {
         throw new Error('No repositories found for this user.')
      }

      // Loop through repositories and get the commit history
      for (const repo of repos) {
         // Get the commits for each repository
         const commitsResponse = await fetch(
            `https://api.github.com/repos/${username}/${repo.name}/commits?author=${username}`
         )
         const commits = await commitsResponse.json()

         // Loop through commits and find an email
         for (const commit of commits) {
            const email = commit.commit.author.email
            if (email && !email.includes('noreply')) {
               // Return the email if it's valid
               console.log(`Found email for ${username}: ${email}`)
               return email
            }
         }
      }

      // If no real email is found
      console.log('No real email found.')
      return null
   } catch (error) {
      console.error('Error fetching data:', error)
      return null
   }
}

// Example usage
// const githubUrl = 'https://github.com/ShriyashParandkar23' // Replace with the GitHub profile URL
// getGitHubEmail(githubUrl).then((email) => {
//    if (email) {
//       console.log(`Email found: ${email}`)
//    } else {
//       console.log('Email could not be found.')
//    }
// })
