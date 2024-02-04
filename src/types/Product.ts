import { ReviewType, AverageRatingsType } from "./Reviews";

export type ProductType = {
  id: string;
  brand: string;
  name: string;
  price: number;
  type: 'liquid' | 'powder' | 'cream' | 'cushion' | 'other' ;
  spf: string;
  capacity: string;
  feature: string;
  color: number;
  image: string;
}

// export type ProductWithReviewsType = {
//   id: string;
//   brand: string;
//   name: string;
//   price: number;
//   type: 'liquid' | 'powder' | 'cream' | 'cushion' | 'other' ;
//   spf: string;
//   capacity: string;
//   feature: string;
//   color: number;
//   image: string;
//   reviews: ReviewType[];
// }

export type ProductWithReviewsAndRatingsType = {
  id: string;
  brand: string;
  name: string;
  price: number;
  type: 'liquid' | 'powder' | 'cream' | 'cushion' | 'other' ;
  spf: string;
  capacity: string;
  feature: string;
  color: number;
  image: string;
  reviews: ReviewType[];
  averageRatings: AverageRatingsType;
}