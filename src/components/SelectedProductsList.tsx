import React from 'react'
import { v4 as uuidv4 } from 'uuid';
import { ProductType } from '@/types/Product';
import Image from "next/image";

const SelectedProductsList = ( { selectedProducts } : { selectedProducts: ProductType[] }) => {
  return (
    <div>
      <h3 className='mt-8 font-bold border-b border-amber-200'>選択したファンデーション</h3>
      <div className="flex gap-4 overflow-scroll hide-scrollbar mt-8">
        {selectedProducts.map(product => (
          <div
            key={uuidv4()}
            className='w-[100px] flex-shrink-0'
          >
            <Image
              src={product.image}
              alt={product.name}
              width={100}
              height={100}
              style={{ objectFit: 'cover' }}
            ></Image>
            <div className='mt-2 px-1'>
              <p className='text-xs font-bold'>{product.brand}</p>
              <p className='text-xs'>{product.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SelectedProductsList