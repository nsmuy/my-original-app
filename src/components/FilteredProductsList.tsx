import React from 'react'
import { v4 as uuidv4 } from 'uuid';
import { Product } from '@/types/Product';

const FilteredProductsList = ({filteredProducts, selectedProducts, setSelectedProducts} : {
  filteredProducts: Product[],
  selectedProducts: Product[],
  setSelectedProducts: React.Dispatch<React.SetStateAction<Product[]>>}
) => {

  const handleSelectedProductsChange = (product: Product, isChecked: boolean) => {
    if(isChecked) {
      setSelectedProducts(prevState => [...prevState, product]);
    } else {
      setSelectedProducts(prevState => prevState.filter(p => p.name !== product.name));
    }
  }

  return (
    <div>
      {/* フィルタリングした商品を表示 */}
      <div className='flex gap-4 overflow-scroll mt-8'>
        {filteredProducts.length > 0 ? (filteredProducts.map(product => (
          <div
            key={uuidv4()}
            className='w-[100px] flex-shrink-0'
            onClick={() => handleSelectedProductsChange(product, !selectedProducts.includes(product))}
          >
            <img src={product.image} alt={product.name} className='w-full'/>
            <div className='mt-2 px-1'>
              <p>{product.brand}</p>
              <p className='text-xs'>{product.name}</p>
            </div>
          </div>
        ))) : (
          <p>該当する商品はありません。</p>
        )}
      </div>
    </div>
  )
}

export default FilteredProductsList