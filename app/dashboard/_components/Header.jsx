import Image from 'next/image'
import React from 'react'
import { UserButton } from '@clerk/nextjs' 

function Header() {
  return (
    <div className='p-3 px-5 shadow-md'> 
      <div className='flex gap-2 items-center justify-between'>
        <div className='flex gap-2 items-center'>
          <Image src={'/logo.svg'} width={30} height={30} alt="VoiceFlow Logo" /> {/* Added alt for accessibility */}
          <h2 className='font-bold text-xl'>VoiceFlow</h2>
        </div>
        <div className='flex gap-4 items-center'> {/* Container for buttons */}
          <button className='bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 shadow-sm'> {/* Added shadow-sm to button */}
            Dashboard
          </button>
          <UserButton />
        </div>
      </div>
    </div>
  )
}

export default Header