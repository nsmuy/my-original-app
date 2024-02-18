import Link from 'next/link'
import React from 'react'

const top = () => {
  return (
    <div className='relative w-screen h-screen'>
      <div className='absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] right-0 bottom-0'>
        <h2 className='text-3xl text-center font-bold text-amber-500'>MY FOUNDATION FINDER へ ようこそ！</h2>
        <div className='flex gap-5 mt-8'>
          <Link href={"/comparison/"} className='bg-white rounded-xl border-2 border-amber-500 shadow-sm p-8 flex-1 text-amber-500 text-center transition-all hover:bg-amber-500 hover:text-white'>
            <p className='font-bold text-xl'>ファンデーションを比較する</p>
          </Link>

          <Link href={"/reviews/"} className='bg-white rounded-xl border-2 border-amber-500 shadow-sm p-8 flex-1 text-amber-500  text-center transition-all hover:bg-amber-500 hover:text-white'>
            <p className='font-bold text-xl'>口コミを見る</p>
          </Link>
        </div>
      </div>
      </div>
  )
}

export default top