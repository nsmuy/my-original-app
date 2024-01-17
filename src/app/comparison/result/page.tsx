'use client';

import React, { useEffect, useState } from 'react'
import { ProductWithReviewsAndAverageRatings, Product } from '@/types/Product';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/app/firebase';
import { Review } from '@/types/Reviews';
import { useRouter } from 'next/navigation';

const ComparisonResult = () => {

  const router = useRouter();
  const comparisonProducts = JSON.parse(localStorage.getItem('comparisonProducts')!) as Product[];

  const [comparisonProductWithReviewsAndAverageRatings, setComparisonProductWithReviewsAndAverageRatings] = useState<ProductWithReviewsAndAverageRatings[] | null>(null);

  //評価の平均値を求めて、comparisonProductWithReviewsを更新する
  const calcAverageRatings = (productReviews: Review[]) => {
    let sumRatings = {
      luminosity: 0,
      coverage: 0,
      longevity: 0,
      moisturizing: 0,
    };

    //商品ごとの評価の合計値を求める
    productReviews.forEach(review => {
      sumRatings.luminosity += review.luminosity;
      sumRatings.coverage += review.coverage;
      sumRatings.longevity += review.longevity;
      sumRatings.moisturizing += review.moisturizing;
    });

    const averageRatings = {
      luminosity: Math.round((sumRatings.luminosity / productReviews.length) * 100) / 100,
      coverage: Math.round((sumRatings.coverage / productReviews.length) * 100) / 100,
      longevity: Math.round((sumRatings.longevity / productReviews.length) * 100) / 100,
      moisturizing: Math.round((sumRatings.moisturizing / productReviews.length) * 100) / 100,
    }

    console.log(averageRatings);
    return averageRatings;
  }

  //初回読み込み時に、比較した商品に紐づくレビューをすべて取得し
  //comparisonProductWithReviewsAndAverageRatingsを更新する
  useEffect(() => {
      const getComparisonProductWithReviewsAndAverageRatings = async () => {

        //比較した商品の全レビュー情報を取得する関数
        const fetchAllReviewsForComparisonProducts = async () => {
          const q = query(collection(db, 'reviews'), where('productId', 'in', comparisonProducts.map(product => product.id)));
          const reviewsSnapshot = await getDocs(q);
          return reviewsSnapshot.docs.map(doc => doc.data() as Review);
        }

        //比較した商品ごとの全レビュー情報と評価の平均値を取得し、
        //comparisonProductWithReviewsAndAverageRatingsに追加する関数
        const updateComparisonProductWithReviews = (allReviewsForComparisonProducts: Review[]) => {
          const newProductsWithReviewsAndAverageRatings = comparisonProducts.map(product => {
            const productReviews = allReviewsForComparisonProducts.filter(reviews => reviews.productId === product.id);

            return {
              ...product,
              reviews: productReviews,
              averageRatings: calcAverageRatings(productReviews),
            };
          });
          setComparisonProductWithReviewsAndAverageRatings(newProductsWithReviewsAndAverageRatings);
        }

        const allReviewsForComparisonProducts = await fetchAllReviewsForComparisonProducts();
        updateComparisonProductWithReviews(allReviewsForComparisonProducts);
      }

      getComparisonProductWithReviewsAndAverageRatings();
  }, []);

  return (
    <div className='mt-8'>
      <div className='inner'>
        <h2 className='text-xl font-bold border-b border-amber-200'>比較結果</h2>

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
              {comparisonProductWithReviewsAndAverageRatings &&
              comparisonProductWithReviewsAndAverageRatings.map(product => {
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
    </div>
  )
}

export default ComparisonResult