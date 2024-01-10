import { db } from '@/app/firebase';
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