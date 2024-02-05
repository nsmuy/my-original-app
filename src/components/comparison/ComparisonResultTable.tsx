'use client';

import React from 'react'
import { ProductWithReviewsAndRatingsType } from '@/types/Product'
import { useRouter } from 'next/navigation'
import Image from "next/image";

type ComparisonResultTableProps = {
  comparisonData: ProductWithReviewsAndRatingsType[]
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
                <tr key={product.id} className='text-center'>
                  <td>
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={100}
                      height={100}
                      style={{ objectFit: 'cover' }}
                      ></Image></td>
                  <td>{product.brand}</td>
                  <td>{product.name}</td>
                  <td>￥{product.price}</td>
                  <td>{product.spf}</td>
                  <td>{product.color}色</td>
                  <td>{product.capacity}</td>
                  <td className='text-justify'>{product.feature}</td>
                  <td>{product.averageRatings.luminosity || '-'}</td>
                  <td>{product.averageRatings.coverage || '-'}</td>
                  <td>{product.averageRatings.longevity || '-'}</td>
                  <td>{product.averageRatings.moisturizing || '-'}</td>
                  <td>{product.averageRatings.luminosity || '-'}</td>
                  <td>
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