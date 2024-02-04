'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { app, db } from '@/app/firebase';
import { getAuth } from "firebase/auth";
import { collection, query, where, getDocs, getDoc, doc } from "firebase/firestore";
import { ReviewType, ReviewWithProductType } from '@/types/Reviews';
import { ProductType } from '@/types/Product';

const UserReviewsList = () => {
  const router = useRouter();
  const auth = getAuth(app);
  const userId = auth.currentUser?.uid;
  const [userReviewsWithProduct, setUserReviewsWithProduct] = useState<ReviewWithProductType[] | null>(null);

  useEffect(() => {
    const getNewUserReviewsList = async () => {
  
      //ユーザーIDを持つレビューをfirebaseから取得
      const fetchUserReviews = async () => {
        if (userId) {
          const q = query(collection(db, 'reviews'), where('userId', '==', userId));
          const querySnapshot = await getDocs(q);
          return querySnapshot.docs.map(doc => doc.data() as ReviewType);
        }
        return [];
      }

      //レビューに紐づく商品情報を取得
      const fetchReviewedProducts = async (userReviews: ReviewType[]) => {
        const reviewedProducts = [];
        for (const review of userReviews) {
          const productSnap = await getDoc(doc(db, 'products', review.productId));
          const productData = productSnap.data() as ProductType;
          reviewedProducts.push({...review, reviewedProductInfo: productData});
        }
        return reviewedProducts;
      };

      const userReviews = await fetchUserReviews();
      const newUserReviewsWithProduct = await fetchReviewedProducts(userReviews);
      setUserReviewsWithProduct(newUserReviewsWithProduct)
    }
    getNewUserReviewsList();
  }, [userId]);

  return (
    <div>
      <div className='flex justify-between border-b border-amber-500 mt-10 pb-2'>
        <h2 className='text-xl font-bold text-amber-500'>あなたがレビューした商品</h2>
        <button onClick={() => router.push('/reviews/create')} className='text-amber-500 border border-amber-500 rounded-md px-4 py-1 hover:bg-amber-500 hover:text-white'>口コミを投稿する</button>
      </div>

      <div className='mt-6 flex flex-col gap-4 text-sm'>
        {userReviewsWithProduct && (
          userReviewsWithProduct.length > 0 ? (
            userReviewsWithProduct?.map((review) => (
              <div key={review.reviewId} className='bg-white shadow-sm rounded-md p-8'>
                <div className='flex items-center gap-4 border-b'>
                  <div className='w-20 aspect-square rounded-md overflow-hidden'>
                    <img src={review.reviewedProductInfo.image} alt={review.reviewedProductInfo.name} />
                  </div>
                  <div>
                    <p>{review.reviewedProductInfo.brand}</p>
                    <h2>{review.reviewedProductInfo.name}</h2>
                  </div>
                </div>
                <div className='px-4 mt-4'>
                  <p>ツヤ感：{review.luminosity}</p>
                  <p>カバー力：{review.coverage}</p>
                  <p>崩れにくさ：{review.longevity}</p>
                  <p>保湿力：{review.moisturizing}</p>
                  <p>口コミ：{review.comments}</p>
                </div>
              </div>
            ))
          ) : (
            <p>口コミがありません</p>
          )
        )}
      </div>
    </div>
  )
}

export default UserReviewsList