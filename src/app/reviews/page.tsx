'use client';

import React, { useEffect, useState } from 'react'
import { collection, getDocs, query } from "firebase/firestore";
import { db } from '../firebase';
import { ProductType } from '@/types/Product';
import ReviewsList from '@/components/review/ReviewsList';

const AllReviews = () => {

  const [productsForReviews, setProductsForReviews] = useState<ProductType[] | null>(null);

  useEffect(() => {

    // 全商品の情報を取得する
    const fetchAllProducts = async () => {
      const productsSnapshot = await getDocs(query(collection(db, "products")));
      const products = productsSnapshot.docs.map(doc => {
        return {
          ...doc.data() as ProductType,
          id: doc.id,
        }
      })
      setProductsForReviews(products);
    }

    fetchAllProducts();
  }, []);

  return (
    <div className='mt-8'>
      <div className='inner'>
        <h2 className='font-bold border-b border-amber-200'>口コミ一覧（新着順）</h2>
        {productsForReviews && <ReviewsList productsToShow={productsForReviews}/>}
      </div>
    </div>
  )
}

export default AllReviews