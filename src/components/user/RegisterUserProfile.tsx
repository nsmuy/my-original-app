"use client"

import React, { useState } from 'react'
import { UserProfile } from '@/types/UserProfile';
import { db } from '@/app/firebase';
import { setDoc, doc } from 'firebase/firestore';
import { useAuthContext } from '@/auth/AuthContext';

type RegisterUserProfileProps = {
  setIsFirstVisit: React.Dispatch<React.SetStateAction<boolean>>;
}

const RegisterUserProfile = ({ setIsFirstVisit }: RegisterUserProfileProps) => {

  const { user } = useAuthContext();
  const [inputUserProfile, setInputUserProfile] = useState<Omit<UserProfile, 'id'>>({
    nickname: '',
    age: '',
    gender: '',
    skinType: '',
  });

  // firebaseにユーザープロフィールを保存
  const handleUserProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (user) {
      // idをセットしてuserProfileを更新
      const registrationUserProfile = { ...inputUserProfile, id: user.uid };
      await setDoc(doc(db, "userProfiles", user.uid), registrationUserProfile);
      setInputUserProfile({ nickname: '', age: '', gender: '', skinType: '' });
      setIsFirstVisit(false);
    }
  };

  return (
    <div className='relative bg-zinc-100 rounded-lg shadow dark:bg-gray-700 p-6'>
      <h3 className='font-bold text-center border-b-2 pb-4'>まずは、基本情報を入力してください！</h3>

      <form onSubmit={handleUserProfile} className='mt-4'>

        <div className='flex flex-col gap-4'>
          <div className='flex flex-col'>
            <label htmlFor="nickname" className='mb-2 font-bold'>ニックネーム</label>
            <input
              type="text"
              id='nickname'
              value={inputUserProfile.nickname}
              onChange={(e) => setInputUserProfile({ ...inputUserProfile, nickname: e.target.value })}
              className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
            />
          </div>

          <div>
            <p className='mb-2 font-bold'>性別</p>

            <div className='inline-block mr-4'>
              <input
                type="radio"
                id="gender1"
                name="gender"
                value="male"
                checked={inputUserProfile?.gender === "male"}
                onChange={() => setInputUserProfile({ ...inputUserProfile, gender: "male" })}
              />
              <label htmlFor="gender1" className='ml-2'>男性</label>
            </div>

            <div className='inline-block mr-4'>
              <input
                type="radio"
                id="gender2"
                name="gender"
                value="female"
                checked={inputUserProfile?.gender === "female"}
                onChange={() => setInputUserProfile({ ...inputUserProfile, gender: "female" })}
              />
              <label htmlFor="gender2" className='ml-2'>女性</label>
            </div>

            <div className='inline-block mr-4'>
              <input
                type="radio"
                id="gender3"
                name="gender"
                value="other"
                checked={inputUserProfile?.gender === "other"}
                onChange={() => setInputUserProfile({ ...inputUserProfile, gender: "other" })}
              />
              <label htmlFor="gender3" className='ml-2'>その他</label>
            </div>
          </div>

          <div>
            <p className='mb-2 font-bold'>年齢層</p>

            <div className='inline-block mr-4'>
              <input
                type="radio"
                id="age1"
                name="age_group"
                value="0-19"
                checked={inputUserProfile?.age === "0-19"}
                onChange={() => setInputUserProfile({ ...inputUserProfile, age: "0-19" })}
              />
              <label htmlFor="age1" className='ml-2'>～10代</label>
            </div>

            <div className='inline-block mr-4'>
              <input
                type="radio"
                id="age2"
                name="age_group"
                value="20-29"
                checked={inputUserProfile?.age === "20-29"}
                onChange={() => setInputUserProfile({ ...inputUserProfile, age: "20-29" })}
              />
              <label htmlFor="age2" className='ml-2'>20代</label>
            </div>

            <div className='inline-block mr-4'>
              <input
                type="radio"
                id="age3"
                name="age_group"
                value="30-39"
                checked={inputUserProfile?.age === "30-39"}
                onChange={() => setInputUserProfile({ ...inputUserProfile, age: "30-39" })}
              />
              <label htmlFor="age3" className='ml-2'>30代</label>
            </div>

            <div className='inline-block mr-4'>
              <input
                type="radio"
                id="age4"
                name="age_group"
                value="40-49"
                checked={inputUserProfile?.age === "40-49"}
                onChange={() => setInputUserProfile({ ...inputUserProfile, age: "40-49" })}
              />
              <label htmlFor="age4" className='ml-2'>40代</label>
            </div>

            <div className='inline-block mr-4'>
              <input
                type="radio"
                id="age5"
                name="age_group"
                value="50-59"
                checked={inputUserProfile?.age === "50-59"}
                onChange={() => setInputUserProfile({ ...inputUserProfile, age: "50-59" })}
              />
              <label htmlFor="age5" className='ml-2'>50代</label>
            </div>

            <div className='inline-block'>
              <input
                type="radio"
                id="age6"
                name="age_group"
                value="60+"
                checked={inputUserProfile?.age === "60+"}
                onChange={() => setInputUserProfile({ ...inputUserProfile, age: "60+" })}
              />
              <label htmlFor="age6" className='ml-2'>60代</label>
            </div>
          </div>

          <div>
            <p className='mb-2 font-bold'>肌タイプ</p>

            <div className='inline-block mr-4'>
              <input
                type="radio"
                id="skinType1"
                name="skin_type"
                value="normal"
                checked={inputUserProfile.skinType === "normal"}
                onChange={() => setInputUserProfile({ ...inputUserProfile, skinType: "normal" })}
              />
              <label htmlFor="skinType1" className='ml-2'>普通肌</label>
            </div>

            <div className='inline-block mr-4'>
              <input
                type="radio"
                id="skinType2"
                name="skin_type"
                value="dry"
                checked={inputUserProfile.skinType === "dry"}
                onChange={() => setInputUserProfile({ ...inputUserProfile, skinType: "dry" })}
              />
              <label htmlFor="skinType2" className='ml-2'>乾燥肌</label>
            </div>

            <div className='inline-block mr-4'>
              <input
                type="radio"
                id="skinType3"
                name="skin_type"
                value="combination"
                checked={inputUserProfile.skinType === "combination"}
                onChange={() => setInputUserProfile({ ...inputUserProfile, skinType: "combination" })}
                />
              <label htmlFor="skinType3" className='ml-2'>混合肌</label>
            </div>

            <div className='inline-block mr-4'>
              <input
                type="radio"
                id="skinType4"
                name="skin_type"
                value="oily"
                checked={inputUserProfile.skinType === "oily"}
                onChange={() => setInputUserProfile({ ...inputUserProfile, skinType: "oily" })}
              />
              <label htmlFor="skinType4" className='ml-2'>脂性肌</label>
            </div>

            <div className='inline-block mr-4'>
              <input
                type="radio"
                id="skinType5"
                name="skin_type"
                value="sensitive"
                checked={inputUserProfile.skinType === "sensitive"}
                onChange={() => setInputUserProfile({ ...inputUserProfile, skinType: "sensitive" })}
              />
              <label htmlFor="skinType5" className='ml-2'>敏感肌</label>
            </div>

            <div className='inline-block mr-4'>
              <input
                type="radio"
                id="skinType6"
                name="skin_type"
                value="atopic"
                checked={inputUserProfile.skinType === "atopic"}
                onChange={() => setInputUserProfile({ ...inputUserProfile, skinType: "atopic" })}
              />
              <label htmlFor="skinType6" className='ml-2'>アトピー</label>
            </div>
          </div>

          <button
            type="submit"
            className='text-white font-bold tracking-widest inline-flex self-start bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-sm px-8 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-2'
          >
            登録
          </button>
        </div>

      </form>
    </div>
  )
}

export default RegisterUserProfile