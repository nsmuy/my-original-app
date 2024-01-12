'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getAuth } from "firebase/auth";
import LogoutButton from '@/auth/LogoutButton';

const Header = () => {

  const router = useRouter();
  const pathname = usePathname();

  const renderNavigationLinks = () => {
    if(pathname === '/signup') {
      return (
        <ul>
          <li>
            <button onClick={() => router.push('/signup')}>ログイン</button>
          </li>
        </ul>
      )
    } else if (pathname.startsWith('/cmopoarison')) {
      return (
        <ul>
          <li>
            <button onClick={() => router.push('/reviews')}>レビュー一覧</button>
          </li>
          <li>
            <LogoutButton />
          </li>
        </ul>
      )
    } else if (pathname.startsWith('/reviews')) {
      return (
        <ul>
          <li>
            <button onClick={() => router.push('/comparison')}>比較してみる</button>
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
        <header className="bg-white px-[20px] py-2 shadow-sm flex justify-between">
          <h2 className="text-xl text-orange-400">MY FOUNDATION FINDER</h2>

          <nav>{renderNavigationLinks()}</nav>
        </header>
      )}
    </div>
  )
}

export default Header