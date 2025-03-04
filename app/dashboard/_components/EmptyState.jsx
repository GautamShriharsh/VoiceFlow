import React from 'react'
import { Plus } from 'lucide-react' // Import Plus icon from lucide-react
import Link from 'next/link' // Import Link from next/link

function EmptyState() {
  return (
    <div className='flex flex-col items-center justify-center h-64 text-gray-500 border-2 border-dotted border-gray-300 p-6'>
      <Link
        href="/dashboard/create-new"
        className='bg-purple-400 text-white w-16 h-16 rounded-full flex items-center justify-center mb-4 hover:bg-purple-600 transition-colors'
        aria-label="Create new video" // Accessibility label
      >
        <Plus className='w-8 h-8' /> {/* Purple + icon */}
      </Link>
      <h3 className='text-lg font-semibold'>No Videos Yet</h3>
      <p className='text-sm'>Create your first video to get started!</p>
    </div>
  );
}

export default EmptyState