'use client';

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from '../firebase';
import { Review, CompleteReview } from '@/types/Reviews';
import { Product } from '@/types/Product';
import { UserProfile } from 'firebase/auth';

const Reviews = () => {

  const router = useRouter();
  const initialCompleteReviews: CompleteReview[] = [{
    reviewId: "",
    luminosity: "",
    coverage: "",
    longevity: "",
    moisturizing: "",
    comments: "",
    sendAt: "",
    reviewedProductInfo: {
      id: "",
      brand: "",
      name: "",
      price: 0,
      type: "other",
      spf: "",
      capacity: "",
      feature: "",
      color: 0,
      image: "",
    },
    reviewerInfo: {
      id: "",
      nickname: "",
      age: "",
      gender: "",
      skinType: "",
    }
  }];

  const [completeReviews, setCompleteReviews] = useState<CompleteReview[]>(initialCompleteReviews);

  useEffect(() => {
    const fetchData = async () => {
      // 商品情報の取得
      const productsSnapshot = await getDocs(query(collection(db, "products")));
      const products = productsSnapshot.docs.map(doc => {
        return {
          id: doc.id,
          ...doc.data()
        }
      }) as Product[];

      // ユーザー情報の取得
      const usersSnapshot = await getDocs(query(collection(db, "userProfiles")));
      const users = usersSnapshot.docs.map(doc => doc.data()) as UserProfile[];

      // レビュー情報の取得
      const reviewsSnapshot = await getDocs(query(collection(db, "reviews"), orderBy("sendAt", "desc")));
      const reviews = reviewsSnapshot.docs.map(doc => doc.data()) as Review[];

      // CompleteReviewの作成
      const newCompleteReviews = reviews.map(review => {
        const productInfo = products.find(product => product.id === review.productId);
        const userInfo = users.find(user => user.id === review.userId);

        console.log(productInfo)
        console.log(userInfo)

        if(productInfo && userInfo) {
          return {
            reviewId: review.reviewId,
            luminosity: review.luminosity,
            coverage: review.coverage,
            longevity: review.longevity,
            moisturizing: review.moisturizing,
            comments: review.comments,
            sendAt: review.sendAt,
            reviewedProductInfo: productInfo,
            reviewerInfo: userInfo,
          };
        }
        return undefined;
      }).filter(review => review !== undefined) as CompleteReview[];

      console.log(newCompleteReviews);
      setCompleteReviews(newCompleteReviews);
    };

    fetchData();
  }, [router]);

  return (
    <div>
      <h2>口コミ一覧（新着順）</h2>
      <ul>
        {completeReviews.map(review => (
          <li key={review.reviewId} className='border border-gray-700 mt-4'>
            <div>
              <p>{review.reviewerInfo.nickname}</p>
              <span>{review.reviewerInfo.age}</span>
              <span>{review.reviewerInfo.skinType}</span>
            </div>
            <div>
              {/* 商品情報 */}
              <div className='flex'>
                <img
                  src={review.reviewedProductInfo.image}
                  alt={review.reviewedProductInfo.name}
                  className='w-[100px]'
                />
                <div>
                  <p>{review.reviewedProductInfo.brand}</p>
                  <p>{review.reviewedProductInfo.name}</p>
                </div>
              </div>
              
              {/* レビュー情報 */}
              <div>
                <div>
                  <span>ツヤ感：</span>
                  <span>{review.luminosity}</span>
                </div>
                <div>
                  <span>カバー力：</span>
                  <span>{review.coverage}</span>
                </div>
                <div>
                  <span>崩れにくさ：</span>
                  <span>{review.longevity}</span>
                </div>
                <div>
                  <span>保湿力：</span>
                  <span>{review.moisturizing}</span>
                </div>
                <div>
                  <p>{review.comments}</p>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Reviews