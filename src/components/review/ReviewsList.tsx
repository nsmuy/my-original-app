'use client';

import React, { useEffect, useState } from 'react'
import { ReviewType, ReviewWithProductAndUserType } from '@/types/Reviews';
import { ProductType } from '@/types/Product';
import { UserProfileType } from '@/types/UserProfile';
import { db } from '@/app/firebase';
import { getDocs, collection, query, orderBy, where } from 'firebase/firestore';
import { usePathname } from 'next/navigation';
import { getProfileOptionsLabel } from '@/functions/getProfileOptionsLabel';
import Image from "next/image";

type ReviewsListProps = {
  productsToShow: ProductType[]
}

const ReviewsList = ({ productsToShow }: ReviewsListProps ) => {

  const pathname = usePathname();
  const [detailedReviews, setDetailedReviews] = useState<ReviewWithProductAndUserType[] | null>(null);

  useEffect(() => {
    
    //全てのレビュー情報取得
    const fetchReviews = async () => {
      const reviewsSnapshot = await getDocs(query(collection(db, "reviews"), orderBy("sendAt", "desc")));
      return reviewsSnapshot.docs.map(doc => doc.data()) as ReviewType[];
    }

    //レビューしたユーザー情報だけを取得
    const fetchUsers = async (reviews: ReviewType[]) => {
      const userIds = reviews.map(review => review.userId);
      const usersSnapshot = await getDocs(query(collection(db, "userProfiles"), where("id", "in", userIds)));
      return usersSnapshot.docs.map(doc => doc.data()) as UserProfileType[];
    }

    //表示させる用のオフジェクトを作成
    const getDetailedReviews = async () => {
      const reviews = await fetchReviews();

      if(reviews.length === 0) {
        setDetailedReviews([]);
        return;
      }

      const users = await fetchUsers(reviews);

      const newDetailedReviews = reviews.map(review => {
        const productInfo = productsToShow.find(product => product.id === review.productId);
        const userInfo = users.find(user => user.id === review.userId);

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
      }).filter(review => review !== undefined) as ReviewWithProductAndUserType[];

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
                  <Image
                    src={review.reviewerInfo.icon}
                    alt={review.reviewerInfo.nickname}
                    width={100}
                    height={100}
                    style={{ objectFit: 'cover' }}
                  ></Image>
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
                    <Image
                      src={review.reviewedProductInfo.image}
                      alt={review.reviewedProductInfo.name}
                      width={100}
                      height={100}
                      style={{ objectFit: 'cover' }}
                    ></Image>
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