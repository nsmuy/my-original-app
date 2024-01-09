import React, { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import { Product } from '@/types/Product';
import { db } from '@/app/firebase';
import { collection, getDocs, query } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

const FilteredProductsList = ({
  checkedFilters, filteredProducts, selectedProducts, setFilteredProducts, setSelectedProducts} : {
  checkedFilters: {
    brands: { [key: string]: boolean },
    types: { [key: string]: boolean }
  },
  filteredProducts: Product[],
  selectedProducts: Product[],
  setFilteredProducts: React.Dispatch<React.SetStateAction<Product[]>>,
  setSelectedProducts: React.Dispatch<React.SetStateAction<Product[]>>}
) => {

  const router = useRouter();
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  // ページ読み込み時にfirebaseからすべての商品を取得
  useEffect(() => {
    const fetchProducts = async () => {
      const productsRef = collection(db, 'products');
      const q = query(productsRef);

      try {
        const querySnapshot = await getDocs(q);
        const products: Product[] = querySnapshot.docs.map(doc => ({
          ...doc.data() as Product,
          id: doc.id, //ドキュメントIDをProductのidフィールドにセット
        }));

        setAllProducts(products);
        setFilteredProducts(products);
      } catch (error) {
        console.error("Error fetching products: ", error);
      }
    }
    fetchProducts();
  }, [router])

  // checkedFilterが更新されたとき、商品を再度絞り込み
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

  const handleSelectedProductsChange = (product: Product, isChecked: boolean) => {
    if(isChecked) {
      setSelectedProducts(prevState => [...prevState, product]);
    } else {
      setSelectedProducts(prevState => prevState.filter(p => p.name !== product.name));
    }
  }

  return (
    <div>
      <div className='flex gap-4 overflow-scroll mt-8'>
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => {
            // 商品が選択されているかどうかをチェック
            const isSelected = selectedProducts.includes(product);

            return (
              <div
                key={uuidv4()}
                className={`w-[100px] flex-shrink-0 ${isSelected ? 'selectedProduct' : ''}`}
                onClick={() => handleSelectedProductsChange(product, !isSelected)}
              >
                <div className='relative'>
                  <img src={product.image} alt={product.name} className='w-full'/>
                  {isSelected && 
                    <div className='absolute inset-0 bg-gray-300 opacity-50 flex justify-center items-center'>
                      <span className='font-bold'>選択中</span>
                    </div>}
                </div>
                <div className='mt-2 px-1'>
                  <p>{product.brand}</p>
                  <p className='text-xs'>{product.name}</p>
                </div>
              </div>
            );
          })
        ) : (
          <p>該当する商品はありません。</p>
        )}
      </div>
    </div>
  )
}

export default FilteredProductsList