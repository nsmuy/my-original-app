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
import Link from 'next/link';

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
      }
    } else {
      router.push('/signup');
    }
  }, [auth.currentUser]);

  //firebaseからログインしているユーザープロフィールを取得
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | null>(null);
  useEffect(() => {

    // ログインしていない場合は処理を終了する
    if (!auth.currentUser) {
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
        {currentUserProfile && (
          <div>
            <div className='flex gap-5 my-8'>
              <Link href={"/comparison"} className='bg-white rounded-md shadow-sm p-8 flex-1 text-center'>
                <p>気になるファンデーションを比較する</p>
              </Link>

              <Link href={"/reviews"} className='bg-white rounded-md shadow-sm p-8 flex-1 text-center'>
                <p>口コミを見る・書く</p>
              </Link>
            </div>
            <CurrentUserProfileView currentUserProfile={currentUserProfile} />
          </div>
        )}

        <UserReviewsList />
      </div>

    </div>
  )
}

export default MyPage