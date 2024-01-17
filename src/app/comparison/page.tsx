"use client"

import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../../auth/AuthContext'
import { useRouter } from 'next/navigation';
import useLoginGuard from '@/auth/useLoginGuard';
import { Product } from '@/types/Product';
import ProductFiltersSelector from '@/components/ProductFilterSelector';
import FilteredProductsList from '@/components/FilteredProductsList';
import SelectedProductsList from '@/components/SelectedProductsList';
import { allBrands, allTypes } from '@/constants/productData';

const Comparison = () => {

  useLoginGuard();
  const router = useRouter();
  const { loading } = useAuthContext();

  if (loading) {
    return <div>ローディング中...</div>;
  }

  const [checkedFilters, setCheckedFilters] = useState({
    brands: {},
    types: {},
  })

  useEffect(() => {
      //ブランドの初期化
      const initialBrandCheckedFilter = Object.keys(allBrands).reduce((acc: { [key: string]: boolean }, brand: string) => {
        acc[brand] = false;
        return acc;
      }, {} as { [key: string]: boolean });
      //タイプの初期化
      const initialTypeCheckedFilter = Object.keys(allTypes).reduce((acc: { [key: string]: boolean }, type: string) => {
        acc[type] = false;
        return acc;
      }, {} as { [key: string]: boolean });

      setCheckedFilters({
        brands: initialBrandCheckedFilter,
        types: initialTypeCheckedFilter
      })
  }, [])

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

  useEffect(() => {
    console.log(checkedFilters)
  }, [checkedFilters]);

  return (
    <div className='mt-8'>
      <div className='inner'>
        <h2 className='font-bold border-b border-amber-200'>比較したいファンデーションを選んでください</h2>

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
        {selectedProducts.length > 0 && (
          <div>
            <SelectedProductsList selectedProducts={selectedProducts} />
            <button
              type='submit'
              onClick={() => handleCompareProducts(selectedProducts)}
              className='bg-amber-500 px-6 py-2 text-white font-bold rounded-md mt-6'
            >
              比較する
            </button>
          </div>
        )}

      </div>
    </div>
  )
}

export default Comparison