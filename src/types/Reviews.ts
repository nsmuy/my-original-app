import { UserProfile } from "./UserProfile"
import { Product } from "./Product"

export type Review = {
  reviewId: string,
  productId: string,
  userId: string,
  luminosity: string, //ツヤ感
  coverage: string, //カバー力
  longevity: string, //崩れにくさ
  moisturizing: string, //保湿力
  comments: string,
  sendAt: string,
}

export type CompleteReview = {
  reviewId: string,
  luminosity: string, //ツヤ感
  coverage: string, //カバー力
  longevity: string, //崩れにくさ
  moisturizing: string, //保湿力
  comments: string,
  sendAt: string,
  reviewedProductInfo: Product,
  reviewerInfo: UserProfile,
}