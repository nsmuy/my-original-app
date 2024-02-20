'use client'

import React, { useEffect, useState } from 'react';
import { ProductType } from '@/types/Product';
import { useRouter, useParams } from 'next/navigation'
import ReviewsList from '@/components/review/ReviewsList'
import { db } from '../../firebase'
import { doc, getDoc } from 'firebase/firestore'
import { useAuthContext } from '@/auth/AuthContext';

const ProductReviews = () => {

  const params = useParams();
  const { loading } = useAuthContext();

  // if (loading) {
  //   return <div>ローディング中...</div>;
  // }

  return (
    <div className='m t-8'>
      <ReviewsList productId={params.id as string}/>
    </div>
  )
}

export default ProductReviews