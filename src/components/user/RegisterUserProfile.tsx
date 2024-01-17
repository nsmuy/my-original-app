"use client"

import React, { useState } from 'react'
import { UserProfile } from '@/types/UserProfile';
import { db } from '@/app/firebase';
import { setDoc, doc } from 'firebase/firestore';
import { useAuthContext } from '@/auth/AuthContext';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import defaultIcon from '@/assets/userIcon_default.png';
import Image from 'next/image';

type RegisterUserProfileProps = {
  setIsFirstVisit: React.Dispatch<React.SetStateAction<boolean>>;
}

const RegisterUserProfile = ({ setIsFirstVisit }: RegisterUserProfileProps) => {

  const { user } = useAuthContext();
  const [uploadIcon, setUploadIcon] = useState<File>();
  const [inputUserProfile, setInputUserProfile] = useState<Omit<UserProfile, 'id'>>({
    nickname: '',
    age: '',
    gender: '',
    skinType: '',
    icon: '',
  });

  // firebaseにユーザープロフィールを保存
  const handleUserProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (user) {

      let iconUrl: string = '';

      if(uploadIcon !== undefined && uploadIcon !== null) {
        // 公開URLを取得するために、一度Firebase Strageにアップロードする
        const storage = getStorage();
        const iconRef = ref(storage, `userIcons/userIcon_${user?.uid}`);
        await uploadBytes(iconRef, uploadIcon);
        iconUrl = await getDownloadURL(iconRef);
        setInputUserProfile({ ...inputUserProfile, icon: iconUrl });
      } else {
        const storage = getStorage();
        const defaultIconRef = ref(storage, `userIcons/userIcon_default.png`);
        console.log(defaultIconRef);
        iconUrl = await getDownloadURL(defaultIconRef);
        setInputUserProfile({ ...inputUserProfile, icon: iconUrl });
      }

      // idをセットしてuserProfileを更新
      const registrationUserProfile = { ...inputUserProfile, id: user.uid, icon: iconUrl };
      await setDoc(doc(db, "userProfiles", user.uid), registrationUserProfile);
      setInputUserProfile({ nickname: '', age: '', gender: '', skinType: '', icon: '' }); 
      setIsFirstVisit(false);
    }
  };

  // 画像を状態関数にセットし、プレビューを表示する関数
  const updateAndPreviewFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadIcon(e.target.files![0]);

    for (let i = 0; i < e.target.files!.length; i++) {
      let fileReader = new FileReader();
      fileReader.onload = (e => {
        const previewElement = document.getElementById('preview');
        if(previewElement) {
          previewElement.innerHTML = '<img src="' + e.target!.result + '">';
        }
      });
      fileReader.readAsDataURL(e.target.files![i]);
    }
  }

  return (
    <div className='relative bg-white rounded-lg shadow dark:bg-gray-700 p-6'>
      <h3 className='text-amber-500 font-bold text-center border-b border-amber-200 pb-4'>こんにちは！<br />まずはプロフィールを入力してください</h3>

      <form onSubmit={handleUserProfile} className='mt-4'>

        <div className='flex flex-col gap-6'>
          <div className='flex flex-col'>
            <label
              htmlFor="nickname"
              className='mb-2 text-amber-500'
            >
              ニックネーム
            </label>
            <input
              type="text"
              id='nickname'
              value={inputUserProfile.nickname}
              onChange={(e) => setInputUserProfile({ ...inputUserProfile, nickname: e.target.value })}
              className='bg-amber-50 rounded-md focus:outline-amber-500 px-2 py-1 w-80'
            />
          </div>

          <div>
            <label
              htmlFor="icon"
              className='text-amber-500'
            >
              アイコン
            </label>
            <input
              type="file"
              id='icon'
              accept='image/*' //画像ファイルだけ受け付ける
              onChange={(e) => updateAndPreviewFile(e)}
            />
            <div
              id='preview'
              className='w-40 h-40 border border-amber-500 rounded-full overflow-hidden'
            >
              <Image src={defaultIcon} alt='初期画像'></Image>
            </div>
          </div>

          <div>
            <p className='mb-2 text-amber-500'>性別</p>

            <div className='inline-block mr-4'>
              <input
                type="radio"
                id="gender1"
                name="gender"
                value="男性"
                checked={inputUserProfile?.gender === "男性"}
                onChange={() => setInputUserProfile({ ...inputUserProfile, gender: "男性" })}
              />
              <label htmlFor="gender1" className='ml-2'>男性</label>
            </div>

            <div className='inline-block mr-4'>
              <input
                type="radio"
                id="gender2"
                name="gender"
                value="女性"
                checked={inputUserProfile?.gender === "女性"}
                onChange={() => setInputUserProfile({ ...inputUserProfile, gender: "女性" })}
              />
              <label htmlFor="gender2" className='ml-2'>女性</label>
            </div>

            <div className='inline-block mr-4'>
              <input
                type="radio"
                id="gender3"
                name="gender"
                value="その他"
                checked={inputUserProfile?.gender === "その他"}
                onChange={() => setInputUserProfile({ ...inputUserProfile, gender: "その他" })}
              />
              <label htmlFor="gender3" className='ml-2'>その他</label>
            </div>
          </div>

          <div>
            <p className='mb-2 text-amber-500'>年齢層</p>

            <div className='inline-block mr-4'>
              <input
                type="radio"
                id="age1"
                name="age_group"
                value="～10代"
                checked={inputUserProfile?.age === "～10代"}
                onChange={() => setInputUserProfile({ ...inputUserProfile, age: "～10代" })}
              />
              <label htmlFor="age1" className='ml-2'>～10代</label>
            </div>

            <div className='inline-block mr-4'>
              <input
                type="radio"
                id="age2"
                name="age_group"
                value="20代"
                checked={inputUserProfile?.age === "20代"}
                onChange={() => setInputUserProfile({ ...inputUserProfile, age: "20代" })}
              />
              <label htmlFor="age2" className='ml-2'>20代</label>
            </div>

            <div className='inline-block mr-4'>
              <input
                type="radio"
                id="age3"
                name="age_group"
                value="30代"
                checked={inputUserProfile?.age === "30代"}
                onChange={() => setInputUserProfile({ ...inputUserProfile, age: "30代" })}
              />
              <label htmlFor="age3" className='ml-2'>30代</label>
            </div>

            <div className='inline-block mr-4'>
              <input
                type="radio"
                id="age4"
                name="age_group"
                value="40代"
                checked={inputUserProfile?.age === "40代"}
                onChange={() => setInputUserProfile({ ...inputUserProfile, age: "40代" })}
              />
              <label htmlFor="age4" className='ml-2'>40代</label>
            </div>

            <div className='inline-block mr-4'>
              <input
                type="radio"
                id="age5"
                name="age_group"
                value="50代"
                checked={inputUserProfile?.age === "50代"}
                onChange={() => setInputUserProfile({ ...inputUserProfile, age: "50代" })}
              />
              <label htmlFor="age5" className='ml-2'>50代</label>
            </div>

            <div className='inline-block'>
              <input
                type="radio"
                id="age6"
                name="age_group"
                value="60代～"
                checked={inputUserProfile?.age === "60代～"}
                onChange={() => setInputUserProfile({ ...inputUserProfile, age: "60代～" })}
              />
              <label htmlFor="age6" className='ml-2'>60代</label>
            </div>
          </div>

          <div>
            <p className='mb-2 text-amber-500'>肌タイプ</p>

            <div className='inline-block mr-4'>
              <input
                type="radio"
                id="skinType1"
                name="skin_type"
                value="普通肌"
                checked={inputUserProfile.skinType === "普通肌"}
                onChange={() => setInputUserProfile({ ...inputUserProfile, skinType: "普通肌" })}
              />
              <label htmlFor="skinType1" className='ml-2'>普通肌</label>
            </div>

            <div className='inline-block mr-4'>
              <input
                type="radio"
                id="skinType2"
                name="skin_type"
                value="乾燥肌"
                checked={inputUserProfile.skinType === "乾燥肌"}
                onChange={() => setInputUserProfile({ ...inputUserProfile, skinType: "乾燥肌" })}
              />
              <label htmlFor="skinType2" className='ml-2'>乾燥肌</label>
            </div>

            <div className='inline-block mr-4'>
              <input
                type="radio"
                id="skinType3"
                name="skin_type"
                value="混合肌"
                checked={inputUserProfile.skinType === "混合肌"}
                onChange={() => setInputUserProfile({ ...inputUserProfile, skinType: "混合肌" })}
                />
              <label htmlFor="skinType3" className='ml-2'>混合肌</label>
            </div>

            <div className='inline-block mr-4'>
              <input
                type="radio"
                id="skinType4"
                name="skin_type"
                value="脂性肌"
                checked={inputUserProfile.skinType === "脂性肌"}
                onChange={() => setInputUserProfile({ ...inputUserProfile, skinType: "脂性肌" })}
              />
              <label htmlFor="skinType4" className='ml-2'>脂性肌</label>
            </div>

            <div className='inline-block mr-4'>
              <input
                type="radio"
                id="skinType5"
                name="skin_type"
                value="敏感肌"
                checked={inputUserProfile.skinType === "敏感肌"}
                onChange={() => setInputUserProfile({ ...inputUserProfile, skinType: "敏感肌" })}
              />
              <label htmlFor="skinType5" className='ml-2'>敏感肌</label>
            </div>

            <div className='inline-block mr-4'>
              <input
                type="radio"
                id="skinType6"
                name="skin_type"
                value="アトピー肌"
                checked={inputUserProfile.skinType === "アトピー肌"}
                onChange={() => setInputUserProfile({ ...inputUserProfile, skinType: "アトピー肌" })}
              />
              <label htmlFor="skinType6" className='ml-2'>アトピー</label>
            </div>
          </div>

          <button
            type="submit"
            className='btn_bg-gradation text-white rounded-full w-[160px] h-[44px] text-xl font-bold letter-spacing-1 flex items-center justify-center self-center mt-6'
          >
            登録
          </button>
        </div>

      </form>
    </div>
  )
}

export default RegisterUserProfile