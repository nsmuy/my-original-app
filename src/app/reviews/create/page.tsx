"use client"

import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../../../auth/AuthContext'
import { useRouter } from 'next/navigation';
import useLoginGuard from '@/auth/useLoginGuard';
import { Product } from '@/types/Product';
import ProductFiltersSelector from '@/components/ProductFilterSelector';
import FilteredProductsList from '@/components/FilteredProductsList';
import { Review } from '@/types/Reviews';
import { getAuth } from "firebase/auth";
import { addDoc, collection, doc, getDoc, getDocs, query, where } from "firebase/firestore"; 
import { db } from '@/app/firebase';
import { v4 as uuidv4 } from 'uuid';
import { ratingCriterias } from '@/constants/ratingData';
import { UserProfile } from '@/types/UserProfile';
import { initialBrandCheckedFilter, initialTypeCheckedFilter } from '@/functions/initializeFilters';

const CreateReview = () => {

  useLoginGuard();
  const router = useRouter();
  const { loading } = useAuthContext();

  if (loading) {
    return <div>ローディング中...</div>;
  }

  const auth = getAuth();
  const user = auth.currentUser;

  //商品を選ぶ際のフィルターの状態を保存する状態変数
  const [checkedFilters, setCheckedFilters] = useState<{
    brands: { [key: string]: boolean };
    types: { [key: string]: boolean };
  }>({
    brands: initialBrandCheckedFilter,
    types: initialTypeCheckedFilter
  });

  //レビューするユーザーの情報を保存する状態変数
  const [userInfo, setUserInfo] = useState<Omit<UserProfile, 'nickname' | 'icon'> | null>(null);

  // 入力するレビューに関する情報を保存する状態変数
  const [userReview, setUserReview] = useState<Review>({
    reviewId: '',
    productId: '',
    luminosity: 0,
    coverage: 0,
    longevity: 0,
    moisturizing: 0,
    comments: '',
    sendAt: '',
    userId: '',
    userAge: '',
    userGender: '',
    userSkinType: '',
  });

  //比較するために選んだ商品を保存する状態変数
  const [selectedProducts, setSelectedProducts] = useState<
  Product[]>([]);

  useEffect(() => {

      //ログインしているユーザー情報の取得
      const fetchLoginUserInfo = async () => {
        if(user) {
          const userRef = doc(db, "userProfiles", user.uid);
          const userDocSnap = await getDoc(userRef);

          if(userDocSnap.data()) {
            setUserInfo({
              ...userInfo,
              id: user.uid,
              age: userDocSnap.data()?.age,
              gender: userDocSnap.data()?.gender,
              skinType: userDocSnap.data()?.skinType,
            });
          }
        }
      }

      fetchLoginUserInfo();
  }, [])

  const handlePostReviews = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //重複をチェックする
    const reviewsRef = collection(db, "reviews");
    const q = query(reviewsRef, where("userId", "==", user?.uid), where("productId", "==", selectedProducts[0].id));
    const querySnapshot = await getDocs(q);
    if(!querySnapshot.empty) {
      alert("口コミは一度しか書けません。");
      return;
    }

    await addDoc(collection(db, "reviews"), {
      ...userReview,
      reviewId: uuidv4(),
      productId: selectedProducts[0].id,
      userId: user?.uid,
      sendAt: new Date().toISOString(),
      userAge: userInfo?.age,
      userGender: userInfo?.gender,
      userSkinType: userInfo?.skinType,
    });

    router.push("/reviews/");
  }

  return (
    <div className='mt-8'>
      <div className='inner'>
        <h2 className='font-bold border-b border-amber-200'>口コミしたい商品を選んでね！</h2>
        
        {/* 商品を絞り込み */}
        <ProductFiltersSelector
          checkedFilters={checkedFilters}
          setCheckedFilters={setCheckedFilters}
        />

        {/* フィルタリングした商品を表示 */}
        <FilteredProductsList
          checkedFilters={checkedFilters}
          selectedProducts={selectedProducts}
          setSelectedProducts={setSelectedProducts}
          singleSelectMode={true}
        />

        {selectedProducts.length > 0 && (
          <div className='mt-8'>
            <h3 className='font-bold border-b border-amber-200'>口コミを入力してください！</h3>

            <form onSubmit={(e) => handlePostReviews(e)}>

              {/* 選択肢式の回答欄 */}
              {Object.entries(ratingCriterias).map(([key, value]) => (
                <div key={key} className='mt-4'>
                  <label className='font-bold'>■{value.label}</label>
                  <div className='flex gap-3'>
                    {value.options.map(option => (
                      <div key={option.value}>
                        <input
                          type="radio"
                          id={`${key}_${option.value}`}
                          name={key}
                          value={option.value}
                          onChange={(e) => setUserReview({ ...userReview, [key]: Number(e.target.value) })}
                          required
                        />
                        <label htmlFor={`${key}_${option.value}`}>{option.label}</label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* コメント解答欄 */}
              <div className='mt-4'>
                <label htmlFor="comments" className='block font-bold'>■コメント</label>
                <textarea
                  id="comments"
                  name="comments"
                  className='mt-1 w-full aspect-[3/1] resize-none border border-amber-500 focus:outline-amber-500 rounded-md p-2'
                  value={userReview.comments}
                  onChange={(e) => setUserReview({ ...userReview, comments: e.target.value })}
                  required
                />
              </div>

              <button
                type="submit"
                className='bg-amber-500 text-white rounded-md w-[160px] h-[44px] font-bold letter-spacing-1 mt-8'
              >
                口コミを投稿する
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  )
}

export default CreateReview