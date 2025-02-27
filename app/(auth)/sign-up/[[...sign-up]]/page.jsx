import { SignUp } from '@clerk/nextjs';
import Image from 'next/image';

export default function SignUpPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      <div>
        <Image
          src="/login.jpg" // Use /path from public directory
          alt="Login interface"
          width={500}
          height={500}
        />
      </div>
      <div>
        <SignUp />
      </div>
    </div>
  );
}