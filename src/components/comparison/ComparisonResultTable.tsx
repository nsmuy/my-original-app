'use client';

import React from 'react'
import { ProductWithReviewsAndAverageRatings } from '@/types/Product'
import { useRouter } from 'next/navigation'

type ComparisonResultTableProps = {
  comparisonData: ProductWithReviewsAndAverageRatings[]
}

const ComparisonResultTable = ({comparisonData}: ComparisonResultTableProps ) => {

  const router = useRouter();

  return (
    <div>
      <div className='overflow-scroll hide-scrollbar mt-4'>
        {/* writing-modeプロパティがTailWindCSSにないため, 独自のcomparisonTableクラスを作成*/}
        <table className='comparisonTable text-sm'>
          <thead>
            <tr>
              <th></th>
              <th>ブランド</th>
              <th>商品名</th>
              <th>価格（税込）</th>
              <th>SPF</th>
              <th>色展開</th>
              <th>容量</th>
              <th>商品詳細</th>
              <th>ツヤ感</th>
              <th>カバー力</th>
              <th>崩れにくさ</th>
              <th>保湿力</th>
              <th>口コミを見る</th>
            </tr>
          </thead>
          <tbody>
            {comparisonData && comparisonData.map(product => {
              return (
                <tr key={product.id}>
                  <td><img src={product.image} alt={product.name} /></td>
                  <td className='text-center'>{product.brand}</td>
                  <td>{product.name}</td>
                  <td className='text-center'>￥{product.price}</td>
                  <td className='text-center'>{product.spf}</td>
                  <td className='text-center'>{product.color}色</td>
                  <td className='text-center'>{product.capacity}</td>
                  <td>{product.feature}</td>
                  <td className='text-center'>{product.averageRatings.luminosity || '-'}</td>
                  <td className='text-center'>{product.averageRatings.coverage || '-'}</td>
                  <td className='text-center'>{product.averageRatings.longevity || '-'}</td>
                  <td className='text-center'>{product.averageRatings.moisturizing || '-'}</td>
                  <td className='text-center'>
                    <button
                      onClick={() => router.push(`/reviews/${product.id}`)}
                      className='bg-amber-200 px-4 py-1 rounded-lg hover:bg-amber-500 hover:text-white'
                    >
                      この商品の<br />レビューを見る
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ComparisonResultTable