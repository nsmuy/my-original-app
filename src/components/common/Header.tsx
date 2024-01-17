'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import LogoutButton from '@/auth/LogoutButton';

const Header = () => {

  const router = useRouter();
  const pathname = usePathname();

  const renderNavigationLinks = () => {
    if(pathname === '/signup') {
      return (
        <ul>
          <li>
            <button
              className='headerBtn'
              onClick={() => router.push('/login')}
            >
              LOGIN
            </button>
          </li>
        </ul>
      )
    } else if (pathname === '/login') {
      return (
        <ul>
          <li>
            <button
              className='headerBtn'
              onClick={() => router.push('/signup')}
            >
              SIGNUP
            </button>
            </li>
        </ul>
      )
    } else if (pathname === '/mypage') {
      return (
        <ul>
          <li>
            <LogoutButton />
          </li>
        </ul>
      )
    } else {
      return (
        <ul className='flex items-center gap-4'>
          <li>
            <button
              className='headerBtn'
              onClick={() => router.push('/mypage')}
            >
              MYPAGE
            </button>
          </li>
          <li>
            <LogoutButton />
          </li>
        </ul>
      )
    }
  }

  return (
    <div>
      {pathname !== '/' && (
        <header className="px-[20px] py-2 flex justify-between">
          <h2 className="text-xl text-amber-500">MY FOUNDATION FINDER</h2>

          <nav>{renderNavigationLinks()}</nav>
        </header>
      )}
    </div>
  )
}

export default Header