import React from 'react'
import { app } from '@/app/firebase';
import { useRouter } from 'next/navigation';
import { getAuth, signOut } from 'firebase/auth';

const LogoutButton = () => {

  const auth = getAuth(app);
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    await router.push("/");
  }

  return (
    <div>
      <button onClick={handleLogout} className='headerBtn--logout'>
        LOGOUT
      </button>
    </div>
  )
}

export default LogoutButton