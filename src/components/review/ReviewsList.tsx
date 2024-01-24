'use client';

import React, { useEffect, useState } from 'react'
import { Review, ReviewWithProductAndUser } from '@/types/Reviews';
import { Product } from '@/types/Product';
import { UserProfile } from '@/types/UserProfile';
import { db } from '@/app/firebase';
import { getDocs, collection, query, orderBy, where } from 'firebase/firestore';
import { usePathname } from 'next/navigation';
import { getProfileOptionsLabel } from '@/functions/getProfileOptionsLabel';

type ReviewsListProps = {
  productsToShow: Product[]
}

const ReviewsList = ({ productsToShow }: ReviewsListProps ) => {

  const pathname = usePathname();
  const [detailedReviews, setDetailedReviews] = useState<ReviewWithProductAndUser[] | null>(null);

  useEffect(() => {
    
    //全てのレビュー情報取得
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

      console.log('newDetailedReviews')
      console.log(newDetailedReviews)
      setDetailedReviews(newDetailedReviews);
    }

    getDetailedReviews();
  }, [productsToShow])

  return (
    <div className='mt-6'>
      <ul className='flex flex-col gap-4'>
        {detailedReviews !== null && 
          detailedReviews.length !== 0 ? detailedReviews.map(review => (
            <li
              key={review.reviewId}
              className='bg-white rounded-md p-4 shadow-sm'
            >
              <div className='flex items-center gap-4 pb-4 border-b'>
                <div className='w-[60px] h-[60px rounded-full overflow-hidden'>
                  <img src={review.reviewerInfo.icon} alt={review.reviewerInfo.nickname} />
                </div>
                <div className='text-sm'>
                  <p>{review.reviewerInfo.nickname}</p>
                  <span>
                    {getProfileOptionsLabel('age', review.reviewerInfo.age)}・{getProfileOptionsLabel('gender', review.reviewerInfo.gender)} / {getProfileOptionsLabel('skinType', review.reviewerInfo.skinType)}
                  </span>
                </div>
              </div>
  
              <div className='mt-4'>
                {pathname === '/reviews' && (
                  // 商品情報
                  <div className='flex items-center gap-4'>
                    <img
                      src={review.reviewedProductInfo.image}
                      alt={review.reviewedProductInfo.name}
                      className='w-[100px]'
                    />
                    <div className='text-sm'>
                      <p>{review.reviewedProductInfo.brand}</p>
                      <p>{review.reviewedProductInfo.name}</p>
                    </div>
                  </div>
                )}
  
                {/* レビュー情報 */}
                <div className='mt-4 text-sm'>
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
                  <div className='mt-2'>
                    <p>{review.comments}</p>
                  </div>
                </div>
              </div>
            </li>
          )) : (
            <p>
              口コミはまだありません。
            </p>
          )
        }
      </ul>
    </div>
  )
}

export default ReviewsList