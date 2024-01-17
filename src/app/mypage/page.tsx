"use client";

import React, { useState, useEffect } from 'react'
import { app, db } from '../firebase';
import { UserProfile } from '@/types/UserProfile';
import { getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import RegisterUserProfile from '@/components/mypage/RegisterUserProfile';
import useLoginGuard from '@/auth/useLoginGuard';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import CurrentUserProfileView from '@/components/mypage/CurrentUserProfileView';
import UserReviewsList from '@/components/mypage/UserReviewsList';

const MyPage = () => {

  useLoginGuard();

  const router = useRouter();
  const auth = getAuth(app);

  //初回訪問を判定する
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  useEffect(() => {
    const userId = auth.currentUser?.uid;

    if (userId) {
      const hasVisited = localStorage.getItem(`hasVisited_${userId}`);
      if (!hasVisited) {
        setIsFirstVisit(true);
        localStorage.setItem(`hasVisited_${userId}`, 'true');
        console.log('初回訪問の確認に成功しました。')
      }
    } else {
      console.log('初回訪問の確認に失敗しました。/signupにリダイレクトします')
      router.push('/signup');
    }
  }, [auth.currentUser]);

  //firebaseからログインしているユーザープロフィールを取得
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile>();
  useEffect(() => {

    // ログインしていない場合は処理を終了する
    if (!auth.currentUser) {
      console.log('ログインしていません。/loginにリダイレクトします。');
      router.push('/login');
      return;
    };

    // ユーザープロフィールを取得
    const userProfilesRef = collection(db, 'userProfiles');
    const q = query(userProfilesRef, where('id', '==', auth.currentUser?.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userProfileData = snapshot.docs[0]?.data() as UserProfile;
      setCurrentUserProfile(userProfileData);
    });

    return () => unsubscribe();
  }, [auth.currentUser])

  return (
    <div className='flex flex-col justify-start mt-8'>
      <div className='w-full inner'>

        {/* 初回登録の場合はユーザープロフィールを登録 */}
        {isFirstVisit && <RegisterUserProfile setIsFirstVisit={setIsFirstVisit} />} 

        {/* ユーザープロフィールを表示 */}
        {currentUserProfile && <CurrentUserProfileView currentUserProfile={currentUserProfile} /> }

        <UserReviewsList />
      </div>

    </div>
  )
}

export default MyPage