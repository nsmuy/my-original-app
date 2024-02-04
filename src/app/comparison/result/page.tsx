'use client';

import React, { useEffect, useState } from 'react'
import { ProductWithReviewsAndRatingsType, ProductType } from '@/types/Product';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/app/firebase';
import { ReviewType } from '@/types/Reviews';
import ComparisonResultTable from '@/components/comparison/ComparisonResultTable';
import { calcAverageRatings } from '@/functions/calcAverageRatings';
import { UserFilterType } from '@/types/UserProfile';
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

  const [userFilters, setUserFilters] = useState<UserFilterType>(initialUserFilters);
  const comparisonProducts = JSON.parse(localStorage.getItem('comparisonProducts')!) as ProductType[];

  const [tableDataList, setTableDataList] = useState<ProductWithReviewsAndRatingsType[] | null>(null);

  //比較した商品の全レビュー情報を取得する関数
  const fetchAllReviewsOfComparisonProducts = async () => {
    const q = query(collection(db, 'reviews'), where('productId', 'in', comparisonProducts.map(product => product.id)));
    const reviewsSnapshot = await getDocs(q);
    return reviewsSnapshot.docs.map(doc => doc.data() as ReviewType);
  }

  //商品ごとにレビューと評価点数をを格納する関数
  const updateReviewsForTableDataList = ( allReviewsOfComparisonProducts: ReviewType[] ) => {
    const reviewsAndRatingsForEachProducts = comparisonProducts.map(product => {
      const reviewsForProduct = allReviewsOfComparisonProducts.filter(reviews => reviews.productId === product.id);

      return {
        ...product,
        reviews: reviewsForProduct,
        averageRatings: calcAverageRatings(reviewsForProduct),
      }
    });

    setTableDataList(reviewsAndRatingsForEachProducts);
  }

  //初回読み込み時に、商品ごとのレビューと評価点数を格納を格納したデータを取得
  useEffect(() => {
      const getTableDataList = async () => {
        const allReviewsOfComparisonProducts = await fetchAllReviewsOfComparisonProducts();
        updateReviewsForTableDataList(allReviewsOfComparisonProducts);
      }

      getTableDataList();
  }, []);

  return (
    <div className='mt-8'>
      <div className='inner'>
        <h2 className='text-xl font-bold border-b border-amber-200'>比較結果</h2>

        {tableDataList && (
          <div>
            <ComparisonUserFilters
              userFilters={userFilters}
              setUserFilters={setUserFilters}
              tableDataList={tableDataList}
              setTableDataList={setTableDataList}
            />
              <ComparisonResultTable comparisonData={tableDataList}/>
          </div>
        )}
      </div>
    </div>
  )
}

export default ComparisonResult