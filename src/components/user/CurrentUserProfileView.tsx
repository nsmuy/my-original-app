import React from 'react'
import { useRouter } from 'next/navigation';
import { UserProfile } from '@/types/UserProfile';

type CurrentUserProfileProps = {
  currentUserProfile: UserProfile
}

const CurrentUserProfileView = ( {currentUserProfile} : CurrentUserProfileProps ) => {

  const router = useRouter();

  return (
    <div>
        <h3>基本情報</h3>
        <ul>
          <li>ニックネーム: {currentUserProfile.nickname}</li>
          <li>アイコン:
            <img src={currentUserProfile.icon} alt={`${currentUserProfile.nickname}のアイコン`} />
          </li>
          <li>年齢: {currentUserProfile.age}</li>
          <li>性別: {currentUserProfile.gender}</li>
          <li>肌質: {currentUserProfile.skinType}</li>
        </ul>

        <button onClick={() => router.push('/mypage/editprofile')} className='bg-gray-700 px-4 py-2 text-white rounded-md'>基本情報を変更する</button>
    </div>
  )
}

export default CurrentUserProfileView