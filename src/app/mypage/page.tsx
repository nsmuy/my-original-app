"use client";

import React from 'react'
import { app } from '../firebase';
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

const MyPage = () => {

  const router = useRouter();
  const auth = getAuth(app);

  const handleLogout = async () => {
    await signOut(auth);
    await router.push("/");
  }
  
  return (
    <div className='flex flex-col items-center justify-center'>
      <h2 className='text-2xl'>マイページ</h2>

      <button
        className='bg-gray-700 px-4 py-2 text-white rounded-md'
        onClick={handleLogout}
      >
        ログアウト
      </button>
    </div>
  )
}

export default MyPage