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
                <div className='w-[60px] h-[60px] rounded-full overflow-hidden relative'>
                  <Image
                    src={review.reviewerInfo.icon}
                    alt={review.reviewerInfo.nickname}
                    fill
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
                    <div className='w-[80px] h-[80px] rounded-full overflow-hidden relative'>
                      <Image
                        src={review.reviewedProductInfo.image}
                        alt={review.reviewedProductInfo.name}
                        fill
                      ></Image>
                    </div>
                    <div className='text-sm'>
                      <p>{review.reviewedProductInfo.brand}</p>
                      <p>{review.reviewedProductInfo.name}</p>
                    </div>
                  </div>
                )}
  
                {/* レビュー情報 */}
                <div className='mt-4 text-sm'>
                  <ReviewListItem label={'ツヤ感'} value={review.luminosity}/>
                  <ReviewListItem label={'カバー力'} value={review.coverage}/>
                  <ReviewListItem label={'崩れにくさ'} value={review.longevity}/>
                  <ReviewListItem label={'保湿力'} value={review.moisturizing}/>
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

const ReviewListItem= ({label, value}: {label: string, value: number}) => {
  return (
    <div>
      <span>{label}：</span>
      <span>{value}</span>
    </div>
  )
}