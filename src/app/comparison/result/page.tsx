'use client';

import React, { useEffect, useState, useCallback } from 'react'
import { ProductWithReviewsAndRatingsType, ProductType } from '@/types/Product';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/app/firebase';
import { ReviewType } from '@/types/Reviews';
import ComparisonResultTable from '@/components/comparison/ComparisonResultTable';
import { calcAverageRatings } from '@/functions/calcAverageRatings';
import ComparisonUserFilters from '@/components/comparison/ComparisonUserFilters';

const ComparisonResult = () => {

  const [comparisonProducts, setComparisonProducts] = useState<ProductType[]>([]);
  const [tableDataList, setTableDataList] = useState<ProductWithReviewsAndRatingsType[] | undefined>(undefined);
  const [originalTableDataList, setOriginalTableDataList] = useState<ProductWithReviewsAndRatingsType[]>([]);

  //比較した商品の全レビュー情報を取得する関数
  const fetchAllReviewsOfComparisonProducts = useCallback(async () => {
    if (comparisonProducts.length === 0) return [];

    const allReviewsForTableDataList = await Promise.all (comparisonProducts.map(async product => {
      const q = query(collection(db, 'reviews'), where('productId', '==', product.id));
      const reviewsSnapshot = await getDocs(q);
      return reviewsSnapshot.docs.map(doc => doc.data()) as ReviewType[];
    }));

    console.log("fetchAllReviewsOfComparisonProducts", allReviewsForTableDataList.flat());
    return allReviewsForTableDataList.flat();
  }, [comparisonProducts]);

  //商品ごとにレビューと評価点数をを格納する関数
  const updateReviewsForTableDataList = useCallback(( allReviewsOfComparisonProducts: ReviewType[] ) => {
    const reviewsAndRatingsForEachProducts = comparisonProducts.map(product => {
      const reviewsForProduct = allReviewsOfComparisonProducts.filter(reviews => reviews.productId === product.id);

      return {
        ...product,
        reviews: reviewsForProduct,
        averageRatings: calcAverageRatings(reviewsForProduct),
      }
    });

    setTableDataList(reviewsAndRatingsForEachProducts);
    setOriginalTableDataList(reviewsAndRatingsForEachProducts);
  }, [comparisonProducts]);

  //商品ごとのレビューと評価点数を格納を格納したデータを取得
  useEffect(() => {
    const getTableDataList = async () => {
      const allReviewsOfComparisonProducts = await fetchAllReviewsOfComparisonProducts();
      updateReviewsForTableDataList(allReviewsOfComparisonProducts);
    }

    getTableDataList();
  }, [fetchAllReviewsOfComparisonProducts, updateReviewsForTableDataList, comparisonProducts]);

  //初回読み込み時にlocalStorageから比較した商品を取得
  useEffect(() => {
    const newComparisonProducts = JSON.parse(localStorage.getItem('comparisonProducts')!) as ProductType[];

    if(newComparisonProducts) {
      setComparisonProducts(newComparisonProducts);
    }
  }, []);

  return (
    <div className='mt-8'>
      <div className='inner'>
        <h2 className='text-xl font-bold border-b border-amber-200'>比較結果</h2>

        {tableDataList && (
          <div>
            <ComparisonUserFilters
              setTableDataList={setTableDataList}
              originalTableDataList={originalTableDataList}
            />
              <ComparisonResultTable comparisonData={tableDataList}/>
          </div>
        )}
      </div>
    </div>
  )
}

export default ComparisonResult