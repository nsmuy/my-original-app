import { allBrands, allTypes } from '@/constants/productData';

// ブランドの選択肢を初期化
export const initialBrandCheckedFilter = Object.keys(allBrands).reduce((acc, brand) => {
  acc[brand] = false;
  return acc;
}, {});

// 種別の選択肢を初期化
export const initialTypeCheckedFilter = Object.keys(allTypes).reduce((acc, type) => {
  acc[type] = false;
  return acc;
}, {});