"use client"

import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../../../auth/AuthContext'
import { useRouter } from 'next/navigation';
import useLoginGuard from '@/auth/useLoginGuard';
import { Product } from '@/types/Product';
import { UserProfile } from '@/types/UserProfile';
import ProductFiltersSelector from '@/components/ProductFilterSelector';
import FilteredProductsList from '@/components/FilteredProductsList';
import { Review } from '@/types/Reviews';
import { getAuth } from "firebase/auth";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore"; 
import { db } from '@/app/firebase';
import { v4 as uuidv4 } from 'uuid';
import { allBrands, allTypes } from '@/constants/productData';
import { ratingCriterias } from '@/constants/ratingData';

const CreateReview = () => {

  useLoginGuard();
  // const router = useRouter();
  const { loading } = useAuthContext();

  if (loading) {
    return <div>ローディング中...</div>;
  }

  const auth = getAuth();
  const user = auth.currentUser;

  //商品を選ぶ際のフィルターの状態を保存する状態変数
  const [checkedFilters, setCheckedFilters] = useState({
    brands: {},
    types: {},
  })

  // 入力するレビューに関する情報を保存する状態変数
  const [userReview, setUserReview] = useState<Review>({
    reviewId: "",
    productId: "",
    userId: "",
    luminosity: "",
    coverage: "",
    longevity: "",
    moisturizing: "",
    comments: "",
    sendAt: "",
  });

  //比較するために選んだ商品を保存する状態変数
  const [selectedProducts, setSelectedProducts] = useState<
  Product[]>([]);

  useEffect(() => {
      //ブランドの初期化
      const initialBrandCheckedFilter = Object.keys(allBrands).reduce((acc: { [key: string]: boolean }, brand: string) => {
        acc[brand] = false;
        return acc;
      }, {} as { [key: string]: boolean });
      //タイプの初期化
      const initialTypeCheckedFilter = Object.keys(allTypes).reduce((acc: { [key: string]: boolean }, type: string) => {
        acc[type] = false;
        return acc;
      }, {} as { [key: string]: boolean });

      setCheckedFilters({
        brands: initialBrandCheckedFilter,
        types: initialTypeCheckedFilter
      })
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
    });
  }

  return (
    <div>
      <h2>口コミしたい商品を選んでね！</h2>
      
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
        <div>
          <h3>口コミ入力欄</h3>

          <form onSubmit={(e) => handlePostReviews(e)}>

            {/* 選択肢式の回答欄 */}
            {Object.entries(ratingCriterias).map(([key, value]) => (
              <div key={key}>
                <label>{value.label}：</label>
                {value.options.map(option => (
                  <div key={option.value}>
                    <input
                      type="radio"
                      id={`${key}_${option.value}`}
                      name={key}
                      value={option.value}
                      onChange={(e) => setUserReview({ ...userReview, [key]: e.target.value })}
                      required
                    />
                    <label htmlFor={`${key}_${option.value}`}>{option.label}</label>
                  </div>
                ))}
              </div>
            ))}

            {/* コメント解答欄 */}
            <div>
              <label htmlFor="comments">コメント</label>
              <textarea
                id="comments"
                name="comments"
                value={userReview.comments}
                onChange={(e) => setUserReview({ ...userReview, comments: e.target.value })}
                required
              />
            </div>

            <button type="submit">口コミを投稿する</button>
          </form>
        </div>
      )}

    </div>
  )
}

export default CreateReview