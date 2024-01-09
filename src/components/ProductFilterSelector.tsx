import { db } from '@/app/firebase';
import { collection, getDocs, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { Product } from '@/types/Product';
import { useRouter } from 'next/navigation';

const ProductFilterSelector = ( { setFilteredProducts }: {
   setFilteredProducts: React.Dispatch<React.SetStateAction<Product[]>> 
}) => {

  const router = useRouter();

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  // チェックボックスの状態を管理する状態変数
  const [checkedFilters, setCheckedFilters] = useState<{
    brands: { [key: string]: boolean };
    types: { [key: string]: boolean };
  }>({
    brands: {
      dior: false,
      shiseido: false,
      nars: false,
      albion: false,
    },
    types: {
      liquid: false,
      powder: false,
      cream: false,
      cushion: false,
    },
  });

  const handleFiltersChange = (
    category: 'brands' | 'types',
    value: string,
    checked: boolean
  ) => {
    setCheckedFilters(prevState => ({
      ...prevState,
      [category]: {
        ...prevState[category],
        [value]: checked
      }
    }));
  }

  // ページ読み込み時にfirebaseからすべての商品を取得
  useEffect(() => {
    const fetchProducts = async () => {
      const productsRef = collection(db, 'products');
      const q = query(productsRef);

      try {
        const querySnapshot = await getDocs(q);
        const products: Product[] = querySnapshot.docs.map(doc => ({
          ...doc.data() as Product,
        }));

        setAllProducts(products);
        setFilteredProducts(products);
      } catch (error) {
        console.error("Error fetching products: ", error);
      }
    }
    fetchProducts();
  }, [router])

  // selectedFilterが更新されたとき、商品を絞り込み
  useEffect(() => {
    // 選択されたブランドのキーを取得
    const selectedBrandKeys = Object.keys(checkedFilters.brands).filter(brand => checkedFilters.brands[brand]);
  
    // 選択されたタイプのキーを取得
    const selectedTypeKeys = Object.keys(checkedFilters.types).filter(type => checkedFilters.types[type]);

    // 商品をフィルタリング
    const newFilteredProducts = allProducts.filter(product => {
      const brandMatch = selectedBrandKeys.length === 0 || selectedBrandKeys.includes(product.brand.toLowerCase());
      const typeMatch = selectedTypeKeys.length === 0 || selectedTypeKeys.includes(product.type.toLowerCase());

      return brandMatch && typeMatch;
    });
  
    setFilteredProducts(newFilteredProducts);
  }, [checkedFilters]);

  return (
    <div>
      <form>
        {/* ブランド選択 */}
        <h3 className='mt-4'>ブランドを選択</h3>
        <input
          id="dior"
          type="checkbox"
          checked={checkedFilters.brands.dior}
          onChange={(e) =>handleFiltersChange('brands', 'dior', e.target.checked)}
        />
        <label htmlFor="dior">DIOR</label>

        <input
          id="shiseido"
          type="checkbox"
          checked={checkedFilters.brands.shiseido}
          onChange={(e) =>handleFiltersChange('brands', 'shiseido', e.target.checked)}
        />
        <label htmlFor="dior">SHISEIDO</label>

        <input
          id="nars"
          type="checkbox"
          checked={checkedFilters.brands.nars}
          onChange={(e) =>handleFiltersChange('brands', 'nars', e.target.checked)}
        />
        <label htmlFor="nars">NARS</label>

        <input
          id="albion"
          type="checkbox"
          checked={checkedFilters.brands.albion}
          onChange={(e) =>handleFiltersChange('brands', 'albion', e.target.checked)}
        />
        <label htmlFor="albion">ALBION</label>

        {/* ファンデーションタイプから選ぶ */}
        <h3 className='mt-4'>種別を選択</h3>
      
        <input
          id="liquid"
          type="checkbox"
          checked={checkedFilters.types.liquid}
          onChange={(e) =>handleFiltersChange('types', 'liquid', e.target.checked)}
        />
        <label htmlFor="liquid">リキッド</label>

        <input
          id="powder"
          type="checkbox"
          checked={checkedFilters.types.powder}
          onChange={(e) =>handleFiltersChange('types', 'powder', e.target.checked)}
        />
        <label htmlFor="powder">パウダー</label>

        <input
          id="cream"
          type="checkbox"
          checked={checkedFilters.types.cream}
          onChange={(e) =>handleFiltersChange('types', 'cream', e.target.checked)}
        />
        <label htmlFor="cream">クリーム</label>

        <input
          id="cushion"
          type="checkbox"
          checked={checkedFilters.types.cushion}
          onChange={(e) =>handleFiltersChange('types', 'cushion', e.target.checked)}
        />
        <label htmlFor="cushion">クッション</label>

      </form>
    </div>
  )
}

export default ProductFilterSelector