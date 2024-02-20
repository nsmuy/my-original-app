'use client';

import React, { useEffect, useState } from 'react'
import { collection, getDocs, query } from "firebase/firestore";
import { db } from '../firebase';
import { ProductType } from '@/types/Product';
import ReviewsList from '@/components/review/ReviewsList';

const AllReviews = () => {

  return (
    <div className='mt-8'>
      <ReviewsList productId='all' />
    </div>
  )
}

export default AllReviews