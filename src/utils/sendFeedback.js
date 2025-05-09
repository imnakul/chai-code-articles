export const sendFeedback = (sMail, to, title, feedback) => {
   const subject = encodeURIComponent(title)
   const body = encodeURIComponent(`From: ${sMail}\n\nFeedback:\n${feedback}`)

   console.log('Sending Mail', sMail, to, title, feedback)
   const mailtoUrl = `mailto:${to}?subject=${subject}&body=${body}`
   console.log('mailtoUrl', mailtoUrl)
   window.location.href = mailtoUrl
}
