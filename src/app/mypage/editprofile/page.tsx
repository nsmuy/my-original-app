"use client";

import React, { useState, useEffect } from 'react';
import { UserProfile } from '@/types/UserProfile';
import useLoginGuard from '@/auth/useLoginGuard';
import { app, db } from '../../firebase';
import { getAuth } from "firebase/auth";
import { doc, collection, onSnapshot, query, where, updateDoc } from 'firebase/firestore';
import { useRouter } from "next/navigation";

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
  });

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
      const userProfileRef = doc(db, "userProfiles", userProfile.id);
      try {
        await updateDoc(userProfileRef, {
          ...editedProfile,
        });
        console.log("プロフィールが更新されました");
      } catch (error) {
        console.error("プロフィールの更新に失敗しました", error);
      }
      router.push("/mypage");
    }
  };

  return (
    <div>
      <form onSubmit={handleEditProfile}>

        <div>
          <label htmlFor="nickname">ニックネーム</label>
          <input
            id="nickname"
            type="text"
            placeholder="ニックネーム"
            className="border border-gray-300 p-2 m-2"
            value={editedProfile?.nickname || ''}
            onChange={(e) => setEditedProfile({ ...editedProfile, nickname: e.target.value })}
          />
        </div>

        <div>
            <p className='mb-2 font-bold'>年齢層</p>

            <div className='inline-block mr-4'>
              <input
                type="radio"
                id="age1"
                name="age_group"
                value="0-19"
                checked={editedProfile?.age === "0-19"}
                onChange={() => setUserProfile({ ...editedProfile, age: "0-19" })}
              />
              <label htmlFor="age1" className='ml-2'>～10代</label>
            </div>

            <div className='inline-block mr-4'>
              <input
                type="radio"
                id="age2"
                name="age_group"
                value="20-29"
                checked={editedProfile?.age === "20-29"}
                onChange={() => setUserProfile({ ...editedProfile, age: "20-29" })}
              />
              <label htmlFor="age2" className='ml-2'>20代</label>
            </div>

            <div className='inline-block mr-4'>
              <input
                type="radio"
                id="age3"
                name="age_group"
                value="30-39"
                checked={editedProfile?.age === "30-39"}
                onChange={() => setUserProfile({ ...editedProfile, age: "30-39" })}
              />
              <label htmlFor="age3" className='ml-2'>30代</label>
            </div>

            <div className='inline-block mr-4'>
              <input
                type="radio"
                id="age4"
                name="age_group"
                value="40-49"
                checked={editedProfile?.age === "40-49"}
                onChange={() => setUserProfile({ ...editedProfile, age: "40-49" })}
              />
              <label htmlFor="age4" className='ml-2'>40代</label>
            </div>

            <div className='inline-block mr-4'>
              <input
                type="radio"
                id="age5"
                name="age_group"
                value="50-59"
                checked={editedProfile?.age === "50-59"}
                onChange={() => setUserProfile({ ...editedProfile, age: "50-59" })}
              />
              <label htmlFor="age5" className='ml-2'>50代</label>
            </div>

            <div className='inline-block'>
              <input
                type="radio"
                id="age6"
                name="age_group"
                value="60+"
                checked={editedProfile?.age === "60+"}
                onChange={() => setUserProfile({ ...editedProfile, age: "60+" })}
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
              checked={editedProfile.skinType === "normal"}
              onChange={() => setUserProfile({ ...editedProfile, skinType: "normal" })}
            />
            <label htmlFor="skinType1" className='ml-2'>普通肌</label>
          </div>

          <div className='inline-block mr-4'>
            <input
              type="radio"
              id="skinType2"
              name="skin_type"
              value="dry"
              checked={editedProfile.skinType === "dry"}
              onChange={() => setUserProfile({ ...editedProfile, skinType: "dry" })}
            />
            <label htmlFor="skinType2" className='ml-2'>乾燥肌</label>
          </div>

          <div className='inline-block mr-4'>
            <input
              type="radio"
              id="skinType3"
              name="skin_type"
              value="combination"
              checked={editedProfile.skinType === "combination"}
              onChange={() => setUserProfile({ ...editedProfile, skinType: "combination" })}
              />
            <label htmlFor="skinType3" className='ml-2'>混合肌</label>
          </div>

          <div className='inline-block mr-4'>
            <input
              type="radio"
              id="skinType4"
              name="skin_type"
              value="oily"
              checked={editedProfile.skinType === "oily"}
              onChange={() => setUserProfile({ ...editedProfile, skinType: "oily" })}
            />
            <label htmlFor="skinType4" className='ml-2'>脂性肌</label>
          </div>

          <div className='inline-block mr-4'>
            <input
              type="radio"
              id="skinType5"
              name="skin_type"
              value="sensitive"
              checked={editedProfile.skinType === "sensitive"}
              onChange={() => setUserProfile({ ...editedProfile, skinType: "sensitive" })}
            />
            <label htmlFor="skinType5" className='ml-2'>敏感肌</label>
          </div>

          <div className='inline-block mr-4'>
            <input
              type="radio"
              id="skinType6"
              name="skin_type"
              value="atopic"
              checked={editedProfile.skinType === "atopic"}
              onChange={() => setUserProfile({ ...editedProfile, skinType: "atopic" })}
            />
            <label htmlFor="skinType6" className='ml-2'>アトピー</label>
          </div>
        </div>

        <button type="submit" className="bg-blue-500 text-white rounded py-2 px-4">
          更新
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
