'use client';

import React from 'react'
import { Product } from '@/types/Product';

const ComparisonResult = () => {

  const comparisonProducts = JSON.parse(localStorage.getItem('comparisonProducts')!) as Product[];

  console.log(comparisonProducts);
  return (
    <div>
      <h1>比較結果</h1>

      <div className='overflow-scroll'>
        {/* writing-modeプロパティがTailWindCSSにないため, 独自のcomparisonTableクラスを作成*/}
        <table className='comparisonTable'>
          <thead>
            <tr>
              <th></th>
              <th>ブランド</th>
              <th>商品名</th>
              <th>価格</th>
              <th>SPF</th>
              <th>色展開</th>
              <th>容量</th>
              <th>商品詳細</th>
            </tr>
          </thead>
          <tbody>
            {comparisonProducts.map(product => {
              return (
                <tr key={product.id}>
                  <td><img src={product.image} alt={product.name} /></td>
                  <td>{product.brand}</td>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.spf}</td>
                  <td>{product.color}</td>
                  <td>{product.capacity}</td>
                  <td>{product.feature}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ComparisonResult