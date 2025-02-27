"use client"
import { db } from '@/configs/db';
import { Users } from '@/configs/schema';
import { useUser } from '@clerk/nextjs'
import { eq } from 'drizzle-orm';
import React, { useEffect } from 'react'

function Provider({children}) {
   
  const {user} = useUser();

  useEffect(() => {
    (async () => {
      if (user) await isNewUser();
    })();
  },[user]);
  
  const isNewUser = async () => {
    try {
      const result = await db.select().from(Users).where(eq(Users.email, user?.primaryEmailAddress?.emailAddress));
      console.log(result);
      if (!result[0]) {
        await db.insert(Users).values({
          name: user.fullName,
          email: user?.primaryEmailAddress?.emailAddress,
          imageUrl: user?.imageUrl
        });
      }
    } catch (error) {
      console.error("Error checking/creating user:", error);
    }

  }
  return (
    <div>
      {children}
    </div>
  )
}

export default Provider
