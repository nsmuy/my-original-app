'use client';

import React, { useEffect, useState } from 'react'
import { ProductWithReviewsAndRatings, Product } from '@/types/Product';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/app/firebase';
import { Review } from '@/types/Reviews';
import ComparisonResultTable from '@/components/comparison/ComparisonResultTable';
import { calcAverageRatings } from '@/functions/calcAverageRatings';
import { UserFilter } from '@/types/UserProfile';
import ComparisonUserFilters from '@/components/comparison/ComparisonUserFilters';

const ComparisonResult = () => {
  const initialUserFilters = {
    age: {
      teen: false,
      twenties: false,
      thirties: false,
      forties: false,
      fifties: false,
      sixtiesAndAbove: false,
    },
    gender: {
      male: false,
      female: false,
      other: false,
    },
    skinType: {
      normal: false,
      dry: false,
      combination: false,
      oily: false,
      sensitive: false,
      atopic: false,
    },
  };

  const [userFilters, setUserFilters] = useState<UserFilter>(initialUserFilters);
  const comparisonProducts = JSON.parse(localStorage.getItem('comparisonProducts')!) as Product[];

  const [comparisonProductWithReviewsAndRatings, setComparisonProductWithReviewsAndRatings] = useState<ProductWithReviewsAndRatings[] | null>(null);

  //初回読み込み時に、比較した商品に紐づくレビューをすべて取得し
  //comparisonProductWithReviewsAndRatingsを更新する
  useEffect(() => {
      const getComparisonProductWithReviewsAndRatings = async () => {

        //比較した商品の全レビュー情報を取得する関数
        const fetchAllReviewsForComparisonProducts = async () => {
          const q = query(collection(db, 'reviews'), where('productId', 'in', comparisonProducts.map(product => product.id)));
          const reviewsSnapshot = await getDocs(q);
          return reviewsSnapshot.docs.map(doc => doc.data() as Review);
        }

        //比較した商品ごとの全レビュー情報と評価の平均値を取得し、
        //comparisonProductWithReviewsAndRatingsに追加する関数
        const updateComparisonProductWithReviews = (allReviewsForComparisonProducts: Review[]) => {
          const newProductsWithReviewsAndAverageRatings = comparisonProducts.map(product => {
            const productAllReviews = allReviewsForComparisonProducts.filter(reviews => reviews.productId === product.id);

            return {
              ...product,
              reviews: productAllReviews,
              averageRatings: calcAverageRatings(productAllReviews),
            };
          });
          setComparisonProductWithReviewsAndRatings(newProductsWithReviewsAndAverageRatings);
        }

        const allReviewsForComparisonProducts = await fetchAllReviewsForComparisonProducts();
        updateComparisonProductWithReviews(allReviewsForComparisonProducts);
      }

      getComparisonProductWithReviewsAndRatings();
  }, []);

  return (
    <div className='mt-8'>
      <div className='inner'>
        <h2 className='text-xl font-bold border-b border-amber-200'>比較結果</h2>

        <ComparisonUserFilters
          userFilters={userFilters}
          setUserFilters={setUserFilters}
        />

        {comparisonProductWithReviewsAndRatings && (
          <ComparisonResultTable comparisonData={comparisonProductWithReviewsAndRatings}/>
        )}
      </div>
    </div>
  )
}

export default ComparisonResult