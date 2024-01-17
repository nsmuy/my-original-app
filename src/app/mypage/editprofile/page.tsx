"use client";

import React, { useState, useEffect } from 'react';
import { UserProfile } from '@/types/UserProfile';
import useLoginGuard from '@/auth/useLoginGuard';
import { app, db } from '../../firebase';
import { getAuth } from "firebase/auth";
import { doc, collection, onSnapshot, query, where, updateDoc } from 'firebase/firestore';
import { useRouter } from "next/navigation";
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

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

              <div className='inline-block mr-4'>
                <input
                  type="radio"
                  id="age1"
                  name="age_group"
                  value="～10代"
                  checked={editedProfile?.age === "～10代"}
                  onChange={() => setUserProfile({ ...editedProfile, age: "～10代" })}
                />
                <label htmlFor="age1" className='ml-2'>～10代</label>
              </div>

              <div className='inline-block mr-4'>
                <input
                  type="radio"
                  id="age2"
                  name="age_group"
                  value="20代"
                  checked={editedProfile?.age === "20代"}
                  onChange={() => setUserProfile({ ...editedProfile, age: "20代" })}
                />
                <label htmlFor="age2" className='ml-2'>20代</label>
              </div>

              <div className='inline-block mr-4'>
                <input
                  type="radio"
                  id="age3"
                  name="age_group"
                  value="30代"
                  checked={editedProfile?.age === "30代"}
                  onChange={() => setUserProfile({ ...editedProfile, age: "30代" })}
                />
                <label htmlFor="age3" className='ml-2'>30代</label>
              </div>

              <div className='inline-block mr-4'>
                <input
                  type="radio"
                  id="age4"
                  name="age_group"
                  value="40代"
                  checked={editedProfile?.age === "40代"}
                  onChange={() => setUserProfile({ ...editedProfile, age: "40代" })}
                />
                <label htmlFor="age4" className='ml-2'>40代</label>
              </div>

              <div className='inline-block mr-4'>
                <input
                  type="radio"
                  id="age5"
                  name="age_group"
                  value="50代"
                  checked={editedProfile?.age === "50代"}
                  onChange={() => setUserProfile({ ...editedProfile, age: "50代" })}
                />
                <label htmlFor="age5" className='ml-2'>50代</label>
              </div>

              <div className='inline-block'>
                <input
                  type="radio"
                  id="age6"
                  name="age_group"
                  value="60代～"
                  checked={editedProfile?.age === "60代～"}
                  onChange={() => setUserProfile({ ...editedProfile, age: "60代～" })}
                />
                <label htmlFor="age6" className='ml-2'>60代～</label>
              </div>
          </div>

          <div>
            <p className='mb-2 font-bold'>肌タイプ</p>

            <div className='inline-block mr-4'>
              <input
                type="radio"
                id="skinType1"
                name="skin_type"
                value="普通肌"
                checked={editedProfile.skinType === "普通肌"}
                onChange={() => setUserProfile({ ...editedProfile, skinType: "普通肌" })}
              />
              <label htmlFor="skinType1" className='ml-2'>普通肌</label>
            </div>

            <div className='inline-block mr-4'>
              <input
                type="radio"
                id="skinType2"
                name="skin_type"
                value="乾燥肌"
                checked={editedProfile.skinType === "乾燥肌"}
                onChange={() => setUserProfile({ ...editedProfile, skinType: "乾燥肌" })}
              />
              <label htmlFor="skinType2" className='ml-2'>乾燥肌</label>
            </div>

            <div className='inline-block mr-4'>
              <input
                type="radio"
                id="skinType3"
                name="skin_type"
                value="混合肌"
                checked={editedProfile.skinType === "混合肌"}
                onChange={() => setUserProfile({ ...editedProfile, skinType: "混合肌" })}
                />
              <label htmlFor="skinType3" className='ml-2'>混合肌</label>
            </div>

            <div className='inline-block mr-4'>
              <input
                type="radio"
                id="skinType4"
                name="skin_type"
                value="脂性肌"
                checked={editedProfile.skinType === "脂性肌"}
                onChange={() => setUserProfile({ ...editedProfile, skinType: "脂性肌" })}
              />
              <label htmlFor="skinType4" className='ml-2'>脂性肌</label>
            </div>

            <div className='inline-block mr-4'>
              <input
                type="radio"
                id="skinType5"
                name="skin_type"
                value="敏感肌"
                checked={editedProfile.skinType === "敏感肌"}
                onChange={() => setUserProfile({ ...editedProfile, skinType: "敏感肌" })}
              />
              <label htmlFor="skinType5" className='ml-2'>敏感肌</label>
            </div>

            <div className='inline-block mr-4'>
              <input
                type="radio"
                id="skinType6"
                name="skin_type"
                value="アトピー肌"
                checked={editedProfile.skinType === "アトピー肌"}
                onChange={() => setUserProfile({ ...editedProfile, skinType: "アトピー肌" })}
              />
              <label htmlFor="skinType6" className='ml-2'>アトピー</label>
            </div>
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
