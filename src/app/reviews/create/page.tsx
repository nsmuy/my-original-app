"use client"

import React, { useState } from 'react';
import { useAuthContext } from '../../../auth/AuthContext'
import { useRouter } from 'next/navigation';
import useLoginGuard from '@/auth/useLoginGuard';
import { Product } from '@/types/Product';
import ProductFiltersSelector from '@/components/ProductFilterSelector';
import FilteredProductsList from '@/components/FilteredProductsList';
import SelectedProductsList from '@/components/SelectedProductsList';

const CreateReviews = () => {
  useLoginGuard();
  // const router = useRouter();
  const { loading } = useAuthContext();

  if (loading) {
    return <div>ローディング中...</div>;
  }

  // チェックボックスの状態を管理する状態変数
  const [checkedFilters, setCheckedFilters] = useState<{
    brands: { [key: string]: boolean };
    types: { [key: string]: boolean };
  }>({
    brands: {
      dior: false,
      shiseido: false,
      nars: false,
      albion: false,
    },
    types: {
      liquid: false,
      powder: false,
      cream: false,
      cushion: false,
    },
  });

  //比較するために選んだ商品を保存する状態変数
  const [selectedProducts, setSelectedProducts] = useState<
  Product[]>([]);

  return (
    <div>
      <h2>口コミしたい商品を選んでね！</h2>
      
      {/* 商品を絞り込み */}
      <ProductFiltersSelector
        checkedFilters={checkedFilters}
        setCheckedFilters={setCheckedFilters}
      />

      {/* フィルタリングした商品を表示 */}
      <FilteredProductsList
        checkedFilters={checkedFilters}
        selectedProducts={selectedProducts}
        setSelectedProducts={setSelectedProducts}
      />

    </div>
  )
}

export default CreateReviews