import { RiTelegram2Fill, RiGithubFill, RiLinkedinFill } from 'react-icons/ri'

const socials = [
   {
      social: 'github',
      url: 'https://github.com/imnakul',
      icon: (
         <RiGithubFill className='size-7 text-gray-900 dark:text-gray-300' />
      ),
   },
   {
      social: 'linked-In',
      url: 'https://www.linkedin.com/in/nakul-srivastava-a7426033b',
      icon: (
         <RiLinkedinFill className='size-7 text-gray-900 dark:text-gray-300' />
      ),
   },
   {
      social: 'twitter',
      url: 'https://t.me/i_m_nakul',
      icon: (
         <RiTelegram2Fill className='size-7 text-gray-900 dark:text-gray-300' />
      ),
   },
]

function ContactDetails() {
   return (
      <div className='glass-effect bg-black/30 rounded-xl p-2 card-glow h-full'>
         <p className=' text-gray-900 dark:text-gray-300 mb-6 inter'>
            I'm always open to new opportunities and collaborations. Feel free
            to reach out if you have a project in mind or just want to connect!
         </p>
         <div className='space-y-4'>
            <div className='flex items-center justify-between'>
               <div className='flex items-center'>
                  <div
                     className={`w-10 h-10 rounded-full  flex items-center justify-center mr-2 md:mr-4`}
                  >
                     <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-5 w-5 text-white/80'
                        viewBox='0 0 20 20'
                        fill='currentColor'
                     >
                        <path
                           fillRule='evenodd'
                           d='M10 2a4 4 0 100 8 4 4 0 000-8zM2 16a6 6 0 0112 0H2z'
                           clipRule='evenodd'
                        />
                     </svg>
                  </div>
                  <span className='text-gray-900 dark:text-gray-300 inter'>
                     Nakul Srivastava
                  </span>
               </div>
               <a
                  href='https://nakul-srivastava-dev.vercel.app/'
                  target='_blank'
                  className={`text-gray-900 dark:text-gray-300 rounded-md w-24 flex items-center justify-center cursor-pointer   transition-colors duration-300   hover:opacity-80 hover:scale-105 active:scale-95 py-1 px-2 space-grotesk text-sm border border-solid border-gray-900 dark:border-gray-300 mr-4`}
               >
                  Portfolio
                  {/* <ArrowUpRight className='ml-1 size-5' /> */}
               </a>
            </div>
            <div className='flex items-center '>
               <div
                  className={`w-10 h-10 rounded-full   flex items-center justify-center mr-2 md:mr-4`}
               >
                  <svg
                     xmlns='http://www.w3.org/2000/svg'
                     className='h-5 w-5 text-white/80'
                     viewBox='0 0 20 20'
                     fill='currentColor'
                  >
                     <path d='M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z' />
                     <path d='M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z' />
                  </svg>
               </div>
               <span className='text-gray-900 dark:text-gray-300 inter'>
                  imnakul44@gmail.com
               </span>
               <a
                  href='mailto:imnakul44@gmail.com'
                  className={`rounded-md flex items-center justify-center cursor-pointer transition-colors duration-300 hover:opacity-80 hover:scale-105 active:scale-95 p-1 ml-3 text-gray-900 dark:text-gray-300`}
               >
                  {/* <ArrowUpRight className=' size-4' /> */}
               </a>
            </div>

            <div className='flex items-center'>
               <div
                  className={`w-10 h-10 rounded-full  flex items-center justify-center mr-2 md:mr-4`}
               >
                  <svg
                     xmlns='http://www.w3.org/2000/svg'
                     className='h-5 w-5 text-white/80'
                     viewBox='0 0 20 20'
                     fill='currentColor'
                  >
                     <path
                        fillRule='evenodd'
                        d='M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z'
                        clipRule='evenodd'
                     />
                  </svg>
               </div>
               <span className='text-gray-900 dark:text-gray-300 inter'>
                  Meerut, INDIA
               </span>
            </div>
         </div>
         <div className='flex justify-center space-x-6 mt-8'>
            {socials.map((social, index) => (
               <a
                  key={index}
                  href={social.url}
                  target='_blank'
                  className={`size-14 rounded-full flex items-center justify-center cursor-pointer   transition-colors duration-300  hover:opacity-80 hover:scale-105 active:scale-95 `}
               >
                  {social.icon}
               </a>
            ))}
         </div>
      </div>
   )
}
export default ContactDetails
