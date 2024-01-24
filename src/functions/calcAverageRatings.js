

//評価の平均値を求めて、comparisonProductWithReviewsを更新する
export const calcAverageRatings = (productReviews) => {
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

  return averageRatings;
}