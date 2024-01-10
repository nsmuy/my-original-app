"use client"

import React, { useState } from 'react';
import { useAuthContext } from '../../auth/AuthContext'
import { useRouter } from 'next/navigation';
import useLoginGuard from '@/auth/useLoginGuard';
import { Product } from '@/types/Product';
import ProductFiltersSelector from '@/components/ProductFilterSelector';
import FilteredProductsList from '@/components/FilteredProductsList';
import SelectedProductsList from '@/components/SelectedProductsList';

const Comparison = () => {

  useLoginGuard();
  const router = useRouter();
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

  const handleCompareProducts = (selectedProducts: Product[]) => {

    if(selectedProducts.length < 2) {
      alert('2つ以上選んでください');
      return;
    }

    // localStorageに比較した商品を保存
    localStorage.setItem('comparisonProducts', JSON.stringify(selectedProducts));
    router.push('/comparison/result');
  }

  return (
    <div>
      <h2>比較したいファンデーションを選んでね</h2>

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
        singleSelectMode={false}
      />

      {/* フィルタリングした商品の中から、更に比較する商品を選んで表示 */}
      <SelectedProductsList selectedProducts={selectedProducts} />

      <button
        type='submit'
        onClick={() => handleCompareProducts(selectedProducts)}
        className='bg-gray-700 px-4 py-2 text-white rounded-md mt-8'
      >
        比較する
      </button>
    </div>
  )
}

export default Comparison