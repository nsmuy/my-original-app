import { UserProfile } from "./UserProfile"
import { Product } from "./Product"

export type Review = {
  reviewId: string,
  productId: string,
  userId: string,
  luminosity: number, //ツヤ感
  coverage: number, //カバー力
  longevity: number, //崩れにくさ
  moisturizing: number, //保湿力
  comments: string,
  sendAt: string,
}

export type ReviewWithProductAndUser = {
  reviewId: string,
  luminosity: number, //ツヤ感
  coverage: number, //カバー力
  longevity: number, //崩れにくさ
  moisturizing: number, //保湿力
  comments: string,
  sendAt: string,
  reviewedProductInfo: Product,
  reviewerInfo: UserProfile,
}

export type AverageRatings = {
  luminosity: number,
  coverage: number,
  longevity: number,
  moisturizing: number,
}