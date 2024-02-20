'use client';

import React, { useEffect, useState } from 'react'
import { ReviewType, ReviewWithProductAndUserType } from '@/types/Reviews';
import { ProductType } from '@/types/Product';
import { db } from '@/app/firebase';
import { getDocs, getDoc, collection, query, orderBy, doc, where } from 'firebase/firestore';
import { usePathname } from 'next/navigation';
import { getProfileOptionsLabel } from '@/functions/getProfileOptionsLabel';
import Image from "next/image";

type ReviewsListProps = {
  // productsToShow: ProductType[]
  productId: string; 
}

const ReviewsList = ({ productId }: ReviewsListProps ) => {

  const pathname = usePathname();
  const [detailedReviews, setDetailedReviews] = useState<ReviewWithProductAndUserType[] | undefined>(undefined);

  //allまたは指定したproductIdを持つレビューを取得する関数
  const fetchReviews = async ( productId: string ) => {
    if(productId === 'all') {
      const reviewsSnapshot = await getDocs(query(collection(db, "reviews")));
      return reviewsSnapshot.docs.map(doc => doc.data()) as ReviewType[];
    } else {
      const reviewsSnapshot = await getDocs(query(collection(db, "reviews"), where("productId", "==", productId)));
      return reviewsSnapshot.docs.map(doc => doc.data()) as ReviewType[];
    }
  }

  useEffect(() => {

    const createDetailedReviews = async () => {

      //表示するレビュー情報を取得
      const reviews = await fetchReviews(productId);

      if (reviews.length !== 0) {
        const detailedReviews = await Promise.all (reviews.map( async (review) => {

          //レビューに紐づく商品情報を取得
          const reviewedProductDataSnapshot = await getDoc(doc(db, "products", review.productId));
          const reviewedProductData = reviewedProductDataSnapshot.data();

          //レビューに紐づくユーザー情報を取得
          const reviewUserDataSnapshot = await getDoc(doc(db, "userProfiles", review.userId));
          const reviewUserData = reviewUserDataSnapshot.data();

          if(reviewedProductData && reviewUserData) {
            return {
              reviewId: review.reviewId,
              luminosity: review.luminosity,
              coverage: review.coverage,
              longevity: review.longevity,
              moisturizing: review.moisturizing,
              comments: review.comments,
              sendAt: review.sendAt,
              reviewedProductInfo: reviewedProductData,
              reviewerInfo: reviewUserData,
            } as ReviewWithProductAndUserType;
          } else {
            return undefined;
          }
        }));
        setDetailedReviews(detailedReviews.filter(review => review !== undefined) as ReviewWithProductAndUserType[]);
      } else {
        return;
      }
    }

    createDetailedReviews();
  }, [productId])

  return (
    <div className='mt-8'>
      {detailedReviews && (
        <div className='inner'>
          <h2 className='font-bold border-b border-amber-200'>
            {productId === 'all' ? 'すべての口コミ（新着順）' : `${detailedReviews[0].reviewedProductInfo.name} の口コミ（新着順）`}
          </h2>
          <ul className='flex flex-col gap-4 mt-4'>
            {detailedReviews && 
              detailedReviews.length !== 0 ? detailedReviews.map(review => (
                <li
                  key={review.reviewId}
                  className='bg-white rounded-md p-4 shadow-sm'
                >
                  <div className='flex items-center gap-4 pb-4 border-b'>
                    <div className='w-[40px] h-[40px] rounded-full overflow-hidden relative'>
                      <Image
                        src={review.reviewerInfo.icon}
                        alt={review.reviewerInfo.nickname}
                        width={40}
                        height={40}
                        className='w-full h-full'
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
                        <div className='rounded-full overflow-hidden relative'>
                          <Image
                            src={review.reviewedProductInfo.image}
                            alt={review.reviewedProductInfo.name}
                            width={80}
                            height={80}
                            className='w-full h-full'
                            style={{ objectFit: 'cover' }}
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
      )}
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