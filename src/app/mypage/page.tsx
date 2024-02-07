"use client";

import React, { useState, useEffect } from 'react'
import { app, db } from '../firebase';
import { UserProfileType, UserProfileStateType } from '@/types/UserProfile';
import { getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import RegisterUserProfile from '@/components/mypage/RegisterUserProfile';
import useLoginGuard from '@/auth/useLoginGuard';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import CurrentUserProfileView from '@/components/mypage/CurrentUserProfileView';
import UserReviewsList from '@/components/mypage/UserReviewsList';
import Link from 'next/link';
import { fetchUserProfile } from '@/functions/fetchUserProfile';

const MyPage = () => {

  useLoginGuard();

  const router = useRouter();
  const auth = getAuth(app);

  //ユーザーの訪問状態・プロフィールの登録状態を判定する
  const [userProfileState, setUserProfileState] = useState<UserProfileStateType>({
    userId: '',
    isFirstVisit: true,
    isRegistered: false,
  });

  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  //firebaseからログインしているユーザープロフィールを取得
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfileType | undefined>(undefined);

  //ユーザープロフィールの状態を取得する関数
  const fetchUserProfileState = async () => {

    if(!auth.currentUser) return;

    const userProfileStateRef = doc(db, 'userProfileState', auth.currentUser.uid);
    const snapshot = await getDoc(userProfileStateRef);

    if (snapshot.exists()) {
      return snapshot.data() as UserProfileStateType;
    } else {
      setDoc(doc(db, 'userProfileState', auth.currentUser.uid), {
        ...userProfileState,
        userId: auth.currentUser.uid,
      });
      return { userId: auth.currentUser.uid, isFirstVisit: true, isRegistered: false};
    }
  }

  useEffect(() => {
    // ログインしていない場合は処理を終了する
    if(!auth.currentUser) {
      router.push('/login');
      return;
    } else {
      // ログインしているユーザーのプロフィールを取得
      const userId = auth.currentUser.uid;
      const loadUserProfile = async () => {
        const UserProfile = await fetchUserProfile(userId);
        if (UserProfile) {
          setCurrentUserProfile(UserProfile);
        }
      }
  
      // ログインしているユーザープロフィールの状態を取得
      const loadUserProfileState = async () => {
        const newUserVisitState = await fetchUserProfileState();
        if (newUserVisitState) {
          setUserProfileState(newUserVisitState);

          if(!newUserVisitState.isRegistered) {
            setIsFormVisible(true);
          }
        }
      }
  
      loadUserProfile();
      loadUserProfileState();
    }

  }, [auth.currentUser, router]);

  useEffect(() => {
    console.log(isFormVisible)
  }, [isFormVisible])

  return (
    <div className='flex flex-col justify-start mt-8'>
      <div className='w-full inner'>

        {userProfileState && 
          (isFormVisible ? (
            <RegisterUserProfile
              userProfileState={userProfileState}
              setUserProfileState={setUserProfileState}
              setIsFormVisible={setIsFormVisible}
            />
          ) : (
            <div>
            <div className='flex gap-5 my-8'>
              <Link href={"/comparison"} className='bg-white rounded-md shadow-sm p-8 flex-1 text-center'>
                <p>気になるファンデーションを比較する</p>
              </Link>

              <Link href={"/reviews"} className='bg-white rounded-md shadow-sm p-8 flex-1 text-center'>
                <p>口コミを見る・書く</p>
              </Link>
            </div>

            <CurrentUserProfileView
              currentUserProfile={currentUserProfile}
            />
            <UserReviewsList />

          </div>
          ))
        }
      </div>
    </div>
  )
}

export default MyPage