"use client"

import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAuthContext } from '../../auth/AuthContext';
import useLoginGuard from '@/auth/useLoginGuard';
import { Product } from '@/types/Product';
import ProductFiltersSelector from '@/components/ProductFilterSelector';
import FilteredProductsList from '@/components/FilteredProductsList';

const Comparison = () => {

  useLoginGuard();
  const { loading } = useAuthContext();

  if (loading) {
    return <div>ローディング中...</div>;
  }

  //フィルタリングされた商品を保存する状態変数
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  //比較するために選んだ商品を保存する状態変数
  const [selectedProducts, setSelectedProducts] = useState<
  Product[]>([]);

  const handleCompareProducts = () => {
    
  }

  return (
    <div>
      <h2>比較したいファンデーションを選んでね</h2>

      <ProductFiltersSelector setFilteredProducts={setFilteredProducts}/>

      <FilteredProductsList
        filteredProducts={filteredProducts}
        selectedProducts={selectedProducts}
        setSelectedProducts={setSelectedProducts}
      />

      <div>
        <h3 className='mt-8'>選択したファンデーション</h3>
        <div className="flex gap-4 overflow-scroll mt-8">
          {selectedProducts.map(product => (
            <div
              key={uuidv4()}
              className='w-[100px] flex-shrink-0'
            >
              <img src={product.image} alt={product.name} className='w-full'/>
              <div className='mt-2 px-1'>
                <p>{product.brand}</p>
                <p className='text-xs'>{product.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        type='submit'
        onClick={handleCompareProducts}
        className='bg-gray-700 px-4 py-2 text-white rounded-md mt-8'
      >
        比較する
      </button>
    </div>
  )
}

export default Comparison