"use client";

import React, { useState, useEffect } from 'react';
import { UserProfile } from '@/types/UserProfile';
import useLoginGuard from '@/auth/useLoginGuard';
import { app, db } from '../../firebase';
import { getAuth } from "firebase/auth";
import { doc, collection, onSnapshot, query, where, updateDoc } from 'firebase/firestore';
import { useRouter } from "next/navigation";
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { ageOptions, skinTypeOptions } from '@/constants/userData';
import UserProfileOptionButton from '@/components/mypage/UserProfileOptionButton';

const EditProfile = () => {
  useLoginGuard();
  const router = useRouter();
  const auth = getAuth(app);

  const [userProfile, setUserProfile] = useState<UserProfile>();
  const [editedProfile, setEditedProfile] = useState<UserProfile>({
    id: '',
    nickname: '',
    age: '',
    gender: '',
    skinType: '',
    icon: '',
  });
  const [uploadIcon, setUploadIcon] = useState<File>();

  // Firebaseからログインしているユーザープロフィールを取得
  useEffect(() => {
    if (!auth.currentUser) {
      router.push('/login');
      return;
    }

    const userProfilesRef = collection(db, 'userProfiles');
    const q = query(userProfilesRef, where('id', '==', auth.currentUser.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userProfileData = snapshot.docs[0]?.data() as UserProfile;
      setUserProfile(userProfileData);
    });

    return () => unsubscribe();
  }, [auth.currentUser, router]);

  // userProfileが取得できたら、editedProfileを更新
  useEffect(() => {
    if (userProfile) {
      setEditedProfile(userProfile);
    }
  }, [userProfile]);

  // ユーザープロフィールを更新
  const handleEditProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (userProfile) {

      // アイコンが変更されている場合、一度Firebase Strageにアップロードし公開URLを取得
      let newIconUrl: string = '';
      if(uploadIcon !== undefined && uploadIcon !== null) {
        // 公開URLを取得するために、一度Firebase Strageにアップロードする
        const storage = getStorage();
        const iconRef = ref(storage, `userIcons/userIcon_${userProfile.id}`);
        await uploadBytes(iconRef, uploadIcon);
        newIconUrl = await getDownloadURL(iconRef);
      } else {
        newIconUrl = userProfile.icon;
      }

      const userProfileRef = doc(db, "userProfiles", userProfile.id);
      try {
        await updateDoc(userProfileRef, {
          ...editedProfile,
          icon: newIconUrl,
        });
        console.log("プロフィールが更新されました");
      } catch (error) {
        console.error("プロフィールの更新に失敗しました", error);
      }
      router.push("/mypage");
    }
  };

  return (
    <div className='mt-8'>
      <div className='inner'>
        <h2 className='font-bold border-b border-amber-200'>プロフィール編集</h2>
        <form onSubmit={handleEditProfile}>

          <div>
            <label htmlFor="nickname">ニックネーム</label>
            <input
              id="nickname"
              type="text"
              placeholder="ニックネーム"
              className='bg-amber-50 rounded-md focus:outline-amber-500 px-2 py-1 w-80'
              value={editedProfile?.nickname || ''}
              onChange={(e) => setEditedProfile({ ...editedProfile, nickname: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="icon">
              <input
                type="file"
                id="icon"
                accept='image/*' // 画像ファイルのみ
                onChange={(e) => setUploadIcon(e.target.files?.[0])}
              />
            </label>
          </div>

          <div>
              <p className='mb-2 font-bold'>年齢層</p>
              {ageOptions.map((option) => (
                <div className='inline-block mr-4'>
                  <UserProfileOptionButton
                    option={option}
                    name="age"
                    inputUserProfile={editedProfile}
                    setInputUserProfile={setEditedProfile}
                  />
                </div>
              ))}
          </div>

          <div>
            <p className='mb-2 font-bold'>肌タイプ</p>
            {skinTypeOptions.map((option) => (
              <div className='inline-block mr-4'>
                <UserProfileOptionButton
                  option={option}
                  name="skinType"
                  inputUserProfile={editedProfile}
                  setInputUserProfile={setEditedProfile}
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="bg-amber-500 text-white rounded-md font-bold">
            更新
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
