'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

const Header = () => {

  const pathname: string = usePathname();
  console.log(pathname);

  return (
    <div>
      {pathname !== '/' && (
        <header className="bg-white px-[20px] py-2 shadow-sm flex justify-between">
          <h2 className="text-xl text-orange-400">MY FOUNDATION FINDER</h2>

          <nav>
            <ul>
              {pathname !== '/login' && (
                <li>
                  <a href="/login">ログイン</a>
                </li>
              )}
            </ul>
          </nav>
        </header>
      )}
    </div>
  )
}

export default Header