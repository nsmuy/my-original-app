'use client';

import React, { useEffect, useState } from 'react'
import { ProductWithReviewsAndAverageRatings, Product } from '@/types/Product';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/app/firebase';
import { Review } from '@/types/Reviews';
import ComparisonResultTable from '@/components/comparison/ComparisonResultTable';
import { calcAverageRatings } from '@/functions/calcAverageRatings';

const ComparisonResult = () => {

  const comparisonProducts = JSON.parse(localStorage.getItem('comparisonProducts')!) as Product[];

  const [comparisonProductWithReviewsAndAverageRatings, setComparisonProductWithReviewsAndAverageRatings] = useState<ProductWithReviewsAndAverageRatings[] | null>(null);

  //初回読み込み時に、比較した商品に紐づくレビューをすべて取得し
  //comparisonProductWithReviewsAndAverageRatingsを更新する
  useEffect(() => {
      const getComparisonProductWithReviewsAndAverageRatings = async () => {

        //比較した商品の全レビュー情報を取得する関数
        const fetchAllReviewsForComparisonProducts = async () => {
          const q = query(collection(db, 'reviews'), where('productId', 'in', comparisonProducts.map(product => product.id)));
          const reviewsSnapshot = await getDocs(q);
          return reviewsSnapshot.docs.map(doc => doc.data() as Review);
        }

        //比較した商品ごとの全レビュー情報と評価の平均値を取得し、
        //comparisonProductWithReviewsAndAverageRatingsに追加する関数
        const updateComparisonProductWithReviews = (allReviewsForComparisonProducts: Review[]) => {
          const newProductsWithReviewsAndAverageRatings = comparisonProducts.map(product => {
            const productReviews = allReviewsForComparisonProducts.filter(reviews => reviews.productId === product.id);

            return {
              ...product,
              reviews: productReviews,
              averageRatings: calcAverageRatings(productReviews),
            };
          });
          setComparisonProductWithReviewsAndAverageRatings(newProductsWithReviewsAndAverageRatings);
        }

        const allReviewsForComparisonProducts = await fetchAllReviewsForComparisonProducts();
        updateComparisonProductWithReviews(allReviewsForComparisonProducts);
      }

      getComparisonProductWithReviewsAndAverageRatings();
  }, []);

  return (
    <div className='mt-8'>
      <div className='inner'>
        <h2 className='text-xl font-bold border-b border-amber-200'>比較結果</h2>

        {comparisonProductWithReviewsAndAverageRatings && (
          <ComparisonResultTable comparisonData={comparisonProductWithReviewsAndAverageRatings}/>
        )}
      </div>
    </div>
  )
}

export default ComparisonResult