'use client'

import React, { useEffect, useState } from 'react';
import { Product } from '@/types/Product';
import { useRouter, useParams } from 'next/navigation'
import ReviewsList from '@/components/review/ReviewsList'
import { db } from '../../firebase'
import { doc, getDoc } from 'firebase/firestore'
import { useAuthContext } from '@/auth/AuthContext';

const ProductReviews = () => {

  const router = useRouter();
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
    }
    fetchData();

  }, [params.id]);

  return (
    <div>
      <h2>特定の商品のレビューだけを表示</h2>

      {productForReviews && <ReviewsList productsToShow={productForReviews}/>}
      
    </div>
  )
}

export default ProductReviews