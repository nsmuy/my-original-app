'use client'

import React, { useEffect, useState } from 'react';
import { Product } from '@/types/Product';
import { useRouter, useParams } from 'next/navigation'
import ReviewsList from '@/components/review/ReviewsList'
import { db } from '../../firebase'
import { doc, getDoc } from 'firebase/firestore'
import { useAuthContext } from '@/auth/AuthContext';

const ProductReviews = () => {

  const params = useParams();
  const { loading } = useAuthContext();

  if (loading) {
    return <div>ローディング中...</div>;
  }

  const [productForReviews, setProductForReviews] = useState<Product[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      //パラメータの値をidに持つ商品情報を取得
      const productSnapshot = await getDoc(doc(db, 'products', params.id as string));
      const products = {
        ...productSnapshot.data(),
        id: params.id,
      }  as Product;

      setProductForReviews([products]);
      console.log(products)
    }
    fetchData();

  }, [params.id]);

  return (
    <div className='mt-8'>
      <div className='inner'>
        {productForReviews && <h2 className='font-bold border-b border-amber-200'>{productForReviews[0].name}の口コミ一覧</h2>}

        {productForReviews && <ReviewsList productsToShow={productForReviews}/>}

      </div>
    </div>
  )
}

export default ProductReviews