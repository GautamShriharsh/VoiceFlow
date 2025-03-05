import React from 'react'
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle
} from "@/components/ui/alert-dialog"
import Image from 'next/image'

function CustomLoading({ loading }) {
  return (
    <AlertDialog open={loading}>      
      <AlertDialogContent className='bg-white'>
        {/* Hidden for users but available for screen readers */}
        <AlertDialogTitle className="sr-only">Processing...</AlertDialogTitle>
        <AlertDialogDescription className="sr-only">
          Please wait while we process your video.
        </AlertDialogDescription>

        <div className='bg-white flex flex-col items-center my-10 justify-center'>
          <Image src={'/progress.gif'} width={100} height={100} alt={'Loading...'}/>
          <h2>Generating your video... Do not refresh</h2>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default CustomLoading
