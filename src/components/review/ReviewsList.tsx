'use client';

import React, { useEffect, useState } from 'react'
import { Review, ReviewWithProductAndUser } from '@/types/Reviews';
import { Product } from '@/types/Product';
import { UserProfile } from '@/types/UserProfile';
import { db } from '@/app/firebase';
import { getDocs, collection, query, orderBy, where } from 'firebase/firestore';

type ReviewsListProps = {
  productsToShow: Product[]
}

const ReviewsList = ({ productsToShow }: ReviewsListProps ) => {

  const [detailedReviews, setDetailedReviews] = useState<ReviewWithProductAndUser[] | null>(null);
    // [
    //   {
    //     reviewId: "",
    //     luminosity: 0,
    //     coverage: 0,
    //     longevity: 0,
    //     moisturizing: 0,
    //     comments: "",
    //     sendAt: "",
    //     reviewedProductInfo: {
    //       id: "",
    //       brand: "",
    //       name: "",
    //       price: 0,
    //       type: "other",
    //       spf: "",
    //       capacity: "",
    //       feature: "",
    //       color: 0,
    //       image: "",
    //     },
    //     reviewerInfo: {
    //       id: "",
    //       nickname: "",
    //       age: "",
    //       gender: "",
    //       skinType: "",
    //       icon: "",
    //     }
    //   },
    // ]
  // )

  useEffect(() => {
    console.log("productsToShow")
    console.log(productsToShow)

    //レビュー情報取得
    const fetchReviews = async () => {
      const reviewsSnapshot = await getDocs(query(collection(db, "reviews"), orderBy("sendAt", "desc")));
      return reviewsSnapshot.docs.map(doc => doc.data()) as Review[];
    }

    //レビューしたユーザー情報だけを取得
    
    const fetchUsers = async (reviews: Review[]) => {
      const userIds = reviews.map(review => review.userId);
      const usersSnapshot = await getDocs(query(collection(db, "userProfiles"), where("id", "in", userIds)));
      return usersSnapshot.docs.map(doc => doc.data()) as UserProfile[];
    }

    //表示させる用のオフジェクトを作成
    const getDetailedReviews = async () => {
      const reviews = await fetchReviews();
      const users = await fetchUsers(reviews);
      console.log(reviews, users)

      const newDetailedReviews = reviews.map(review => {
        const productInfo = productsToShow.find(product => product.id === review.productId);
        const userInfo = users.find(user => user.id === review.userId);

        console.log(productInfo, userInfo)

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
      }).filter(review => review !== undefined) as ReviewWithProductAndUser[];

      console.log(newDetailedReviews)
      setDetailedReviews(newDetailedReviews);
    }

    getDetailedReviews();
  }, [productsToShow])




  return (
    <div>
      <ul>
        {detailedReviews && detailedReviews.map(review => (
          <li key={review.reviewId} className='border border-gray-700 mt-4'>
            <div className='flex items-center gap-4'>
              <div className='w-[60px] h-[60px rounded-full overflow-hidden'>
                <img src={review.reviewerInfo.icon} alt={review.reviewerInfo.nickname} />
              </div>
              <div>
                <p>{review.reviewerInfo.nickname}</p>
                <span>{review.reviewerInfo.age}・{review.reviewerInfo.skinType}</span>
              </div>
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

export default ReviewsList