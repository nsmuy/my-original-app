import React from 'react'
import { useRouter } from 'next/navigation';
import { UserProfile } from '@/types/UserProfile';

type CurrentUserProfileProps = {
  currentUserProfile: UserProfile
}

const CurrentUserProfileView = ( {currentUserProfile} : CurrentUserProfileProps ) => {

  const router = useRouter();

  return (
    <div className='w-full'>
      <div className='border-b border-amber-400 flex justify-between pb-1'>
        <h2 className='text-2xl font-bold text-amber-500'>Profile</h2>
        <button 
          onClick={() => router.push('/mypage/editprofile')} className='text-amber-500 border border-amber-500 rounded-md px-4 py-1 hover:bg-amber-500 hover:text-white'>編集する</button>
      </div>
      <div className='flex justify-start items-start gap-4 mt-4'>
        <div className='w-24 aspect-square shadow-md rounded-full overflow-hidden'>
          <img src={currentUserProfile.icon} alt={`${currentUserProfile.nickname}のアイコン`} />
        </div>
        <dl>
          <div className='flex'>
            <dt className='mr-2'>ニックネーム：</dt>
            <dd>{currentUserProfile.nickname}</dd>
          </div>
          <div className='flex'>
            <dt className='mr-2'>年齢：</dt>
            <dd>{currentUserProfile.age}</dd>
          </div>
          <div className='flex'>
            <dt className='mr-2'>性別:</dt>
            <dd>{currentUserProfile.gender}</dd>
          </div>
          <div className='flex'>
            <dt className='mr-2'>肌タイプ：</dt>
            <dd>{currentUserProfile.skinType}</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}

export default CurrentUserProfileView