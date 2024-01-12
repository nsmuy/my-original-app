import { Review, AverageRatings } from "./Reviews";

export type Product = {
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

export type ProductWithReviews = {
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
  reviews: Review[];
}

export type ProductWithReviewsAndAverageRatings = {
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
  reviews: Review[];
  averageRatings: AverageRatings;
}