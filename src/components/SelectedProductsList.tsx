import React from 'react'
import { v4 as uuidv4 } from 'uuid';
import { Product } from '@/types/Product';

const SelectedProductsList = ( { selectedProducts } : { selectedProducts: Product[] }) => {
  return (
    <div>
      <h3 className='mt-8'>選択したファンデーション</h3>
      <div className="flex gap-4 overflow-scroll mt-8">
        {selectedProducts.map(product => (
          <div
            key={uuidv4()}
            className='w-[100px] flex-shrink-0'
          >
            <img src={product.image} alt={product.name} className='w-full'/>
            <div className='mt-2 px-1'>
              <p>{product.brand}</p>
              <p className='text-xs'>{product.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SelectedProductsList