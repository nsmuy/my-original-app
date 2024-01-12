'use client';

import React, { useEffect, useState } from 'react'
import { ProductWithReviewsAndAverageRatings, Product } from '@/types/Product';
import { average, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/app/firebase';
import { Review } from '@/types/Reviews';

const ComparisonResult = () => {

  const comparisonProducts = JSON.parse(localStorage.getItem('comparisonProducts')!) as Product[];

  const [comparisonProductWithReviewsAndAverageRatings, setComparisonProductWithReviewsAndAverageRatings] = useState<ProductWithReviewsAndAverageRatings[]>([
    {
      id: '',
      brand: '',
      name: '',
      price: 0,
      type: 'other',
      spf: '',
      capacity: '',
      feature: '',
      color: 0,
      image: '',
      reviews: [],
      averageRatings: {
        luminosity: 0,
        coverage: 0,
        longevity: 0,
        moisturizing: 0,
      },
    },
  ]);

  //評価の平均値を求めて、comparisonProductWithReviewsを更新する
  const calcAverageRatings = (productReviews: Review[]) => {
    let sumRatings = {
      luminosity: 0,
      coverage: 0,
      longevity: 0,
      moisturizing: 0,
    };
    console.log(productReviews)
    console.log(sumRatings)

    //商品ごとの評価の合計値を求める
    productReviews.forEach(review => {
      sumRatings.luminosity += review.luminosity;
      sumRatings.coverage += review.coverage;
      sumRatings.longevity += review.longevity;
      sumRatings.moisturizing += review.moisturizing;
      console.log(sumRatings)
    });

    const averageRatings = {
      luminosity: sumRatings.luminosity / productReviews.length,
      coverage: sumRatings.coverage / productReviews.length,
      longevity: sumRatings.longevity / productReviews.length,
      moisturizing: sumRatings.moisturizing / productReviews.length,
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
              <th>ツヤ感</th>
              <th>カバー力</th>
              <th>崩れにくさ</th>
              <th>保湿力</th>
            </tr>
          </thead>
          <tbody>
            {comparisonProductWithReviewsAndAverageRatings.map(product => {
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
                  <td>{product.averageRatings.luminosity}</td>
                  <td>{product.averageRatings.coverage}</td>
                  <td>{product.averageRatings.longevity}</td>
                  <td>{product.averageRatings.moisturizing}</td>
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