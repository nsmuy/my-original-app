import { UserProfileType } from "./UserProfile"
import { ProductType } from "./Product"

export type ReviewType = {
  reviewId: string,
  productId: string,
  luminosity: number, //ツヤ感
  coverage: number, //カバー力
  longevity: number, //崩れにくさ
  moisturizing: number, //保湿力
  comments: string,
  sendAt: string,
  userId: string,
  userAge: string,
  userGender: string,
  userSkinType: string,
}

export type ReviewWithProductType = {
  reviewId: string,
  luminosity: number, //ツヤ感
  coverage: number, //カバー力
  longevity: number, //崩れにくさ
  moisturizing: number, //保湿力
  comments: string,
  sendAt: string,
  reviewedProductInfo: ProductType,
}

export type ReviewWithProductAndUserType = {
  reviewId: string,
  luminosity: number, //ツヤ感
  coverage: number, //カバー力
  longevity: number, //崩れにくさ
  moisturizing: number, //保湿力
  comments: string,
  sendAt: string,
  reviewedProductInfo: ProductType,
  reviewerInfo: UserProfileType,
}

export type AverageRatingsType = {
  luminosity: number,
  coverage: number,
  longevity: number,
  moisturizing: number,
}