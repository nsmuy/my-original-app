import React from 'react'
import { useRouter } from 'next/navigation';
import { UserProfileType } from '@/types/UserProfile';
import { getProfileOptionsLabel } from '@/functions/getProfileOptionsLabel';
import Image from "next/image";
import defaultIcon from "../../assets/userIcon_default.png";

type CurrentUserProfileProps = {
  currentUserProfile: UserProfileType | undefined;
}

const CurrentUserProfileView = ( {currentUserProfile} : CurrentUserProfileProps ) => {

  const router = useRouter();

  return (
    <div className='w-full'>
      <div className='border-b border-amber-400 flex justify-between pb-1'>
        <h2 className='text-2xl font-bold text-amber-500'>Profile</h2>
        <button 
          onClick={() => router.push('/mypage/editprofile')} className='text-amber-500 border border-amber-500 rounded-md px-4 py-1 hover:bg-amber-500 hover:text-white'>プロフィールを編集する</button>
      </div>
      <div className='flex justify-start items-start gap-4 mt-4'>
        <div className='w-24 aspect-square shadow-md rounded-full overflow-hidden'>
          <Image
            src={currentUserProfile?.icon || defaultIcon}
            alt={`${currentUserProfile ? currentUserProfile.nickname : '未設定'}のアイコン`}
            width={100}
            height={100}
            style={{ objectFit: 'cover' }}
          ></Image>
        </div>
        <dl>
          <div className='flex'>
            <dt className='mr-2'>ニックネーム：</dt>
            <dd>{currentUserProfile?.nickname || '未設定'}</dd>
          </div>
          <div className='flex'>
            <dt className='mr-2'>年齢：</dt>
            <dd>{getProfileOptionsLabel('age', currentUserProfile?.age)}</dd>
          </div>
          <div className='flex'>
            <dt className='mr-2'>性別:</dt>
            <dd>{getProfileOptionsLabel('gender', currentUserProfile?.gender)}</dd>
          </div>
          <div className='flex'>
            <dt className='mr-2'>肌タイプ：</dt>
            <dd>{getProfileOptionsLabel('skinType', currentUserProfile?.skinType)}</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}

export default CurrentUserProfileView